import { Router } from "express";
import { validate } from "../middlewares/validateMiddleware";
import { transferAssetSchema, buyAssetSchema, sellAssetSchema, getAllTransferSchema } from "../schemas/transactionSchemas";
import { authMiddleware } from "../middlewares/authMiddleware";
import { TransactionControllers } from "../controllers/transactionControllers";

const router = Router()

router.use(authMiddleware)

router.put("/transfer-asset", validate(transferAssetSchema), TransactionControllers.transferAsset)

router.put("/buy-asset", validate(buyAssetSchema), TransactionControllers.buyAsset)

router.put("/sell-asset", validate(sellAssetSchema), TransactionControllers.sellAsset)

router.get("/transfers", validate(getAllTransferSchema), TransactionControllers.getAllTransfer)

export default router