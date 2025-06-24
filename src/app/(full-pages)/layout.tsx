"use client"

import AuthCheck from "@/components/Auth/AuthCheck";
import { Header } from "@/components/Layouts/header";
import { Sidebar } from "@/components/Layouts/sidebar";
import { useSession } from "next-auth/react";
import { useEffect, type PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      localStorage.setItem("user", JSON.stringify(session));
    }
  }, [session]);

  return (
    <AuthCheck>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          <Header />

          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-2 md:p-4 2xl:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthCheck>
  );
}
