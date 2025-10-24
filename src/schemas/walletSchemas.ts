import z from "zod"

const walletId = z.object({
    id: z.string().refine(
        (id) => !isNaN(Number(id)) && Number.isInteger(Number(id)),
        "O ID da carteira deve ser um número inteiro."
    )
});

const walletTypeEnum = z.enum(["investment", "savings", "checking"], "O tipo da carteira é inválido.");

export const createWalletSchema = z.object({
    body: z.object({
        name:
            z.string()
                .min(1, "O nome da carteira não deve estar vazio."),
        type: walletTypeEnum
    })
})

export const updateWalletSchema = z.object({
    params: walletId,
    body: z.object({
        name:
            z.string()
                .min(1, "O nome da carteira não deve ser vazio")
                .optional(),

        type: walletTypeEnum.optional()
    })
})

export const deleteWalletSchema = z.object({
    params: walletId
})

export const getWalletSchema = z.object({
    params: walletId
})

export type CreateWalletSchema = z.infer<typeof createWalletSchema>["body"]
export type UpdateWalletSchema = {
    body: z.infer<typeof updateWalletSchema>["body"],
    params: z.infer<typeof updateWalletSchema>["params"],
}
export type DeleteWalletSchema = z.infer<typeof deleteWalletSchema>["params"]
export type GetWalletSchema = z.infer<typeof getWalletSchema>["params"]