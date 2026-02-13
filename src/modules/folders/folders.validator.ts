import { z } from "zod";

export const createFolderSchema = z.object({
    name: z.string().min(1),
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
    
})

export const moveSchemaBody = z.object({
    new_parent_id: z.uuid().optional()
})