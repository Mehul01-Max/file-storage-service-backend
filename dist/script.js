import express from 'express';
import { PORT } from './config/env.js';
const app = express();
app.use(express.json());
app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
});
//# sourceMappingURL=script.js.map