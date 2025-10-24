import { Response, Request, NextFunction } from "express";
import { AssetService } from "../services/assetService";
import { CreateAssetSchema, UpdateAssetSchema, DeleteAssetSchema, GetAssetSchemaParams, GetAssetSchemaQuery, GetAssetsSchemaQuery} from "../schemas/assetSchemas";

export const AssetControllers = {
    async createAsset(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.userId

        try {
            const { name, purchasePrice, quantity, walletId } = req.body as CreateAssetSchema

            const createdAsset = await AssetService.createAsset({ name, purchasePrice, quantity, walletId }, walletId, userId)

            return res.status(201).json({
                message: "Asset criada com sucesso.",
                asset: createdAsset
            })

        } catch (error) {
            next(error)
        }
    },

    async updateAsset(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.userId

        try {
            const { id } = req.params as UpdateAssetSchema["params"]
            const data = req.body as UpdateAssetSchema["body"]

            const wallet = await AssetService.updateAsset(data, Number(id), userId)

            return res.status(200).json({
                response: `Ativo ${id} atualizado com sucesso.`,
                wallet
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
            const { walletId } = req.query as GetAssetsSchemaQuery

            const assets = await AssetService.getAssets(Number(walletId), userId)

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
            const { walletId } = req.query as GetAssetSchemaQuery
            const { id } = req.params as GetAssetSchemaParams

            const asset = await AssetService.getAsset(Number(id), Number(walletId), userId)

            return res.status(200).json({
                message: "Busca realizada com sucesso.",
                asset
            })

        } catch (error) {
            next(error)
        }
    }
}