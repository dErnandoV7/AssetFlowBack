export interface CreateAsset {
    name: string,
    quantity: number,
    purchasePrice: number,
    walletId: number
}

export interface UpdateAsset {
    name?: string,
    quantity?: number,
    purchasePrice?: number,
}