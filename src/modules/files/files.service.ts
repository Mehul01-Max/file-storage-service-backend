import { prisma } from '../../config/prisma.js';
import { deleteFileFromS3, generateDownloadUrl, generateUploadUrl } from '../../storage/s3.helpers.js';
import { HeadObjectCommand, NotFound } from '@aws-sdk/client-s3';
import ApiError from '../../utils/ApiError.js';
import { S3_BUCKET } from '../../config/env.js';
import { s3 } from '../../storage/s3.client.js';
import { hasFolderAccess } from '../../utils/helper.js';

export const initUpload = async (user_id: string, original_name: string, mime_type: string, size: number, folder_id?: string) => {
    try {
        if (folder_id) {
            const folder = await prisma.folders.findFirst({
                where: {id: folder_id, user_id, is_deleted: false}
            })
            if (!folder){
                throw new ApiError(404, "folder not found");
            }
        }
        const storage_key = `user-${user_id}/${Date.now()}-${crypto.randomUUID()}`
        const file = await prisma.files.create({
            data: {
                original_name,
                storage_key,
                mime_type,
                size,
                folder_id: folder_id ?? null,
                user_id
            }
        })

        const upload_url = await generateUploadUrl(storage_key, mime_type, size);

        return {
            file_id: file.id,
            upload_url
        }
    } catch (err) {
        throw err;
    }
}

export const completeUpload = async (file_id: string) => {
    try {
        const file = await prisma.files.findUnique({
            where: {id: file_id}
        });

        if (!file) {
            throw new ApiError(404, "file not found");
        }
        if (file.fileStatus !== "UPLOADING") {
            throw new ApiError(400, "Invalid upload state");
        }
        await s3.send(
            new HeadObjectCommand({
                Bucket: S3_BUCKET,
                Key: file.storage_key,
            })
        )
        await prisma.files.update({
            where: {
                id: file_id
            },
            data: {
                fileStatus: "UPLOADED"
            }
        })
    } catch (err) {
        if (err instanceof NotFound) {
            await prisma.files.update({
                where: { id: file_id },
                data: {fileStatus: "FAILED"} 
            })
            throw new ApiError(400, "file failed to upload")
        }
        throw err;
    }
}

export const download = async (user_id: string, file_id: string) => {
    try {
        const file = await prisma.files.findUnique({
            where: {id: file_id}
        })
        if (!file || file.fileStatus == "FAILED" || file.fileStatus == "DELETED") {
            throw new ApiError(404, "file not found");
        }
        if (file.user_id !== user_id && file.folder_id ? !(await hasFolderAccess(file.folder_id, user_id)) : true) {
            console.log("hello");
            const share = await prisma.shared_Files.findUnique({
                where: {
                    file_id_shared_with: {
                        file_id,
                        shared_with: user_id
                    }
                }
            });
            if (!share || share.revoked) {
                throw new ApiError(403, "forbidden")
            }
        }
        if (file.fileStatus == "UPLOADING") {
            throw new ApiError(400, "file not ready for download");
        }
        const url = await generateDownloadUrl(file.storage_key)

        return {
            download_url: url
        }
    } catch (err) {
        throw err;
    }
}

export const getFiles = async (user_id: string) => {
    try {
        const file = await prisma.files.findMany({
            where: { user_id, fileStatus: "UPLOADED" },
        })
        return {
            file
        }
    } catch (err) {
        throw err
    }
}

export const getRootFiles = async (user_id: string) => {
    try {
        const file = await prisma.files.findMany({
            where: { user_id, fileStatus: "UPLOADED", folder_id: null},
        })
        return {
            file
        }
    } catch (err) {
        throw err
    }
}

export const deleteFile = async (user_id: string, file_id: string) => {
    try {
        const file = await prisma.files.findFirst({
            where: {id: file_id, user_id}
        })
        if (!file || file.fileStatus === "FAILED" || file.fileStatus === "DELETED") {
            throw new ApiError(404, "file not found");
        }

        if (file.fileStatus == "UPLOADING") {
            throw new ApiError(400, "file not ready for delete");
        }
        await deleteFileFromS3(file.storage_key);

        await prisma.files.update({
            where: {id: file_id},
            data: { fileStatus: "DELETED"}
        })
    } catch (err) {
        throw err
    }
}

export const moveFile = async (user_id: string, file_id: string, new_folder_id?: string) => {
    const file = await prisma.files.findFirst({
        where: {id: file_id, user_id}
    })
    if (!file || file.fileStatus === "FAILED" || file.fileStatus === "DELETED") {
            throw new ApiError(404, "file not found");
        }
    if (new_folder_id) {
        const folder_id = await prisma.folders.findFirst({
            where: {id: new_folder_id, user_id}
        })
        if (!folder_id) {
            throw new ApiError(404, "folder not found");
        }
    }
    return await prisma.files.update({
        where: {id: file_id, user_id},
        data: {folder_id: new_folder_id ?? null}
    })
}