import { prisma } from "../config/database"
import { AssetRepository } from "../repositories/assetRepository"
import { WalletRepository } from "../repositories/walletRepository"
import { AssetIdentityRepository } from "../repositories/assetIdentityRepository"
import { BadRequest, NotFoundError } from "../utils/errorUtils"
import { checkSignature } from "../utils/checkSignatureUtil"
import { TransferAsset, BuyAsset, SellAsset } from "../types/assetIdentifyType";

export const AssetIdentityService = {
    async transferAsset(transferData: TransferAsset, userId: number) {
        const { identifyId, quantity, sourceAssetId, sourceWalletId, targetWalletId } = transferData

        const identify = await AssetIdentityRepository.findById(identifyId)

        if (!identify) throw new NotFoundError(`Tipo de ativo não encontrado.`)

        const sourceWallet = await WalletRepository.findById(sourceWalletId)

        if (!sourceWallet) throw new NotFoundError(`A Carteira remetente não foi encontrada no sistema.`)

        checkSignature({ id: userId, name: "Usuário" }, { id: sourceWallet.userId, name: "Carteira" })

        const targetWallet = await WalletRepository.findById(targetWalletId)

        if (!targetWallet) throw new NotFoundError(`A Carteira destinatária não foi encontrada no sistema.`)

        checkSignature({ id: userId, name: "Usuário" }, { id: targetWallet.userId, name: "Carteira" })

        const sourceAsset = await AssetRepository.getAsset({
            id: sourceAssetId,
            walletId: sourceWallet.id
        })

        if (!sourceAsset) throw new NotFoundError(`O Ativo remetente não foi encontrado no sistema ou não esta vinculado a Carteira remetente.`)

        if (sourceAsset.quantity < quantity) throw new BadRequest("A quantidade a ser transferida deve ser maior ou igual a quantidade presente no Ativo remetente")

        const transaction = await prisma.$transaction(async (tx) => {
            await tx.asset.update({
                where: { id: sourceAsset.id },
                data: {
                    quantity: sourceAsset.quantity - quantity
                }
            })

            await tx.asset.upsert({
                where: {
                    identifyId_walletId: {
                        identifyId: identifyId,
                        walletId: targetWalletId
                    }
                },
                create: {
                    purchasePrice: sourceAsset.purchasePrice,
                    quantity,
                    walletId: targetWalletId,
                    identifyId: identify.id,
                },
                update: {
                    quantity: { increment: quantity }
                }
            })

            const transfer = await tx.transaction.create({
                data: {
                    assetId: sourceAsset.id,
                    type: "transfer",
                    quantity,
                    price: 0
                }
            })

            return transfer
        })

        return transaction
    },

    async buyAsset(buyData: BuyAsset, userId: number) {
        const { identifyId, price, quantity, walletId } = buyData

        const wallet = await WalletRepository.findById(walletId)

        if (!wallet) throw new NotFoundError(`A Carteira ID ${walletId} não foi encontrada no sistema.`)

        checkSignature({ id: userId, name: "Usuário" }, { id: wallet.userId, name: "Carteira" })

        const identify = await AssetIdentityRepository.findById(identifyId)

        if (!identify) throw new NotFoundError(`Tipo de ativo não encontrado.`)

        const assetCurrent = await AssetRepository.getAsset({
            identifyId: identifyId,
            walletId: walletId
        })

        let newTotalCost: number
        let newQuantity: number

        if (assetCurrent) {
            const oldTotalCost = assetCurrent.purchasePrice * assetCurrent.quantity
            const newPurchaseCost = quantity * price

            newTotalCost = oldTotalCost + newPurchaseCost
            newQuantity = assetCurrent.quantity + quantity
        } else {
            newTotalCost = quantity * price
            newQuantity = quantity
        }

        const newPurchasePrice = newTotalCost / newQuantity

        const transaction = await prisma.$transaction(async (tx) => {
            const asset = await tx.asset.upsert({
                where: {
                    identifyId_walletId: {
                        identifyId: identifyId,
                        walletId: walletId
                    }
                },
                create: {
                    identifyId: identifyId,
                    walletId: walletId,
                    quantity: newQuantity,
                    purchasePrice: newPurchasePrice
                },
                update: {
                    quantity: newQuantity,
                    purchasePrice: newPurchasePrice
                }
            })

            const transfer = await tx.transaction.create({
                data: {
                    price,
                    quantity,
                    type: "buy",
                    assetId: asset.id
                }
            })

            return { asset, transfer }
        })

        return transaction
    },

    async sellAsset(sellData: SellAsset, userId: number) {
        const { assetId, price, quantity } = sellData

        const asset = await AssetRepository.getAsset({ id: assetId })

        if (!asset) throw new NotFoundError(`O Ativo não foi encontrado no sistema ou não esta vinculado a Carteira.`)

        checkSignature({ id: userId, name: "Usuário" }, { id: asset.wallet.userId, name: "Carteira" })

        if (asset.quantity < quantity) throw new BadRequest("Saldo insuficiente para realizar a venda.")

        const transaction = await prisma.$transaction(async (tx) => {
            const updatedAsset = await tx.asset.update({
                where: { id: assetId },
                data: {
                    quantity: { decrement: quantity }
                }
            })

            const transfer = await tx.transaction.create({
                data: {
                    price,
                    quantity,
                    type: "sell",
                    assetId: asset.id
                }
            })

            return { updatedAsset, transfer }
        })

        return transaction
    }
}
