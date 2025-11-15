import { prisma } from "../config/database"
import { Prisma } from "@prisma/client"
import { AssetRepository } from "../repositories/assetRepository"
import { WalletRepository } from "../repositories/walletRepository"
import { AssetIdentityRepository } from "../repositories/assetIdentityRepository"
import { TransactionRepository } from "../repositories/transactionRepository"
import { BadRequest, NotFoundError } from "../utils/errorUtils"
import { TransferAsset, BuyAsset, SellAsset, FilterTransferData } from "../types/transactionTypes";

export const TransactionService = {
    async transferAsset(transferData: TransferAsset, userId: number) {
        const { identifyId, quantity, sourceAssetId, sourceWalletId, targetWalletId } = transferData

        const identify = await AssetIdentityRepository.findById(identifyId)
        if (!identify) throw new NotFoundError(`Tipo de ativo não encontrado.`)

        const sourceWallet = await WalletRepository.findById(sourceWalletId, userId)
        if (!sourceWallet || sourceWallet.userId !== userId) throw new NotFoundError(`A Carteira remetente não foi encontrada no sistema ou não está vinculado ao usuário autenticado.`)

        const targetWallet = await WalletRepository.findById(targetWalletId, userId)
        if (!targetWallet || targetWallet.userId !== userId) throw new NotFoundError(`A Carteira destinatária não foi encontrada no sistema ou não está vinculado ao usuário autenticado.`)

        const sourceAsset = await AssetRepository.getAsset({
            id: sourceAssetId,
            walletId: sourceWallet.id
        })

        if (!sourceAsset) throw new NotFoundError(`O Ativo remetente não foi encontrado no sistema ou não esta vinculado a Carteira remetente.`)

        if (sourceAsset.quantity < quantity) throw new BadRequest("A quantidade a ser transferida deve ser maior ou igual a quantidade presente no Ativo remetente")

        const removeSourceAsset = quantity === sourceAsset.quantity

        const transaction = await prisma.$transaction(async (tx) => {

            if (removeSourceAsset) {
                await tx.asset.delete({ where: { id: sourceAsset.id } })

            } else {
                await tx.asset.update({
                    where: { id: sourceAsset.id },
                    data: {
                        quantity: sourceAsset.quantity - quantity
                    }
                })
            }

            const targetAsset = await tx.asset.upsert({
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
                    assetId: targetAsset.id,
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

        const wallet = await WalletRepository.findById(walletId, userId)

        if (!wallet || wallet.userId !== userId) throw new NotFoundError(`A Carteira ID ${walletId} não foi encontrada no sistema ou não esta vinculada ao usuário autenticado.`)

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

        if (!asset || asset.wallet.userId !== userId) throw new NotFoundError(`O Ativo não foi encontrado no sistema ou não esta vinculado à alguma carteira pertencente ao usuário logado.`)

        if (asset.quantity < quantity) throw new BadRequest("Saldo insuficiente para realizar a venda.")

        const removeAsset = quantity === asset.quantity

        const transaction = await prisma.$transaction(async (tx) => {

            if (removeAsset) {
                await tx.asset.delete({ where: { id: assetId } })

                return { transfer: null, updatedAsset: null }
            }

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

            return { transfer, updatedAsset }
        })

        return transaction
    },

    async getAllTransfer(filterData: FilterTransferData, userId: number) {
        const { typeTransfer, walletId, walletType, page } = filterData

        if (walletId) {
            const wallet = await WalletRepository.findById(Number(walletId), userId)

            if (!wallet || wallet.userId !== userId) throw new NotFoundError(`Não existe carteira ID ${walletId} no sistema ou não pertence ao usuário autenticado.`)
        }

        let where: Prisma.TransactionWhereInput = {
            asset: {
                wallet: {
                    userId
                },
                ...(walletId ? { walletId: Number(walletId) } : {}),
                ...(walletType ? { wallet: { type: walletType } } : {})
            },
            ...(typeTransfer ? { type: typeTransfer } : {})
        }

        let skip: number = 0
        let take: number = 10

        const pageNumber = Number(page) || undefined

        if (pageNumber) skip = (pageNumber - 1) * take

        const transactions = await TransactionRepository.getTransaction(where, skip, take)

        const count = await TransactionRepository.countTransaction(where)

        return { transactions, count }
    }
}
