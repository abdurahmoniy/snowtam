import "@/css/satoshi.css";
import "@/css/style.css";

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { type PropsWithChildren } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: "%s | Boshqaruv Paneli",
    default: "Boshqaruv Paneli",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
