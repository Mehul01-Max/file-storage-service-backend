import { S3Client } from "@aws-sdk/client-s3";
import { AWS_ACCESS_KEY, AWS_REGION } from "../config/env.js";

export const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_ACCESS_KEY
    },
})