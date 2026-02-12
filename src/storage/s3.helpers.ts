import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { S3_BUCKET } from "../config/env.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "./s3.client.js";


export const generateUploadUrl = async (key: string, mimeType: string) => {
    const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        // ContentType: mimeType
    });

    return await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
}

export const generateDownloadUrl = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key
    })

    return await getSignedUrl(s3, command, {expiresIn: 60 * 5});
}   