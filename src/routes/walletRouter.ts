import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validateMiddleware";
import { createWalletSchema, updateWalletSchema, deleteWalletSchema, getWalletSchema } from "../schemas/walletSchemas";
import { WalletControllers } from "../controllers/walletControllers";

const router = Router()

router.use(authMiddleware)

router.post("/create-wallet", validate(createWalletSchema), WalletControllers.createWallet)

router.put("/update-wallet/:id", validate(updateWalletSchema), WalletControllers.updatedWallet)

router.delete("/delete-wallet/:id", validate(deleteWalletSchema), WalletControllers.deleteWallet
)

router.get("/wallets/:id", validate(getWalletSchema), WalletControllers.getWallet)

router.get("/wallets", WalletControllers.getWallets)

export default router