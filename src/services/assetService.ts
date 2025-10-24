import { AssetRepository } from "../repositories/assetRepository";
import { WalletRepository } from "../repositories/walletRepository";
import { CreateAsset, UpdateAsset } from "../types/assetTypes";
import { ConflictError, NotFoundError } from "../utils/errorUtils";
import { checkSignature } from "../utils/checkSignatureUtil";

export const AssetService = {
    async createAsset(assetData: CreateAsset, walletId: number, userId: number) {
        const existingWallet = await WalletRepository.findById(walletId)

        if (!existingWallet) throw new NotFoundError(`Não existe carteira com o ID ${walletId}.`)

        checkSignature({ id: userId, name: "Usuário" }, { id: existingWallet.userId, name: "Carteira" })

        const { name } = assetData
        const existingAssetUsingName = await AssetRepository.getAsset({
            wallet: {
                id: existingWallet.id
            },
            name: name,
        })

        if (existingAssetUsingName) throw new ConflictError("Este nome de Ativo já existe nesta carteira, tente outro.")

        const createdAsset = await AssetRepository.createAsset(assetData)

        return createdAsset
    },

    async updateAsset(assetData: UpdateAsset, assetId: number, userId: number) {
        const existingAsset = await AssetRepository.getAsset({ id: assetId })

        if (!existingAsset) throw new NotFoundError("Não existe Ativo vinculado ao ID informado.")

        const wallet = await WalletRepository.findById(existingAsset.walletId)

        if (!wallet) throw new NotFoundError("Não foi possivel localizar a carteira, ela pode ser sido removida.")

        checkSignature({ id: userId, name: "Usuário" }, { id: wallet.userId, name: "Carteira" })

        if (assetData.name) {
            const existingAssetUsingName = await AssetRepository.getAsset({
                wallet: {
                    id: wallet.id
                },
                name: assetData.name,
            })

            if (existingAssetUsingName && existingAssetUsingName.id !== assetId) {
                throw new ConflictError("Este nome de Ativo já existe nesta carteira, tente outro.")
            }
        }

        const updatedAsset = await AssetRepository.updateAsset({
            name: assetData.name,
            purchasePrice: assetData.purchasePrice,
            quantity: assetData.quantity
        }, assetId)

        return updatedAsset
    },

    async deleteAsset(assetId: number, userId: number) {
        const existingAsset = await AssetRepository.getAsset({ id: assetId })

        if (!existingAsset) throw new NotFoundError("Não existe Ativo vinculado ao ID informado.")

        const wallet = await WalletRepository.findById(existingAsset.walletId)

        if (!wallet) throw new NotFoundError("Não foi possivel localizar a carteira, ela pode ser sido removida.")

        checkSignature({ id: userId, name: "Usuário" }, { id: wallet.userId, name: "Carteira" })

        await AssetRepository.deleteAsset(assetId)
    },

    async getAssets(walletId: number, userId: number) {
        const existingWallet = await WalletRepository.findById(walletId)

        if (!existingWallet) throw new NotFoundError(`Não existe Carteira vinculada ao ID ${walletId}.`)

        checkSignature({ id: userId, name: "Usuário" }, { id: existingWallet.userId, name: "Carteira" })

        const assets = await AssetRepository.getAssets(walletId)

        return assets
    },

    async getAsset(assetId: number, walletId: number, userId: number) {
        const wallet = await WalletRepository.findById(walletId)

        if (!wallet) throw new NotFoundError(`Não existe Carteira vinculada ao ID ${walletId}.`)

        checkSignature({ id: userId, name: "Usuário" }, { id: wallet.userId, name: "Carteira" })

        const asset = await AssetRepository.getAsset(
            {
                id: assetId,
                wallet: {
                    id: walletId
                }
            }
        )

        if (!asset) throw new NotFoundError(`Na carteira ID ${walletId}, não existe Ativo ID ${assetId}.`)

        return asset
    }
}