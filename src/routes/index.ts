import { Router } from 'express'
import authRouter from '../modules/auth/auth.routes.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.use("/auth", authRouter)

router.use(authMiddleware);

export default router;