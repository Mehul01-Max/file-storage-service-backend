import type { Request, Response, NextFunction } from 'express'
import * as folderService from './folders.service.js'
import { successReponse } from '../../utils/apiResponse.js';
import ApiError from '../../utils/ApiError.js';

export const createFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, parent_id } = req.body;
        const create = await folderService.createFolder(name, req.userId!, parent_id);
        return successReponse(res, "folder created successfully", create, 201);
    } catch (err) {
        next(err);
    }
}

export const getFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {folder_id} = req.params;
        if (typeof folder_id !== "string" ) {
            throw new ApiError(400, "folder id should be of type uuid")
        }
        const result = await folderService.getFolder(req.userId!, folder_id);
        return successReponse(res, "success", result, 200)
    } catch (err) {
        next(err)
    }
}

export const listRootFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await folderService.listRootFolder(req.userId!);
        return successReponse(res, "success", result, 200);
    } catch (err) {
        next(err)
    }
}

export const renameFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const { folder_id } = req.params
        if (typeof folder_id !== "string" ) {
            throw new ApiError(400, "folder id should be of type uuid")
        }
        const result = await folderService.renameFolder(req.userId!, folder_id, name);
        return successReponse(res, "file renamed successfully", result, 200);

    } catch (err) {
        next(err)
    }
}

export const deleteFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { folder_id } = req.params;
        if (typeof folder_id !== "string" ) {
            throw new ApiError(400, "folder id should be of type uuid")
        }
        const result = await folderService.deleteFolder(req.userId!, folder_id);
        return successReponse(res, "file deleted successfully", result, 204);
    } catch (err) {
        next(err)
    }
}

export const moveFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { folder_id, new_parent_id } = req.params;
        if (folder_id !== 'string' || new_parent_id !== 'string') {
            throw new ApiError(400, "folder id and new parent id should be uuid");
        }
        const result = await folderService.moveFolder(req.userId!, folder_id, new_parent_id);
        return successReponse(res, "file moved successfully", result, 200);
    } catch (err) {
        next(err);
    }
}