import { TypeWallet } from "./walletTypes"

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
    typeTransfer?: TypeTransfer,
    walletId?: string,
    walletType?: TypeWallet,
    page?: string,
}

export type TypeTransfer = "buy" | "sell" | "transfer" 