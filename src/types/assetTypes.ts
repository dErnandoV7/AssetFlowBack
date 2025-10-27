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

export interface AssetCursorData {
    cursorId?: number,
    orderBy?: OrderByAssets,
    direction?: "asc" | "desc",
    walletId?: number
}

export interface AssetsCursorData {
    cursorId?: number,
    orderBy?: OrderByAssets,
    direction?: "asc" | "desc",
    walletId?: number
}

export type OrderByAssets = "purchasePrice" | "quantity" | "countTransaction"