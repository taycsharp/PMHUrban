import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phu My Hung Homes CRM",
  description: "Verified Phu My Hung property portal and broker CRM.",
  keywords: ["Phu My Hung", "real estate", "rent", "sale", "CRM", "District 7"]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

