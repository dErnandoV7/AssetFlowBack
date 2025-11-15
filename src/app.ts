import 'dotenv/config';
import cors from "cors";
import express, { Request, Response } from 'express';
import userRouter from "./routes/userRouter"
import walletRouter from "./routes/walletRouter"
import assetRouter from "./routes/assetRouter"
import transactionsRouter from "./routes/transactionRouter"
import assetIdentityRouter from "./routes/assetIdentityRouter"

import { errorHandler } from './middlewares/errorMiddleware';

const app = express();

app.use(cors({
    // origin: "http://localhost:3000",
    origin: "https://asset-flow-front.vercel.app",
    credentials: true,
}));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Api ASSET FLOW funcionando!' });
});

app.use("/", userRouter)
app.use("/", walletRouter)
app.use("/", assetRouter)
app.use("/", transactionsRouter)
app.use("/", assetIdentityRouter)

app.use(errorHandler)

export default app