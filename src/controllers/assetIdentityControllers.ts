import { AssetIdentityService } from "../services/assetIdentityService";
import { Request, Response, NextFunction } from "express";

export const AssetIdentityControllers = {
    async getAssetIdentityAll(req: Request, res: Response, next: NextFunction) {
        try {
            const assetsIdentity = await AssetIdentityService.getAssetIdentityAll()

            return res.status(200).json({
                message: "Identificadores buscados com sucesso.",
                assetsIdentity
            })

        } catch (error) {
            next(error)
        }
    }
}