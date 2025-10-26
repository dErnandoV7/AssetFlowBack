export interface TransferAsset {
    sourceWalletId: number,
    targetWalletId: number,
    sourceAssetId: number,
    identifyId: number,
    quantity: number
}

export interface BuyAsset {
    walletId: number,
    identifyId: number,
    quantity: number,
    price: number
}

export interface SellAsset {
    assetId: number,
    quantity: number,
    price: number
}

export interface FilterTransferData {
    typeFilter: TransferFilter,
    filterValue: string | undefined,
    page?: number,
    pageSize?: number
}

export type TransferFilter = "typeTransfer" | "wallet" | undefined
