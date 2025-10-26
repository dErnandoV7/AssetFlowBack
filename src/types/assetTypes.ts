export interface CreateAsset {
    identifyId: number,
    quantity: number,
    purchasePrice: number,
    walletId: number,
}

export interface UpdateAsset {
    name?: string,
    quantity?: number,
    purchasePrice?: number,
}