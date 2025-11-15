import { prisma } from "../config/database"
import { UserData, CreateUserData, UpdateUserData } from "../types/userTypes"

export const UserRepository = {
    async findById(id: number) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true
            }
        })
    },

    async findByIdWithPassword(id: number) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                password: true
            }
        })
    },

    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true
            }
        })
    },

    async findByEmailForValidationUser(email: string) {
        return prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                name: true
            }
        })
    },

    async createUser(userData: UserData) {
        return prisma.user.create({
            select: {
                id: true,
                name: true,
                email: true
            },
            data: userData
        })

    },

    async findManyUser() {
        return prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true
            }
        })
    },

    async updateUser(data: UpdateUserData, id: number) {
        return prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true
            }
        })
    },

    async deleteUser(id: number) {
        return prisma.user.delete({ where: { id } })
    },

}