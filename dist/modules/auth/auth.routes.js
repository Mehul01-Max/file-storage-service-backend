import { Router } from 'express';
import * as authController from './auth.controller.js';
import { loginSchema, registrationSchema } from './auth.validator.js';
import validate from '../../middlewares/validator.middleware.js';
const authRouter = Router();
authRouter.post('/register', validate(registrationSchema), authController.register);
authRouter.post('/login', validate(loginSchema), authController.login);
export default authRouter;
//# sourceMappingURL=auth.routes.js.map