import { z } from 'zod';

export const fileUploadInitSchema = z.object({
    orignial_name: z.string().min(1).max(255),
    mime_type: z.enum(["application/pdf", "image/jpeg", "image/png"]),
    size: z.number().positive().max(20 * 1024 * 1024),
    folder_id: z.uuid().optional()
})

export const fileUploadCompleteSchema = z.object({
    file_id: z.uuid()
})