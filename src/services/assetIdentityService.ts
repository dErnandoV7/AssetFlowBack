import { AssetIdentityRepository } from "../repositories/assetIdentityRepository";

export const AssetIdentityService = {
    async getAssetIdentityAll() {
        const assetsIdentity = await AssetIdentityRepository.findAll()

        return assetsIdentity
    }
}