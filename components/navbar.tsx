"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/auth-context";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { loading, user, logout } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleSignOut = async () => {
    await logout();
    window.location.href = "/";
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getUserRole = () => {
    if (!user) return null;
    if (user.role === "SUPER_ADMIN") return "Super Admin";
    if (user.role === "ADMIN") return "Admin";
    if (user.role === "ORGANIZATION") return "Organization";
    return "User";
  };

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    if (user.role === "SUPER_ADMIN") return "/dashboard/super-admin";
    if (user.role === "ADMIN" || user.role === "ORGANIZATION")
      return "/dashboard";
    return "/dashboard";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-teal-600 dark:text-teal-500">
              Vetable
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-teal-600 ${
              isActive("/")
                ? "text-teal-600 dark:text-teal-500"
                : "text-foreground/60"
            }`}
          >
            Home
          </Link>
          <Link
            href="/diagnosis"
            className={`text-sm font-medium transition-colors hover:text-teal-600 ${
              isActive("/diagnosis")
                ? "text-teal-600 dark:text-teal-500"
                : "text-foreground/60"
            }`}
          >
            Diagnosis
          </Link>
          <Link
            href="/documentation"
            className={`text-sm font-medium transition-colors hover:text-teal-600 ${
              isActive("/documentation")
                ? "text-teal-600 dark:text-teal-500"
                : "text-foreground/60"
            }`}
          >
            Documentation
          </Link>
          <Link
            href="/user-guide"
            className={`text-sm font-medium transition-colors hover:text-teal-600 ${
              isActive("/user-guide")
                ? "text-teal-600 dark:text-teal-500"
                : "text-foreground/60"
            }`}
          >
            User Guide
          </Link>
          <Link
            href="/subscription"
            className={`text-sm font-medium transition-colors hover:text-teal-600 ${
              isActive("/subscription")
                ? "text-teal-600 dark:text-teal-500"
                : "text-foreground/60"
            }`}
          >
            Pricing
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.image || ""}
                      alt={user.full_name || "User"}
                    />
                    <AvatarFallback className="bg-teal-100 text-teal-800">
                      {getInitials(user.full_name || "")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.full_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    {getUserRole() && (
                      <p className="text-xs font-medium text-teal-600">
                        {getUserRole()}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                {(user.role === "ADMIN" ||
                  user.role === "ORGANIZATION" ||
                  user.role === "SUPER_ADMIN") && (
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()}>Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 cursor-pointer"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        <button
          className="flex md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
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
            <Link
              href="/subscription"
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                isActive("/subscription")
                  ? "text-teal-600 dark:text-teal-500"
                  : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            {loading ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
            ) : user ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.image || ""}
                      alt={user.full_name || "User"}
                    />
                    <AvatarFallback className="bg-teal-100 text-teal-800">
                      {getInitials(user.full_name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getUserRole()}
                    </p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                  >
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                      Profile
                    </Link>
                  </Button>
                  {(user.role === "ADMIN" ||
                    user.role === "ORGANIZATION" ||
                    user.role === "SUPER_ADMIN") && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                    >
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                  >
                    <Link
                      href="/profile/settings"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-red-600"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    Log out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
