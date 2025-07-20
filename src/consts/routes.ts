import { ROLES } from "./role-based-routing";

export enum ROUTES {
  LOGIN = "/auth/sign-in",
  SIGNUP = "/auth/sign-up",
  HOME = "/",
  AIRPORTS = "/airports",
}

export const defaultRoutes: Record<ROLES, string> = {
  ROLE_USER: "/",
  OPERATOR: "/",
  SUPER_ADMIN: "/airports",
};
