import { Router } from "express";
import validate from "../../middlewares/validator.middleware.js";
import { revokeShareFileAndFolderValidator, shareFileValidator, shareFolderValidator } from "./sharing.validator.js";
import { getSharedFiles, getSharedFolders, revokeShareFile, revokeShareFolder, shareFile, shareFolder } from "./sharing.controller.js";

const sharingRouter = Router()

sharingRouter.post("/file", validate(shareFileValidator), shareFile);
sharingRouter.post("/folder", validate(shareFolderValidator), shareFolder)
sharingRouter.get("/file", getSharedFiles);
sharingRouter.get("/folder", getSharedFolders);
sharingRouter.delete("/file", validate(revokeShareFileAndFolderValidator), revokeShareFile);
sharingRouter.delete("/folder", validate(revokeShareFileAndFolderValidator), revokeShareFolder);

export default sharingRouter;