export interface CreateWallet {
    name: string,
    type: "investment" | "savings" | "checking",
    userId: number
}

export interface UpdateWallet {
    name?: string,
    type?: "investment" | "savings" | "checking",
}