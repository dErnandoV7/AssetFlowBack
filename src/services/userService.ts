import { UserRepository } from "../repositories/userRepository";
import { UpdateUserData, UserData } from "../types/userTypes";
import { hashPassword, comparePassword } from "../utils/hashUtils"
import { NotFoundError, ConflictError, BadRequest } from "../utils/errorUtils";
import { authUtil } from "../utils/jwtUtils";

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

        const updatedUser = await UserRepository.updateUser({
            email: userData.email,
            name: userData.name,
            password: userData.password
        }, userId)

        return updatedUser
    },

    async deleteUser(userId: number) {
        const existingUser = await UserRepository.findById(userId)

        if (!existingUser) throw new NotFoundError(`Não existe usuário com ID ${userId} no sistema.`)

        await UserRepository.deleteUser(userId)

        return { id: existingUser.id, name: existingUser.name }
    },

    async loginUser(email: string, password: string) {
        const user = await UserRepository.findByEmailForValidationUser(email)

        if (!user) throw new NotFoundError("Email ou senha incorretos.")

        const validPassword = await comparePassword(password, user.password)

        if (!validPassword) throw new NotFoundError("Email ou senha incorretos.")

        const token = authUtil.generateToken({ id: user.id, email: user.email })

        return {
            user: {
                id: user.id, name: user.name, email: user.email
            },
            token
        }
    },

    async compareUserPassword(userId: number, password: string) {
        const user = await UserRepository.findByIdWithPassword(userId)

        if (!user) throw new NotFoundError(`Usuário com ID ${userId} não foi encontrado.`)

        const isSamePassword = await comparePassword(password, user.password)

        if (!isSamePassword) throw new BadRequest("Senha inválida.")

        return {
            id: user.id,
            name: user.name,
            email: user.email
        }
    }
}