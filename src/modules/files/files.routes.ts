import { Router } from "express";
import validate, { validationTarget } from "../../middlewares/validator.middleware.js";
import { fileDownloadSchema, fileUploadCompleteSchema, fileUploadInitSchema } from "./files.validator.js";
import { completeUpload, download, initUpload } from "./files.controller.js";

const fileRouter = Router();

fileRouter.post("/upload/init", validate(fileUploadInitSchema), initUpload);
fileRouter.post("/upload/complete", validate(fileUploadCompleteSchema), completeUpload);
fileRouter.get("/download/:file_id", validate(fileDownloadSchema, validationTarget.Params), download);

export default fileRouter