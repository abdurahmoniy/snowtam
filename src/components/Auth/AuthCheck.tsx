"use client";

import { ROUTES } from "@/consts/routes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../Loading";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Do nothing while loading
        if (status === "unauthenticated") {
            router.replace(ROUTES.login);
        }
    }, [status, router]);

    if (status === "authenticated") {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen items-center justify-center">
            {/* <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div> */}
            <Loading></Loading>
        </div>
    );
} 