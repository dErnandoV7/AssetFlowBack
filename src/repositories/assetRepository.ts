import { prisma } from "../config/database"
import { CreateAsset, UpdateAsset } from "../types/assetTypes"

export const AssetRepository = {
    async createAsset(assetData: CreateAsset) {
        return prisma.asset.create({
            data: assetData,
            select: {
                name: true,
                quantity: true,
                purchasePrice: true,
                walletId: true
            }
        })
    },

    async getAsset(where: any) {
        return prisma.asset.findFirst({
            where: where
        })
    },

    async getAssets(walletId: number) {
        return prisma.asset.findMany({ where: { walletId } })
    },

    async updateAsset(assetData: UpdateAsset, id: number) {
        return prisma.asset.update({
            where: { id },
            data: assetData,
            select: {
                name: true,
                quantity: true,
                purchasePrice: true,
                walletId: true
            }
        })
    },

    async deleteAsset(id: number) {
        return prisma.asset.delete({ where: { id } })
    },

}