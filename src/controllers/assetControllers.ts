import { Response, Request, NextFunction } from "express";
import { AssetService } from "../services/assetService";
import { CreateAssetSchema, DeleteAssetSchema, GetAssetSchemaParams, GetAssetsSchemaQuery, GetAssetsSchemaBody } from "../schemas/assetSchemas";

export const AssetControllers = {
    async createAsset(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.userId

        try {
            const { identifyId, purchasePrice, quantity, walletId } = req.body as CreateAssetSchema

            const createdAsset = await AssetService.createAsset({ identifyId, purchasePrice, quantity, walletId }, walletId, userId)

            return res.status(201).json({
                message: "Asset criada com sucesso.",
                asset: createdAsset
            })

        } catch (error) {
            next(error)
        }
    },

    async deleteAsset(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.userId

        try {
            const { id } = req.params as DeleteAssetSchema

            await AssetService.deleteAsset(Number(id), userId)

            return res.status(200).json({
                response: `Ativo ${id} excluído com sucesso.`,
                id
            })
        } catch (error) {
            next(error)
        }
    },

    async getAssets(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.userId
        try {
            const { cursorId, orderBy, walletType, direction } = req.body as GetAssetsSchemaBody
            const { walletId } = req.query as GetAssetsSchemaQuery

            const assets = await AssetService.getAssets({ cursorId, orderBy, walletId: Number(walletId), direction }, userId, walletType)

            return res.status(200).json({
                message: "Busca realizada com sucesso.",
                assets
            })

        } catch (error) {
            next(error)
        }
    },

    async getAsset(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.userId
        try {
            const { id } = req.params as GetAssetSchemaParams

            const asset = await AssetService.getAsset(Number(id), userId)

            return res.status(200).json({
                message: "Busca realizada com sucesso.",
                asset
            })

        } catch (error) {
            next(error)
        }
    },
}