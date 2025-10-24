import { UserService } from "../services/userService";
import { Request, Response, NextFunction } from "express"
import { CreateUserSchema, DeleteUserSchema, GetUserByIdSchema, UpdateUserSchema, LoginUserSchema } from "../schemas/userSchemas"

export const UserController = {
    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body as CreateUserSchema

            const userCreated = await UserService.createUser({ name, email, password })

            return res.status(201).json({
                message: "Usuário criado com sucesso!",
                user: userCreated
            })
        } catch (error) {
            next(error)
        }
    },

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getAllUsers()

            return res.status(200).json({
                message: "Busca realizada com sucesso!",
                users
            })
        } catch (error) {
            next(error)
        }
    },

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as UpdateUserSchema["params"]
            const data = req.body as UpdateUserSchema["body"]

            const updatedUser = await UserService.updateUser(data, Number(id))

            return res.status(200).json({
                message: "Usuário atualizado com sucesso!",
                updatedUser
            })

        } catch (error) {
            next(error)
        }
    },

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as DeleteUserSchema

            await UserService.deleteUser(Number(id))

            return res.status(200).json({
                message: `Usuário ID ${id} foi excluído com sucesso.`
            })


        } catch (error) {
            next(error)
        }
    },

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as GetUserByIdSchema

            const user = await UserService.getUserById(Number(id))

            return res.status(200).json({
                message: `Usuário ID ${id} foi encontrado com sucesso!`,
                user
            })
        } catch (error) {
            next(error)
        }
    },

    async loginUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body as LoginUserSchema

            const validateEmailAndPassword = await UserService.loginUser(email, password)

            return res.status(200).json({
                message: "Usuário logado com sucesso.",
                user: validateEmailAndPassword.user,
                token: validateEmailAndPassword.token
            })

        } catch (error) {
            next(error)
        }
    }
}