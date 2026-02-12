import { Router } from 'express'
import authRouter from '../modules/auth/auth.routes.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import fileRouter from '../modules/files/files.routes.js';
import foldersRouter from '../modules/folders/folders.routes.js';

const router = Router();

router.use("/auth", authRouter)

router.use(authMiddleware);

router.use("/files", fileRouter)
router.use("/folders", foldersRouter)


export default router;