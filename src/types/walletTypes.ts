export interface CreateWallet {
    name: string,
    type: TypeWallet
}

export interface UpdateWallet {
    name?: string,
    type?: TypeWallet,
}

export type TypeWallet = "investment" | "savings" | "checking"