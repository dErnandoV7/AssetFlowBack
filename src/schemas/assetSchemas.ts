import z from "zod"
import { TYPES_WALLET, ASSETS_ORDER_BY } from "../utils/assetsUtils"

const assetIdParams = z.object({
    id:
        z.string()
            .refine(
                (id) => !isNaN(Number(id)) && Number.isInteger(Number(id)),
                "O ID do Ativo deve ser um número inteiro."
            )
})

const assetUsingCursor = {
    cursorId:
        z.number()
            .refine((n) => Number.isInteger(n), "CursorId deve ser um número inteiro.")
            .optional(),
    orderBy:
        z.enum(ASSETS_ORDER_BY, "Tipo de ordenação inválida.")
            .optional(),

    direction:
        z.enum(["asc", "desc"], "Direção inválida. Use asc ou desc.")
            .optional()
}

const assetWalletAndAssetId = z.string()
    .refine((n) => !isNaN(Number(n)) && Number.isInteger(Number(n)), "O ID da carteira deve ser um numero inteiro")

export const createAssetSchema = z.object({
    body: z.object({
        identifyId:
            z.number()
                .refine((n) => Number.isInteger(n), "O ID da Ativo deve ser um numero inteiro"),

        quantity:
            z.number()
                .refine((n) => n >= 0, "A quantidade de ativos não pode ser um número negativo."),

        purchasePrice:
            z.number()
                .refine((n) => n >= 0, "O preço de compra não pode ser um número negativo."),

        walletId:
            z.number()
                .refine((n) => Number.isInteger(n), "O ID da carteira deve ser um numero inteiro")
    })
})

export const deleteAssetSchema = z.object({
    params: assetIdParams,
})

export const getAssetsSchema = z.object({
    body: z.object({
        ...assetUsingCursor,
        walletType:
            z.enum(TYPES_WALLET, "Tipo de carteira inválido.")
                .optional()
    }),

    query: z.object({
        walletId: assetWalletAndAssetId
            .optional(),

        search:
            z.string()
                .optional()
    })
})

export const getAssetSchema = z.object({
    params: z.object({
        id: assetWalletAndAssetId
    }),
})

export type CreateAssetSchema = z.infer<typeof createAssetSchema>["body"]
export type DeleteAssetSchema = z.infer<typeof deleteAssetSchema>["params"]

export type GetAssetsSchemaQuery = z.infer<typeof getAssetsSchema>["query"]
export type GetAssetsSchemaBody = z.infer<typeof getAssetsSchema>["body"]

export type GetAssetSchemaParams = z.infer<typeof getAssetSchema>["params"]

