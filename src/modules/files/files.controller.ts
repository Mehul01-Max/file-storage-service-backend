import type {Request, Response, NextFunction } from 'express'
import * as fileService from './files.service.js'
import { successReponse } from '../../utils/apiResponse.js'
import type { UUID } from 'node:crypto'

export const initUpload = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { original_name, mime_type, size, folder_id } = req.body
        const result = await fileService.initUpload( req.userId!, original_name, mime_type, size, folder_id)
        return successReponse(res, "file uploading initizated", result, 200);
    } catch (err) {
        next(err);
    }
}

export const completeUpload = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { file_id } = req.body;
        const result = await fileService.completeUpload(file_id);
        return successReponse(res, "file upload completed", result, 201);
    } catch (err) {
        next(err);
    }
}

export const download = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { file_id } = req.params;
        const result = await fileService.download(file_id as UUID)
        return successReponse(res, "file download started", result, 200);
    } catch (err) {
        next(err);
    }
}
