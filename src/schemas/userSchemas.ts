import { z } from "zod"

export const createUserSchema = z.object({
    body: z.object({
        name:
            z.string()
                .min(1, "O nome do usuário não pode ser vazio."),
        email:
            z.string()
                .email("O formato do email está inválido.")
                .min(1, "O email do usuário não pode ser vazio.")
                .transform((v) => v.toLocaleLowerCase()),
        password:
            z.string()
                .min(8, "A senha do usuário deve ter no mínimo 8 caracteres.")
    })
})

export const updateUserSchema = z.object({
    params: z.object({
        id:
            z.string()
                .refine(
                    (id) => !isNaN(Number(id)) && Number.isInteger(Number(id)),
                    "O ID do usuário deve ser um número inteiro."
                )
    }),

    body: z.object({
        name:
            z.string()
                .min(1, "O nome do usuário não pode ser vazio.")
                .optional(),
        email:
            z.string()
                .email("O formato do email está inválido.")
                .min(1, "O email do usuário não pode ser vazio.")
                .transform((v) => v.toLocaleLowerCase())
                .optional(),
        password:
            z.string()
                .min(8, "A senha do usuário deve ter no mínimo 8 caracteres.")
                .optional()
    })
})

export const deleteUserSchema = z.object({
    params: z.object({
        id:
            z.string()
                .refine(
                    (id) => !isNaN(Number(id)) && Number.isInteger(Number(id)),
                    "O ID do usuário deve ser um número inteiro."
                )
    })
})

export const getUserByIdSchema = z.object({
    params: z.object({
        id:
            z.string()
                .refine(
                    (id) => !isNaN(Number(id)) && Number.isInteger(Number(id)),
                    "O ID do usuário deve ser um número inteiro."
                )
    })
})

export type CreateUserSchema = z.infer<typeof createUserSchema>["body"]
export type UpdateUserSchema = {
    params: z.infer<typeof updateUserSchema>["params"],
    body: z.infer<typeof updateUserSchema>["body"]
}
export type DeleteUserSchema = z.infer<typeof deleteUserSchema>["params"]
export type GetUserByIdSchema = z.infer<typeof getUserByIdSchema>["params"]
