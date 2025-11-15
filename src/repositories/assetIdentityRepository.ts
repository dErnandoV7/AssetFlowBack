import { prisma } from "../config/database"

export const AssetIdentityRepository = {
    async findById(id: number) {
        return prisma.assetIdentity.findUnique({
            where: { id }
        })
    },

    async findAll() {
        return prisma.assetIdentity.findMany()
    }
}