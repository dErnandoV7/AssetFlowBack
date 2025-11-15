import { prisma } from "../config/database"

export const TransactionRepository = {
    async getTransaction(
        where: any,
        skip: number,
        take: number
    ) {
        return prisma.transaction.findMany({
            where,
            take,
            skip,
            orderBy: {
                createdAt: "desc"
            },
            include: {
                asset: {
                    select: {
                        identify: {
                            select: {
                                canonicalName: true
                            }
                        },
                        wallet: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
    },

    async countTransaction(where: any) {
        return prisma.transaction.count({ where })
    }
}