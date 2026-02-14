import { prisma } from "../../config/prisma.js"
import ApiError from "../../utils/ApiError.js"
import checkForCycle from "../../utils/checkforCycle.js";
import { hasFolderAccess } from "../../utils/helper.js";

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

