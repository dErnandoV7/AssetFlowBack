export interface UserData {
    name: string;
    email: string;
    password: string;
}

export interface CreateUserData {
    name?: string;
    email?: string;
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    password?: string;
}