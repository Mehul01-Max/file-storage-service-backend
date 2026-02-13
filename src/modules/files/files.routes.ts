import { Router } from "express";
import validate, { validationTarget } from "../../middlewares/validator.middleware.js";
import { fileDownloadSchema, fileUploadCompleteSchema, fileUploadInitSchema, moveFileSchema, moveFileSchemaBody } from "./files.validator.js";
import { completeUpload, deleteFile, download, getFiles, getRootFiles, initUpload, moveFile } from "./files.controller.js";

const fileRouter = Router();

fileRouter.post("/upload/init", validate(fileUploadInitSchema), initUpload);
fileRouter.post("/upload/complete", validate(fileUploadCompleteSchema), completeUpload);
fileRouter.get("/download/:file_id", validate(fileDownloadSchema, validationTarget.Params), download);
fileRouter.get("/allFiles", getFiles)
fileRouter.delete("/:file_id", deleteFile);
fileRouter.put("/:file_id/move", validate(moveFileSchema, validationTarget.Params), validate(moveFileSchemaBody), moveFile);
fileRouter.get("/", getRootFiles)

export default fileRouter