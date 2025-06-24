import { IUser } from "@/consts/authOptions";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    expires: stirng;
    user: IUser;
  }
} 