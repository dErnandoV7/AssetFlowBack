import { WalletRepository } from "../repositories/walletRepository";
import { UserRepository } from "../repositories/userRepository";
import { CreateWallet, UpdateWallet } from "../types/walletTypes";
import { NotFoundError } from "../utils/errorUtils";
import { checkSignature } from "../utils/checkSignatureUtil";

export const WalletService = {
    async createWallet(walletData: CreateWallet) {
        const { userId } = walletData

        const existingUser = await UserRepository.findById(userId)

        if (!existingUser) throw new NotFoundError(`Não existe usuário com o ID ${userId}`)

        const createdWallet = await WalletRepository.createWallet(walletData)

        return createdWallet
    },

    async updateWallet(dataWallet: UpdateWallet, walletId: number, userId: number) {
        const existingWallet = await WalletRepository.findById(walletId)

        if (!existingWallet) throw new NotFoundError(`Não existe wallet com o ID ${walletId}`)

        checkSignature({ id: userId, name: "Usuário" }, { id: existingWallet.userId, name: "Carteira" })

        const updatedWallet = await WalletRepository.udpateWallet({
            name: dataWallet.name,
            type: dataWallet.type
        }, walletId)

        return updatedWallet
    },

    async deleteWallet(walletId: number, userId: number) {
        const existingWallet = await WalletRepository.findById(walletId)

        if (!existingWallet) throw new NotFoundError(`Não existe wallet com o ID ${walletId}`)

        checkSignature({ id: userId, name: "Usuário" }, { id: existingWallet.userId, name: "Carteira" })

        await WalletRepository.deleteWallet(walletId)

        return walletId
    },

    async getWallet(walletId: number, userId: number) {
        const wallet = await WalletRepository.findById(walletId)

        if (!wallet) throw new NotFoundError(`Não existe wallet com o ID ${walletId}`)

        checkSignature({ id: userId, name: "Usuário" }, { id: wallet.userId, name: "Carteira" })

        return wallet
    },

    async getWallets(userId: number) {
        const wallets = await WalletRepository.getWallets(userId)

        return wallets
    }
}