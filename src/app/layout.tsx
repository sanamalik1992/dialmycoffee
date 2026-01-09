import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import LoginButton from "@/components/LoginButton";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Dialmycoffee - AI Espresso Grind Settings for Your Coffee Machine",
  description: "Get perfect espresso grind settings instantly. AI-powered recommendations for 100+ machines (Sage, Breville, Gaggia) and 500+ coffee beans. Free grind calculator.",
  keywords: "espresso grind settings, coffee grinder settings, Sage Barista Express grind, Breville grind size, espresso dial in, coffee grind calculator, AI coffee assistant",
  authors: [{ name: "Dialmycoffee" }],
  openGraph: {
    title: "Dialmycoffee - Perfect Espresso Grind Settings",
    description: "AI-powered grind recommendations for your coffee machine and beans",
    url: "https://www.dialmycoffee.com",
    siteName: "Dialmycoffee",
    images: [
      {
        url: "https://www.dialmycoffee.com/logo.png",
        width: 1200,
        height: 630,
        alt: "Dialmycoffee - AI Espresso Grind Calculator",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dialmycoffee - Perfect Espresso Grind Settings",
    description: "AI-powered grind recommendations for your coffee machine",
    images: ["https://www.dialmycoffee.com/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brandBlack = "#000000";
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Dialmycoffee",
    "description": "AI-powered espresso grind settings calculator for coffee machines",
    "url": "https://www.dialmycoffee.com",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "3.99",
      "priceCurrency": "GBP",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "3.99",
        "priceCurrency": "GBP",
        "billingDuration": "P1M"
      }
    }
  };
  
  return (
    <html lang="en-GB">
      <head>
        <link rel="canonical" href="https://www.dialmycoffee.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body
        style={{ backgroundColor: brandBlack }}
        className="min-h-screen text-white"
      >
        <header
          style={{ backgroundColor: brandBlack }}
          className="sticky top-0 z-50 border-b border-zinc-800/50 backdrop-blur-xl bg-black/80"
        >
          <div className="mx-auto max-w-6xl px-3 sm:px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Coffee Icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 21h18v-2H2v2zM20 8h-2V5h2c1.1 0 2 .9 2 2s-.9 2-2 2zm-2 10H4V5h12v13h2zm0-15H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-1h2c1.66 0 3-1.34 3-3V7c0-1.66-1.34-3-3-3h-2V3z"/>
                </svg>
              </div>
              
              {/* Text Logo */}
              <span className="text-xl font-bold tracking-tight">
                <span className="text-white">dial</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">my</span>
                <span className="text-white">coffee</span>
              </span>
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
