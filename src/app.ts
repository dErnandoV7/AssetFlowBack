import 'dotenv/config';
import express, { Request, Response } from 'express';
import userRouter from "./routes/userRouter"
import walletRouter from "./routes/walletRouter"
import assetRouter from "./routes/assetRouter"

import { errorHandler } from './middlewares/errorMiddleware';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Api ASSET FLOW funcionando!' });
});

app.use("/", userRouter)
app.use("/", walletRouter)
app.use("/", assetRouter)

app.use(errorHandler)

export default app