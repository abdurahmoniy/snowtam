import NextAuth from "next-auth/next";
import { authOptions } from "@/consts/authOptions";

const authOption = NextAuth(authOptions);

export { authOption as GET, authOption as POST };
