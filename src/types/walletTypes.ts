export interface CreateWallet {
    name: string,
    type: "investment" | "savings" | "checking"
}

export interface UpdateWallet {
    name?: string,
    type?: "investment" | "savings" | "checking",
}