import { z } from 'zod';

export const shareFileValidator = z.object({
    file_id: z.uuid(),
    target_user_email: z.email(),
})

export const shareFolderValidator = z.object({
    folder_id: z.uuid(),
    target_user_email: z.email(),
})

export const  revokeShareFileAndFolderValidator = z.object({
    share_id: z.uuid()
})