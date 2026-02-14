import { Router } from 'express'
import validate, { validationTarget } from '../../middlewares/validator.middleware.js';
import { createFolderSchema, folderIdSchema, folderIdSchemaOptional, moveSchema, moveSchemaBody, nameSchema } from './folders.validator.js';
import { createFolder, deleteFolder, download, getFolder, listRootFolder, moveFolder, renameFolder } from './folders.controller.js';

const foldersRouter = Router();

foldersRouter.post("/create", validate(createFolderSchema), createFolder);
foldersRouter.get("/:folder_id", validate(folderIdSchema, validationTarget.Params), getFolder);
foldersRouter.get("/", getFolder);
foldersRouter.get("/listRootFolder", listRootFolder);
foldersRouter.put("/:folder_id/rename", validate(nameSchema), validate(folderIdSchemaOptional, validationTarget.Params), renameFolder);
foldersRouter.delete("/:folder_id", validate(folderIdSchema, validationTarget.Params), deleteFolder);
foldersRouter.put("/:folder_id/move", validate(moveSchema ,validationTarget.Params), validate(moveSchemaBody), moveFolder);
foldersRouter.get("/download/:folder_id", validate(folderIdSchema, validationTarget.Params), download); 

export default foldersRouter