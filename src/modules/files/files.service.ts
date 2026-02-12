import type { UUID } from 'crypto';
import { prisma } from '../../config/prisma.js';
import { generateDownloadUrl, generateUploadUrl } from '../../storage/s3.helpers.js';
import { HeadObjectCommand, NotFound } from '@aws-sdk/client-s3';
import ApiError from '../../utils/ApiError.js';
import { S3_BUCKET } from '../../config/env.js';
import { s3 } from '../../storage/s3.client.js';

export const initUpload = async (user_id: UUID, original_name: string, mime_type: string, size: number, folder_id?: UUID) => {
    try {
        const storage_key = `user-${user_id}/${Date.now()} - ${crypto.randomUUID()}`

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

        const upload_url = await generateUploadUrl(storage_key, mime_type);

        return {
            file_id: file.id,
            upload_url
        }
    } catch (err) {
        throw err;
    }
}

export const completeUpload = async (file_id: UUID) => {
    try {
        const file = await prisma.files.findUnique({
            where: {id: file_id}
        });

        if (!file) {
            throw new ApiError(404, "file not found");
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

export const download = async (file_id: UUID) => {
    try {
        const file = await prisma.files.findUnique({
            where: {id: file_id}
        })
        if (!file || file.fileStatus == "FAILED") {
            throw new ApiError(404, "file not found");
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