import { prisma } from "../config/database"
import { CreateWallet, UpdateWallet } from "../types/walletTypes"

export const WalletRepository = {
    async createWallet(walletData: CreateWallet) {
        return prisma.wallet.create({
            select: {
                id: true,
                name: true,
                type: true,
                userId: true
            },
            data: walletData
        })
    },

    async findById(id: number) {
        return prisma.wallet.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                type: true,
                userId: true
            }
        })
    },

    async getWallets(userId: number) {
        return prisma.wallet.findMany({ where: { userId } })
    },

    async udpateWallet(data: UpdateWallet, id: number) {
        return prisma.wallet.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                type: true,
                userId: true
            }
        })
    },

    async deleteWallet(id: number) {
        return prisma.wallet.delete({ where: { id } })
    },
}