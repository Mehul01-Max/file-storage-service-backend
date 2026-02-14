import type { Request, Response, NextFunction } from 'express'
import * as sharingService from './sharing.service.js'
import { successReponse } from '../../utils/apiResponse.js';

export const shareFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { file_id, target_user_email } = req.body;
        const result = await sharingService.shareFile(req.userId!, file_id, target_user_email)
        return successReponse(res, "file shared with user successfully", result, 200)
    } catch (err) {
        next(err)
    }
}

export const shareFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { folder_id, target_user_email } = req.body;
        const result = await sharingService.shareFolder(req.userId!, folder_id, target_user_email)
        return successReponse(res, "folder shared with user successfully", result, 200)
    } catch (err) {
        next(err)
    }
}

export const getSharedFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await sharingService.getSharedFiles(req.userId!);
        return successReponse(res, "success", result, 200);
    } catch (err) {
        next(err)
    }
}

export const getSharedFolders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await sharingService.getSharedFolders(req.userId!);
        return successReponse(res, "success", result, 200);
    } catch (err) {
        next(err);
    }
}

export const revokeShareFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { share_id } = req.body;
        const result = await sharingService.revokeShareFile(req.userId!, share_id);
        return successReponse(res, "access removed successfully", result, 204)
    } catch (err) {
        next(err);
    }
}

export const revokeShareFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { share_id } = req.body;
        const result = await sharingService.revokeShareFolder(req.userId!, share_id);
        return successReponse(res, "access removed successfully", result, 204)
    } catch(err) {
        next(err)
    }
}