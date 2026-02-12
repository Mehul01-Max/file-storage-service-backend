import { z } from "zod";

export const createFolderSchema = z.object({
    name: z.string().min(1),
    user_id: z.uuid(),
    parent_id: z.uuid().optional()
})

export const folderIdSchema = z.object({
    folder_id: z.uuid()
})

export const nameSchema = z.object({
    name: z.string().min(1)
})

export const moveSchema = z.object({
    folder_id: z.uuid(),
    new_parent_id: z.uuid().optional()
})