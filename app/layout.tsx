import type React from "react";
import { Mona_Sans as FontSans } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";
import type { Metadata } from "next";
import AuthProvider from "@/hooks/auth-context";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "eVet - Veterinary Diagnosis Platform",
  description:
    "Advanced disease diagnosis using AI for veterinary professionals",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable}  font-sans min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
