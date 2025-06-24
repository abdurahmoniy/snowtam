import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "../providers";

export const metadata: Metadata = {
    title: {
        template: "%s | Boshqaruv Paneli",
        default: "Boshqaruv Paneli",
    },
};

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    <NextTopLoader color="#5750F1" showSpinner={false} />

                    <div className="min-h-screen bg-gray-2 dark:bg-[#020d1a]">
                        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                            {children}
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
} 