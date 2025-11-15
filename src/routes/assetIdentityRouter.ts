import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AssetIdentityControllers } from "../controllers/assetIdentityControllers";

const router = Router()

router.use(authMiddleware)

router.get("/assets-identitys", AssetIdentityControllers.getAssetIdentityAll)

export default router