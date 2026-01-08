import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginButton from "@/components/LoginButton";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Dialmycoffee",
  description: "Dial in espresso faster with machine + bean grind recommendations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brandBlack = "#000000";
  
  return (
    <html lang="en">
      <body
        style={{ backgroundColor: brandBlack }}
        className="min-h-screen text-white"
      >
        <header
          style={{ backgroundColor: brandBlack }}
          className="sticky top-0 z-50 border-b border-zinc-900"
        >
          <div className="mx-auto max-w-6xl px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
            <Link href="/" className="cursor-pointer flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Dialmycoffee"
                width={140}
                height={35}
                className="sm:w-[170px] sm:h-[42px] w-[140px] h-[35px]"
                priority
              />
            </Link>
            <LoginButton />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-3 sm:px-4 py-4 sm:py-8">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
