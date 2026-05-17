import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers";
import { Navigation } from "@/components/navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TransitX — Decentralized Freight on Stellar",
  description:
    "Transparent, blockchain-secured freight and logistics management built on the Stellar network.",
  keywords: ["stellar", "freight", "logistics", "blockchain", "USDC", "Web3", "Soroban"],
  openGraph: {
    title: "TransitX",
    description: "Decentralized freight and logistics, transparently secured on Stellar.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navigation />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
