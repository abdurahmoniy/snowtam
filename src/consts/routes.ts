import { ROLES } from "./role-based-routing";

export enum ROUTES {
  LOGIN = "/auth/sign-in",
  SIGNUP = "/auth/sign-up",
  HOME = "/",
  AIRPORTS = "/airports",
}

export const defaultRoutes: Record<ROLES, string> = {
  OPERATOR: "/",
  SUPER_ADMIN: "/airports",
  ADMIN: "/airports",
  DISPETCHER: "/airports",
  SAI: "/airports",
  SPECIALIST: "/airports",

};
