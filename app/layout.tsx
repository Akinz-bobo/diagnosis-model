import type React from "react";
import { Mona_Sans as FontSans } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";
import type { Metadata } from "next";
import NextAuthProvider from "@/hooks/auth-context";
import AuthEventListener from "@/components/auth/auth-event-listener";
import { Toaster } from "sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "eVet - Veterinary Diagnosis Platform",
  description:
    "Advanced disease diagnosis using AI for veterinary professionals",
  generator: "eVet",
};

// Force dynamic rendering to ensure authentication works correctly
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} font-sans min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <NextAuthProvider>
            <AuthEventListener />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster richColors position="top-center" />
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
