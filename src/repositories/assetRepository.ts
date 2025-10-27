import { cursorTo } from "readline"
import { prisma } from "../config/database"
import { CreateAsset } from "../types/assetTypes"

export const AssetRepository = {
    async createAsset(assetData: CreateAsset) {
        return prisma.asset.create({
            data: assetData,
            select: {
                identify: {
                    select: {
                        symbol: true
                    }
                },
                quantity: true,
                purchasePrice: true,
                walletId: true
            }
        })
    },

    async getAsset(where: any) {
        return prisma.asset.findFirst({
            where: where,
            include: {
                wallet: true
            }
        })
    },


    async getAssets(
        where: any,
        orderBy: Record<string, "asc" | "desc">,
        skip: number,
        cursor?: { id: number },
    ) {
        return prisma.asset.findMany({
            where: where,
            orderBy,
            ...(cursor?.id ? { cursor: { id: cursor.id } } : {}),
            skip,
            take: 8,
            include: {
                identify: true,
                wallet: true
            }
        })
    },

    async deleteAsset(id: number) {
        return prisma.asset.delete({ where: { id } })
    },

}