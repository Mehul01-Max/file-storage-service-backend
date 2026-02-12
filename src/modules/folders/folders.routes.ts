import { Router } from 'express'
import validate, { validationTarget } from '../../middlewares/validator.middleware.js';
import { createFolderSchema, folderIdSchema, moveSchema, nameSchema } from './folders.validator.js';
import { createFolder, deleteFolder, getFolder, listRootFolder, moveFolder, renameFolder } from './folders.controller.js';

const foldersRouter = Router();

foldersRouter.post("/create", validate(createFolderSchema), createFolder);
foldersRouter.get("/:folder_id", validate(folderIdSchema, validationTarget.Params), getFolder);
foldersRouter.get("/", listRootFolder);
foldersRouter.put("/:folder_id/rename", validate(nameSchema), validate(folderIdSchema, validationTarget.Params), renameFolder);
foldersRouter.delete("/:folder_id", validate(folderIdSchema, validationTarget.Params), deleteFolder);
foldersRouter.put("/:folder_id/move/:new_parent_id", validate(moveSchema ,validationTarget.Params), moveFolder);

export default foldersRouter