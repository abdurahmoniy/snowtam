export enum ROUTES {
    login = "/auth/sign-in",
    signUp = "/auth/sign-up",
    home = "/",
}

export type UserRole =
    "ROLE_USER"

export const defaultRoutes: Record<string, string> = {
    ROLE_USER: "/"
}