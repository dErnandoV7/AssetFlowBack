import { Router } from "express";
import { validate } from "../middlewares/validateMiddleware";
import { createAssetSchema, deleteAssetSchema, updateAssetSchema, getAssetsSchema } from "../schemas/assetSchemas";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AssetControllers } from "../controllers/assetControllers";

const router = Router()

router.use(authMiddleware)

router.post("/create-asset", validate(createAssetSchema), AssetControllers.createAsset)

router.put("/update-asset/:id", validate(updateAssetSchema), AssetControllers.updateAsset)

router.delete("/delete-asset/:id", validate(deleteAssetSchema), AssetControllers.deleteAsset)

router.get("/assets", validate(getAssetsSchema), AssetControllers.getAssets)

router.get("/assets/:id", validate(getAssetsSchema), AssetControllers.getAsset)

export default router