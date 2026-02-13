import type {Request, Response, NextFunction } from 'express'
import * as fileService from './files.service.js'
import { successReponse } from '../../utils/apiResponse.js'
import ApiError from '../../utils/ApiError.js'

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
        if (typeof file_id !== "string") {
            throw new ApiError(400, "file_id should be of type uuid")
        }
        const result = await fileService.download(req.userId!, file_id)
        return successReponse(res, "file download started", result, 200);
    } catch (err) {
        next(err);
    }
}

export const getFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await fileService.getFiles(req.userId!);
        return successReponse(res, "All files retrieved successfully", result, 200)
    } catch (err) {
        next(err)
    }
}

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { file_id } = req.params
        if (typeof file_id !== "string") {
            throw new ApiError(400, "file_id should be of type uuid")
        }
        const result = await fileService.deleteFile(req.userId!, file_id);
        return successReponse(res, "file deleted successfully", result, 204)
    } catch (err) {
        next(err)
    } 
}

export const moveFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { file_id } = req.params;
        const { new_folder_id } = req.body;
        if (typeof file_id !== "string") {
            throw new ApiError(400, "file_id should be of type uuid");
        }
        const result = await fileService.moveFile(req.userId!, file_id, new_folder_id);
        return successReponse(res, "file moved successfully", result, 200);
    } catch (err) {
        next(err)
    }
}

export const getRootFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await fileService.getRootFiles(req.userId!);
        return successReponse(res, "success", result, 200);
    } catch (err) {
        next(err);
    }
}