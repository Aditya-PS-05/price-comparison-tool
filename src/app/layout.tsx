import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PriceSphere - Global Price Comparison",
  description: "Compare prices across global markets with AI-powered analysis",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'PriceSphere - Global Price Comparison',
    description: 'Compare prices across global markets with AI-powered analysis',
    type: 'website',
    locale: 'en_US',
    siteName: 'PriceSphere',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PriceSphere - Global Price Comparison',
    description: 'Compare prices across global markets with AI-powered analysis',
  },
  keywords: ['price comparison', 'global shopping', 'AI analysis', 'best deals', 'e-commerce', 'product search'],
  authors: [{ name: 'PriceSphere Team' }],
  creator: 'PriceSphere',
  publisher: 'PriceSphere',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
