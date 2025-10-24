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
    // .transform((n) => Number(n))

export const createAssetSchema = z.object({
    body: z.object({
        name:
            z.string()
                .min(1, "O nome do Ativo não pode ser vazio"),

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

export const updateAssetSchema = z.object({
    params: assetIdParams,
    body: z.object({
        name:
            z.string()
                .min(1, "O nome do Ativo não pode ser vazio")
                .optional(),

        quantity:
            z.number()
                .refine((n) => n >= 0, "A quantidade de ativos não pode ser um número negativo.")
                .optional(),

        purchasePrice:
            z.number()
                .refine((n) => n >= 0, "O preço de compra não pode ser um número negativo.")
                .optional(),
    })
})

export const deleteAssetSchema = z.object({
    params: assetIdParams,
})

export const getAssetsSchema = z.object({
    query: z.object({
        walletId: assetWalletAndAssetId,
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
export type UpdateAssetSchema = {
    body: z.infer<typeof updateAssetSchema>["body"],
    params: z.infer<typeof updateAssetSchema>["params"],
}
export type DeleteAssetSchema = z.infer<typeof deleteAssetSchema>["params"]

export type GetAssetsSchemaQuery = z.infer<typeof getAssetsSchema>["query"]
export type GetAssetSchemaParams = z.infer<typeof getAssetSchema>["params"]
export type GetAssetSchemaQuery = z.infer<typeof getAssetSchema>["query"]