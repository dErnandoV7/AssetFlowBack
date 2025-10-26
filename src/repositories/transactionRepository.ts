import { prisma } from "../config/database"

export const TransactionRepository = {
    async getTransaction(
        where: any,
        skip: number,
        take: number
    ) {
        return prisma.transaction.findMany({ where, take, skip })
    },

    async countTransaction(where: any) {
        return prisma.transaction.count({ where })
    }
}