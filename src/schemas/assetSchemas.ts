import z from "zod"

const assetIdParams = z.object({
    id:
        z.string()
            .refine(
                (id) => !isNaN(Number(id)) && Number.isInteger(Number(id)),
                "O ID do Ativo deve ser um número inteiro."
            )
})

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
    query: z.object({
        walletId: assetWalletAndAssetId
        .optional(),
    })
})

export const getAssetSchema = z.object({
    params: z.object({
        id: assetWalletAndAssetId
    }),

    query: z.object({
        walletId: assetWalletAndAssetId,
    })
})

export type CreateAssetSchema = z.infer<typeof createAssetSchema>["body"]
export type DeleteAssetSchema = z.infer<typeof deleteAssetSchema>["params"]

export type GetAssetsSchemaQuery = z.infer<typeof getAssetsSchema>["query"]
export type GetAssetSchemaParams = z.infer<typeof getAssetSchema>["params"]
export type GetAssetSchemaQuery = z.infer<typeof getAssetSchema>["query"]