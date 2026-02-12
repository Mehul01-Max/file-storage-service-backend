import { Router } from "express";
import validate, { validationTarget } from "../../middlewares/validator.middleware.js";
import { fileDownloadSchema, fileUploadCompleteSchema, fileUploadInitSchema, moveFileSchema } from "./files.validator.js";
import { completeUpload, deleteFile, download, getFiles, initUpload, moveFile } from "./files.controller.js";

const fileRouter = Router();

fileRouter.post("/upload/init", validate(fileUploadInitSchema), initUpload);
fileRouter.post("/upload/complete", validate(fileUploadCompleteSchema), completeUpload);
fileRouter.get("/download/:file_id", validate(fileDownloadSchema, validationTarget.Params), download);
fileRouter.get("/", getFiles)
fileRouter.delete("/:id", deleteFile);
fileRouter.put("/:file_id/move/:new_folder_id", validate(moveFileSchema, validationTarget.Params), moveFile);


export default fileRouter