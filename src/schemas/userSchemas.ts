import { z } from "zod"

const userIdParams = z.object({
    id:
        z.string()
            .refine(
                (id) => !isNaN(Number(id)) && Number.isInteger(Number(id)),
                "O ID do usuário deve ser um número inteiro."
            )
})

const userEmailInBody = z.string()
    .email("O formato do email está inválido.")
    .min(1, "O email do usuário não pode ser vazio.")
    .transform((v) => v.toLowerCase())

const userNameInBody = z.string()
    .min(1, "O nome do usuário não pode ser vazio.")

const userPasswordInBody = z.string()
    .min(8, "A senha do usuário deve ter no mínimo 8 caracteres.")

export const createUserSchema = z.object({
    body: z.object({
        name: userNameInBody,
        email: userEmailInBody,
        password: userPasswordInBody
    })
})

export const updateUserSchema = z.object({
    params: userIdParams,

    body: z.object({
        name: userNameInBody.optional(),

        email: userEmailInBody.optional(),

        password: userPasswordInBody.optional()
    })
})

export const deleteUserSchema = z.object({
    params: userIdParams,
})

export const getUserByIdSchema = z.object({
    params: userIdParams,
})

export const loginUserSchema = z.object({
    body: z.object({
        email: userEmailInBody,
        password:
            z.string()
                .min(1, "Valor de senha inválido.")
    })
})

export const comparePasswordSchema = z.object({
    params: userIdParams,
    body: z.object({
        password: userPasswordInBody
    })
})

export type CreateUserSchema = z.infer<typeof createUserSchema>["body"]
export type UpdateUserSchema = {
    params: z.infer<typeof updateUserSchema>["params"],
    body: z.infer<typeof updateUserSchema>["body"]
}
export type DeleteUserSchema = z.infer<typeof deleteUserSchema>["params"]
export type GetUserByIdSchema = z.infer<typeof getUserByIdSchema>["params"]
export type LoginUserSchema = z.infer<typeof loginUserSchema>["body"]
export type ComparePasswordSchema = {
    params: z.infer<typeof comparePasswordSchema>["params"],
    body: z.infer<typeof comparePasswordSchema>["body"]
}