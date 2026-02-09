import express from 'express';
import errorMiddleware from './middlewares/error.middleware.js';
import morgan from 'morgan';
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(errorMiddleware);
export default app;
//# sourceMappingURL=app.js.map