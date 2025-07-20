import { IUser } from "@/consts/authOptions";
import { ROLES } from "@/consts/role-based-routing";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    expires: stirng;
    user: IUser;
  }
} 




declare module "next-auth/jwt" {
  interface JWT {
    user: IUser;
    role: ROLES[];
    accessToken?: string;
    accessTokenExpires?: number;
  }
}
