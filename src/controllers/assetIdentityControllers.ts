import { AssetIdentityService } from "../services/assetIdentityService";
import { Request, Response, NextFunction } from "express";
import { TransferAssetSchema, BuyAssetSchema, SellAssetSchema } from "../schemas/assetIdentitySchemas";

export const AssetIdentityControllers = {
    async transferAsset(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.userId

        try {
            const { identifyId, quantity, sourceAssetId, sourceWalletId, targetWalletId } = req.body as TransferAssetSchema

            const transaction = await AssetIdentityService.transferAsset({ identifyId, quantity, sourceAssetId, sourceWalletId, targetWalletId }, userId)

            return res.status(201).json({
                message: "Transação realizada com sucesso!",
                transfer: transaction
            })

        } catch (error) {
            next(error)
        }
    },

    async sellAsset(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.userId

        try {
            const { assetId, price, quantity } = req.body as SellAssetSchema

            const { transfer, updatedAsset } = await AssetIdentityService.sellAsset({ assetId, price, quantity }, userId)

            const { price: priceSell, quantity: quantitySell } = transfer
            const { purchasePrice: priceBuy } = updatedAsset

            const value = (priceSell - priceBuy) * quantitySell
            const profit = value > 0

            return res.status(201).json({
                message: "Venda realizada com sucesso!",
                transfer,
                updatedAsset,
                profit,
                value
            })

        } catch (error) {
            next(error)
        }
    },

    async buyAsset(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.userId

        try {
            const { identifyId, price, quantity, walletId } = req.body as BuyAssetSchema

            const { asset, transfer } = await AssetIdentityService.buyAsset({ identifyId, price, quantity, walletId }, userId)

            return res.status(201).json({
                message: "Compra realizada com sucesso!",
                transfer,
                updatedAsset: asset
            })

        } catch (error) {
            next(error)
        }
    },
}