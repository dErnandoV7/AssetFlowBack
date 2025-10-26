import { WalletService } from "../services/walletService";
import { Request, Response, NextFunction } from "express";
import { CreateWalletSchema, UpdateWalletSchema, DeleteWalletSchema, GetWalletSchema } from "../schemas/walletSchemas";

export const WalletControllers = {
    async createWallet(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.userId

        try {
            const { name, type } = req.body as CreateWalletSchema

            const createdWallet = await WalletService.createWallet({ name, type }, userId)

            return res.status(201).json({
                message: "Carteira criada com sucesso!.",
                wallet: createdWallet
            })
        } catch (error) {
            next(error)
        }
    },

    async updatedWallet(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.userId

        try {
            const { id } = req.params as UpdateWalletSchema["params"]
            const data = req.body as UpdateWalletSchema["body"]

            const updatedWallet = await WalletService.updateWallet(data, Number(id), userId)

            return res.status(200).json({
                message: "Carteira atualizada com sucesso",
                wallet: updatedWallet
            })
        } catch (error) {
            next(error)
        }
    },

    async deleteWallet(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.userId

        try {
            const { id } = req.params as DeleteWalletSchema
            const walletId = await WalletService.deleteWallet(Number(id), userId)

            return res.status(200).json({
                message: "Carteira excluída com sucesso",
                id: walletId
            })
        } catch (error) {
            next(error)
        }
    },

    async getWallet(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.userId

        try {
            const { id } = req.params as GetWalletSchema

            const wallet = await WalletService.getWallet(Number(id), userId)

            return res.status(200).json({
                response: `Carteira ${id} buscada com sucesso.`,
                wallet
            })

        } catch (error) {
            next(error)
        }
    },

    async getWallets(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.userId

        try {
            const wallets = await WalletService.getWallets(userId)

            return res.status(200).json({
                response: `Carteiras buscadas com sucesso.`,
                wallets
            })

        } catch (error) {
            next(error)
        }
    },
}