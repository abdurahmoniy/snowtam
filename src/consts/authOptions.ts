import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ROUTES } from "./routes";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt";

export interface IUser extends DefaultUser {
    email?: string;
    fullname?: string;
    role?: string[]; // ✅ array of roles
    status?: string;
}

export interface ISession extends DefaultSession {
    user: IUser;
    accessToken?: string;
}


export interface IJWT extends NextAuthJWT {
    email?: string;
    fullname?: string;
    role?: string;
    status?: string;
    accessToken?: string;
    accessTokenExpires?: number;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                accessToken: { label: "Access Token", type: "text" },
                email: { label: "Email", type: "text" },
                fullname: { label: "Full Name", type: "text" },
                role: { label: "Role", type: "text" },
                status: { label: "Status", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.accessToken || !credentials?.email) {
                    throw new Error("Invalid credentials");
                }

                let parsedRoles: string[] = [];
                try {
                    parsedRoles = JSON.parse(credentials.role ?? "[]");
                    if (!Array.isArray(parsedRoles)) parsedRoles = [];
                } catch (e) {
                    console.error("Failed to parse role array", e);
                }

                return {
                    id: `user-${credentials.email}`,
                    email: credentials.email,
                    fullname: credentials.fullname,
                    role: parsedRoles, // now correctly an array
                    status: credentials.status,
                    accessToken: credentials.accessToken,
                };
            }

        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const u = user as any;
                token.email = u.email;
                token.fullname = u.fullname;
                token.role = u.role;
                token.status = u.status;
                token.accessToken = u.accessToken;
                token.accessTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
            }
            return token;
        },

        async session({ session, token }) {
            session.user = {
            //   ...session.user,
                id: session.user.id,
              email: typeof token.email === "string" ? token.email : undefined,
              fullname: typeof token.fullname === "string" ? token.fullname : undefined,
              role: Array.isArray(token.role) ? token.role : [], // ✅ handle array of roles
              status: typeof token.status === "string" ? token.status : undefined,
            };
            session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
            return session;
          },          

        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
    },

    events: {
        async signOut() {
            if (typeof window !== "undefined") {
                localStorage.removeItem("user");
            }
        },
    },

    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 1 week
    },

    pages: {
        signIn: ROUTES.LOGIN,
        signOut: ROUTES.LOGIN,
    },

    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
};
