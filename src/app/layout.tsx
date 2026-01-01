import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginButton from "@/components/LoginButton";

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
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/logo.png"
                alt="Dialmycoffee"
                width={170}
                height={42}
                priority
              />
            </Link>
            <LoginButton />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}