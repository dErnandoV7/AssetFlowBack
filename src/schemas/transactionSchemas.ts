import z from "zod"
import { VALID_TRANSFER_TYPES } from "../utils/transactionUtil"
import { TYPES_WALLET } from "../utils/assetsUtils"

const walletAndAssetAndIdentifyAssetId = z.number()
    .refine((n) => Number.isInteger(n), "O ID da Carteira remetente deve ser um número inteiro.")

const quantityAsset = z.number()
    .refine((n) => n > 0, "A quantidade a ser transferida deve ser um valor positivo.")

export const transferAssetSchema = z.object({
    body: z.object({
        sourceWalletId: walletAndAssetAndIdentifyAssetId,
        targetWalletId: walletAndAssetAndIdentifyAssetId,
        sourceAssetId: walletAndAssetAndIdentifyAssetId,
        identifyId: walletAndAssetAndIdentifyAssetId,
        quantity: quantityAsset
    })
})

export const buyAssetSchema = z.object({
    body: z.object({
        identifyId: walletAndAssetAndIdentifyAssetId,
        walletId: walletAndAssetAndIdentifyAssetId,
        price:
            z.number()
                .refine((n) => n > 0, "A valor unitário do ativo deve ser um valor positivo."),
        quantity: quantityAsset
    })
})

export const sellAssetSchema = z.object({
    body: z.object({
        assetId: walletAndAssetAndIdentifyAssetId,
        price:
            z.number()
                .refine((n) => n > 0, "A valor unitário do ativo deve ser um valor positivo."),
        quantity: quantityAsset
    })
})

export const getAllTransferSchema = z.object({
    query: z.object({
        walletId: z.string()
            .refine((n) => Number.isInteger(Number(n)), "O ID da Carteira remetente deve ser um número inteiro.")
            .optional(),

        typeTransfer: z.enum(VALID_TRANSFER_TYPES, "Tipo de transferência inválido.")
            .optional(),

        walletType: z.enum(TYPES_WALLET, "Tipo de carteira inválido.")
            .optional(),

        page:
            z.string()
                .refine((n) => n && Number.isInteger(Number(n)), "O número da página deve ser positivo e inteiro.")
                .optional(),
    })
})

export type TransferAssetSchema = z.infer<typeof transferAssetSchema>["body"]
export type BuyAssetSchema = z.infer<typeof buyAssetSchema>["body"]
export type SellAssetSchema = z.infer<typeof sellAssetSchema>["body"]
export type GetAllTransferSchema = z.infer<typeof getAllTransferSchema>["query"]