import express from 'express';
import errorMiddleware from './middlewares/error.middleware.js';
import morgan from 'morgan';
import router from './routes/index.js';
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", router);
app.use(errorMiddleware);
export default app;
//# sourceMappingURL=app.js.map