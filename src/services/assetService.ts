import { AssetRepository } from "../repositories/assetRepository";
import { WalletRepository } from "../repositories/walletRepository";
import { AssetIdentityRepository } from "../repositories/assetIdentityRepository";
import { CreateAsset } from "../types/assetTypes";
import { ConflictError, NotFoundError } from "../utils/errorUtils";
import { checkSignature } from "../utils/checkSignatureUtil";
import { Prisma } from "@prisma/client";

export const AssetService = {
    async createAsset(assetData: CreateAsset, walletId: number, userId: number) {
        const existingWallet = await WalletRepository.findById(walletId)

        if (!existingWallet) throw new NotFoundError(`Não existe carteira com o ID ${walletId}.`)

        checkSignature({ id: userId, name: "Usuário" }, { id: existingWallet.userId, name: "Carteira" })

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
        const existingAsset = await AssetRepository.getAsset({ id: assetId })

        if (!existingAsset) throw new NotFoundError("Não existe Ativo vinculado ao ID informado.")

        checkSignature({ id: userId, name: "Usuário" }, { id: existingAsset.wallet.userId, name: "Carteira" })

        await AssetRepository.deleteAsset(assetId)
    },

    async getAssets(walletId: number, userId: number) {
        let where: any = {}

        if (walletId) {
            const existingWallet = await WalletRepository.findById(walletId)

            if (!existingWallet) throw new NotFoundError(`Não existe Carteira vinculada ao ID ${walletId}.`)

            checkSignature({ id: userId, name: "Usuário" }, { id: existingWallet.userId, name: "Carteira" })


            where = {
                walletId: walletId
            }
        } else {
            where = {
                wallet: {
                    userId: userId
                }
            }
        }

        const assets = await AssetRepository.getAssets(where)

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