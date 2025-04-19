"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-teal-600 dark:text-teal-500">eVet</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-teal-600 ${
              isActive("/") ? "text-teal-600 dark:text-teal-500" : "text-foreground/60"
            }`}
          >
            Home
          </Link>
          <Link
            href="/diagnosis"
            className={`text-sm font-medium transition-colors hover:text-teal-600 ${
              isActive("/diagnosis") ? "text-teal-600 dark:text-teal-500" : "text-foreground/60"
            }`}
          >
            Diagnosis
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild size="sm" className="bg-teal-600 hover:bg-teal-700">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
        <button className="flex md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-b">
          <div className="container py-4 grid gap-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                isActive("/") ? "text-teal-600 dark:text-teal-500" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/diagnosis"
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                isActive("/diagnosis") ? "text-teal-600 dark:text-teal-500" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Diagnosis
            </Link>
            <div className="flex flex-col gap-2 mt-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-teal-600 hover:bg-teal-700">
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
