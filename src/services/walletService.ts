import { WalletRepository } from "../repositories/walletRepository";
import { UserRepository } from "../repositories/userRepository";
import { CreateWallet, UpdateWallet } from "../types/walletTypes";
import { NotFoundError } from "../utils/errorUtils";

export const WalletService = {
    async createWallet(walletData: CreateWallet, userId: number) {
        const existingUser = await UserRepository.findById(userId)

        if (!existingUser) throw new NotFoundError(`Não existe usuário com o ID ${userId}`)

        const createdWallet = await WalletRepository.createWallet(walletData, userId)

        return createdWallet
    },

    async updateWallet(dataWallet: UpdateWallet, walletId: number, userId: number) {
        const existingWallet = await WalletRepository.findById(walletId, userId)

        if (!existingWallet) throw new NotFoundError(`Não existe wallet com o ID ${walletId} ou não está vinculado ao usuário logado.`)

        const updatedWallet = await WalletRepository.udpateWallet({
            name: dataWallet.name,
            type: dataWallet.type
        }, walletId)

        return updatedWallet
    },

    async deleteWallet(walletId: number, userId: number) {
        const existingWallet = await WalletRepository.findById(walletId, userId)

        if (!existingWallet) throw new NotFoundError(`Não existe wallet com o ID ${walletId} ou não está vinculado ao usuário logado.`)

        await WalletRepository.deleteWallet(walletId)

        return walletId
    },

    async getWallet(walletId: number, userId: number) {
        const wallet = await WalletRepository.findById(walletId, userId)

        if (!wallet) throw new NotFoundError(`Não existe wallet com o ID ${walletId} ou não está vinculado ao usuário logado.`)

        return wallet
    },

    async getWallets(userId: number) {
        const wallets = await WalletRepository.getWallets(userId)

        return wallets
    }
}