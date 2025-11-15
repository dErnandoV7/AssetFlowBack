import { AssetRepository } from "../repositories/assetRepository";
import { WalletRepository } from "../repositories/walletRepository";
import { AssetIdentityRepository } from "../repositories/assetIdentityRepository";
import { CreateAsset, AssetsCursorData } from "../types/assetTypes";
import { ConflictError, NotFoundError } from "../utils/errorUtils";
import { Prisma } from "@prisma/client";
import { TypeWallet } from "../types/walletTypes";

export const AssetService = {
    async createAsset(assetData: CreateAsset, walletId: number, userId: number) {
        const existingWallet = await WalletRepository.findById(walletId, userId)

        if (!existingWallet) throw new NotFoundError(`Não existe carteira ID ${walletId} ou não está vinculada ao usuário autenticado.`)

        const { identifyId } = assetData
        const assetIdentify = await AssetIdentityRepository.findById(identifyId)

        if (!assetIdentify) throw new ConflictError(`Tipo de ativo não encontrado.`)

        const existingAssetUsingAssetIdentify = await AssetRepository.getAsset({
            wallet: {
                id: existingWallet.id
            },
            identifyId: assetIdentify.id
        })

        if (existingAssetUsingAssetIdentify) throw new ConflictError("Este identificador de Ativo já existe nesta carteira, tente outro.")

        const asset = {
            purchasePrice: assetData.purchasePrice,
            quantity: assetData.quantity,
            walletId: assetData.walletId,
            identifyId: assetIdentify.id
        }

        const createdAsset = await AssetRepository.createAsset(asset)

        return createdAsset
    },

    async deleteAsset(assetId: number, userId: number) {
        const existingAsset = await AssetRepository.getAsset({
            id: assetId,
            wallet: {
                userId: userId
            }
        })

        if (!existingAsset)
            throw new NotFoundError(`Não existe ativo ID ${assetId} ou não está vinculado ao usuário autenticado.`)

        await AssetRepository.deleteAsset(assetId)
    },

    async getAssets(assetCursorData: AssetsCursorData, userId: number, walletType?: TypeWallet, search?: string) {
        let where: Prisma.AssetWhereInput = {
            wallet: {
                userId: userId,
                ...(walletType ? { type: walletType } : {}),
            },
            ...(search ? {
                identify: {
                    OR: [
                        { canonicalName: { contains: search, mode: 'insensitive' } },
                        { symbol: { contains: search, mode: 'insensitive' } }
                    ]
                }
            } : {})
        }

        const { walletId, cursorId, orderBy, direction } = assetCursorData

        if (walletId) {
            const existingWallet = await WalletRepository.findById(walletId, userId)

            if (!existingWallet) throw new NotFoundError(`Não existe carteira ID ${walletId} ou não está vinculada ao usuário autenticado.`)

            where.walletId = walletId
        }

        const currentOrderBy: Record<string, "asc" | "desc"> = {
            [orderBy || "id"]: direction || "asc"
        }

        const currentCursor = cursorId ? { id: cursorId } : undefined
        const skip = cursorId ? 1 : 0

        const assets = await AssetRepository.getAssets(where, currentOrderBy, skip, currentCursor)

        const countAssets = await AssetRepository.countAsset(where)

        return { assets, countAssets }
    },

    async getAsset(assetId: number, userId: number) {
        const asset = await AssetRepository.getAsset({
            id: assetId,
            wallet: {
                userId: userId
            }
        })

        if (!asset) throw new NotFoundError(`Ativo ID ${assetId} não existe ou não pertence ao usuário autenticado.`)

        return asset
    }
}