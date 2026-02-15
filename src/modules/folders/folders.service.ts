import { prisma } from "../../config/prisma.js"
import ApiError from "../../utils/ApiError.js"
import checkForCycle from "../../utils/checkforCycle.js";
import { hasFolderAccess } from "../../utils/helper.js";
import { PassThrough } from "stream";
import archiver from 'archiver'
import { Prisma } from "../../../generated/prisma/index.js";
import { s3 } from "../../storage/s3.client.js";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3_BUCKET } from "../../config/env.js";
import { generateDownloadUrl, getObjectWithRetry } from "../../storage/s3.helpers.js";
import { Upload } from "@aws-sdk/lib-storage";

export const createFolder = async (name: string, user_id: string, parent_id?: string) => {
    if (parent_id) {
        const parent = await prisma.folders.findFirst({
            where: {
                id: parent_id,
                user_id,
                is_deleted: false
            }
        })

        if (!parent) {
            throw new ApiError(404, "parent folder not found");
        }

        
    }
    const folder = await prisma.folders.create({
        data: {
            name, 
            user_id, 
            parent_id: parent_id ?? null
        }
    })

    return folder
}   

export const getFolder = async (user_id: string, folder_id: string | undefined) => {
    if (!folder_id) {
        const folders = await prisma.folders.findMany({
            where: {user_id, is_deleted: false, parent_id: null}
        });
        const files = await prisma.files.findMany({
            where: {user_id, fileStatus: "UPLOADED", folder_id: null}
        })
        return {
            id: null,
            name: "root",
            children: folders,
            files: files
        };
    }
    const folder = await prisma.folders.findUnique({
        where: { id: folder_id },
        include: {
            children: { where: { is_deleted: false } },
            files: { where: { fileStatus: "UPLOADED" } }
        }
    });

    if (!folder) {
        throw new ApiError(400, "file not found");
    }
    if (folder.user_id !== user_id && !(await hasFolderAccess(folder_id, user_id))) {
        throw new ApiError(403, "access denied");
    }
    return folder
}

export const listRootFolder = async (user_id: string) => {
    const folders = await prisma.folders.findMany({
        where: {user_id, parent_id: null, is_deleted: false}
    })
    return folders
} 

export const renameFolder = async (user_id: string, folder_id: string, name: string) => {
    const folder = await prisma.folders.findFirst({
        where: {id: folder_id, is_deleted: false}
    })

    if (!folder) {
        throw new ApiError(404, "folder not found")
    }
    if (folder.user_id !== user_id) {
        throw new ApiError(403, "access denied")
    }
    return await prisma.folders.update({
        where: {user_id, id: folder_id, is_deleted: false},
        data: {name}
    })
}

export const deleteFolder = async (user_id: string, folder_id: string) => {

    await prisma.$transaction(async (tx) => {

        const folderIds = await tx.$queryRaw<{ id: string }[]>`
            WITH RECURSIVE folder_tree AS (
                SELECT id
                FROM "Folders"
                WHERE id = ${folder_id} AND user_id = ${user_id}
                AND is_deleted = false

                UNION ALL

                SELECT f.id
                FROM "Folders" f
                INNER JOIN folder_tree ft ON f.parent_id = ft.id
                WHERE user_id = ${user_id}
            )
            SELECT id FROM folder_tree;
        `;
        if (folderIds.length === 0) {
            throw new ApiError(404, "Folder not found");
        }
        const ids = folderIds.map(f => f.id);

        await tx.files.updateMany({
            where: {
                folder_id: { in: ids },
                user_id
            },
            data: { fileStatus: "DELETED" }
        });

        await tx.folders.updateMany({
            where: {
                id: { in: ids },
                user_id
            },
            data: { is_deleted: true }
        });

    });
    
}

export const moveFolder = async (user_id: string, folder_id: string, new_parent_id? : string) => {
    const folder = await prisma.folders.findFirst({
        where: {id: folder_id, user_id}
    })
    if (!folder) {
        new ApiError(404, "folder not found");
    }
    if (new_parent_id) {
        const new_parent = await prisma.folders.findFirst({
            where: {id: new_parent_id, user_id}
        })
        if (!new_parent) {
            new ApiError(404, "parent folder not found");
        }
    }
    await checkForCycle(user_id, folder_id, new_parent_id);

    return prisma.folders.update({
        where: { id: folder_id, user_id},
        data: {parent_id: new_parent_id ?? null}
    });
}

export const download = async (user_id: string, folder_id: string) => {

    const folder = await prisma.folders.findUnique({
        where: {id: folder_id}
    });

    if (!folder) {
        throw new ApiError(404, "folder not found");
    }

    if (folder.user_id !== user_id && !(await hasFolderAccess(folder_id, user_id))) {
        throw new ApiError(403, "forbidden");
    }

    const folderTree = await prisma.$queryRaw<{ id: string; path: string; }[]>`
        WITH RECURSIVE folder_tree AS (
            SELECT id, parent_id, name, name AS path
            FROM "Folders"
            WHERE id = ${folder_id}
            AND is_deleted = false

            UNION ALL

            SELECT f.id, f.parent_id, f.name,
                ft.path || '/' || f.name
            FROM "Folders" f
            INNER JOIN folder_tree ft ON f.parent_id = ft.id
            WHERE f.is_deleted = false
        )
        SELECT id, path FROM folder_tree;
    `;
    const totalSizeResult = await prisma.files.aggregate({
        where: {
            folder_id: { in: folderTree.map(f => f.id) },
            fileStatus: "UPLOADED"
        },
        _sum: { size: true }
    });

    const totalSize = totalSizeResult._sum.size ?? 0;

    const MAX_DOWNLOAD_SIZE = 200 * 1024 * 1024;

    if (totalSize > MAX_DOWNLOAD_SIZE) {
    throw new ApiError(400, "Folder too large for direct download");
    }

    const files = await prisma.$queryRaw<{ original_name: string, storage_key: string, folder_id: string }[]>`
        SELECT original_name, storage_key, folder_id
        FROM "Files"
        WHERE folder_id IN (${Prisma.join(folderTree.map(f => f.id))})
        AND "fileStatus" = 'UPLOADED'
    `
    const archive = archiver("zip", { zlib: { level: 1 }});
    const zipStream = new PassThrough();

    archive.pipe(zipStream);
    const zipKey = `temp-downloads/${user_id}/${crypto.randomUUID()}.zip`;

    const upload = new Upload({
        client: s3,
        params: {
            Bucket: S3_BUCKET,
            Key: zipKey,
            Body: zipStream,
            ContentType: "application/zip"
        }
    });

    try {
        for (const folder of folderTree) {
            archive.append("", {
                name:  `${folder.path}/`,
            });
        }

        const folderMap = new Map(folderTree.map(f => [f.id, f.path]))

        for (const file of files) {
            const s3Object = await getObjectWithRetry(file.storage_key);

            const folderPath = folderMap.get(file.folder_id);
            
            if (!folderPath) {
                throw new ApiError(500, "Folder path resolution failed");
            }
            
            archive.append(s3Object.Body as any, {
                name: `${folderPath}/${file.original_name}`
            })
        }

        const uploadPromise = upload.done();

        const archivePromise = new Promise<void>((resolve, reject) => {
            archive.on("error", reject);
            archive.on("finish", resolve);
            zipStream.on("error", reject);
        });

        archive.finalize();

        await Promise.all([uploadPromise, archivePromise]);
        

        const signedUrl = await generateDownloadUrl(zipKey);

        return {
            download_url: signedUrl
        };
    } catch (err) {
        try {
            await upload.abort();
        } catch {}
        throw err
    }
}