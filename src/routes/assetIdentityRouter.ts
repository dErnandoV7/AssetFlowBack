import { Router } from "express";
import { validate } from "../middlewares/validateMiddleware";
import { transferAssetSchema, buyAssetSchema, sellAssetSchema } from "../schemas/assetIdentitySchemas";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AssetIdentityControllers } from "../controllers/assetIdentityControllers";

const router = Router()

router.use(authMiddleware)

router.put("/transfer-asset", validate(transferAssetSchema), AssetIdentityControllers.transferAsset)

router.put("/buy-asset", validate(buyAssetSchema), AssetIdentityControllers.buyAsset)

router.put("/sell-asset", validate(sellAssetSchema), AssetIdentityControllers.sellAsset)

export default router