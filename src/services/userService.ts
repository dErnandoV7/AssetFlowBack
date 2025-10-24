import { UserRepository } from "../repositories/userRepository";
import { CreateUserData, UpdateUserData, UserData } from "../types/userTypes";
import { hashPassword, comparePassword } from "../utils/hashUtils"
import { BadRequest, NotFoundError, ConflictError } from "../utils/errorUtils";
import { User } from "@prisma/client";

export const UserService = {
    async createUser(userData: UserData) {
        const { name, email, password } = userData

        const existingUserWithEmail = await UserRepository.findByEmail(email)

        if (existingUserWithEmail) throw new ConflictError("Este email já está cadastrado no sistema.")

        const passwordHashed = await hashPassword(password)

        const userCreated = await UserRepository.createUser({ name, email, password: passwordHashed })

        return userCreated
    },

    async getUserById(userId: number) {
        const user = await UserRepository.findById(userId)

        if (!user) throw new NotFoundError(`Usuário com ID ${userId} não foi encontrado.`)

        return user
    },

    async getAllUsers() {
        const users = await UserRepository.findManyUser()
        return users
    },

    async updateUser(userData: UpdateUserData, userId: number) {
        const existingUser = await UserRepository.findById(userId)

        if (!existingUser) throw new NotFoundError(`Não existe usuário com o ID ${userId}.`)

        const { email } = userData

        if (email && email !== existingUser.email) {
            const existingUsingEmail = await UserRepository.findByEmail(email)
            if (existingUsingEmail) throw new ConflictError(`Este email já esta cadastrado no sistema.`)
        }

        if (userData.password) {
            userData.password = await hashPassword(userData.password)
        }

        const updatedUser = await UserRepository.updateUser(userData, userId)

        return updatedUser
    },

    async deleteUser(userId: number) {
        const existingUser = await UserRepository.findById(userId)

        if (!existingUser) throw new NotFoundError(`Não existe usuário com ID ${userId} no sistema.`)

        await UserRepository.deleteUser(userId)

        return { id: existingUser.id, name: existingUser.name }
    }
}