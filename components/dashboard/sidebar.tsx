"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";
import {
  LayoutDashboard,
  UserIcon,
  Key,
  FileText,
  Settings,
  Building,
  Menu,
  Users,
  BarChart3,
  CreditCard,
  LineChart,
} from "lucide-react";
import { useState } from "react";

interface DashboardSidebarProps {
  user: User;
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["user", "admin"],
    },
    {
      label: "My Analytics",
      icon: LineChart,
      href: "/dashboard/my-analytics",
      roles: ["user"],
    },
    {
      label: "Diagnoses",
      icon: FileText,
      href: "/dashboard/diagnoses",
      roles: ["user", "admin"],
    },
    {
      label: "API Keys",
      icon: Key,
      href: "/dashboard/api-keys",
      roles: ["user", "admin"],
    },
    {
      label: "Documentation",
      icon: FileText,
      href: "/dashboard/documentation",
      roles: ["user", "admin"],
    },
    {
      label: "Organization",
      icon: Building,
      href: "/dashboard/organization",
      roles: ["user", "admin"],
    },
    {
      label: "Subscription",
      icon: CreditCard,
      href: "/dashboard/subscription",
      roles: ["user", "admin"],
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
      roles: ["admin"],
    },
    {
      label: "Users",
      icon: Users,
      href: "/dashboard/users",
      roles: ["admin"],
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      roles: ["user", "admin"],
    },
  ];

  return (
    <>
      <aside className="hidden border-r bg-slate-50 dark:bg-slate-900 md:flex md:w-64 md:flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-teal-600 dark:text-teal-500">
              Vetable
            </span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => {
              if (!route.roles.includes(user.role)) {
                return null;
              }

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-800",
                    pathname === route.href
                      ? "bg-slate-100 text-teal-600 dark:bg-slate-800 dark:text-teal-500"
                      : "text-muted-foreground"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
              <UserIcon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.full_name}</span>
              <span className="text-xs text-muted-foreground capitalize">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex h-16 items-center border-b px-6">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <span className="font-heading text-2xl font-bold text-teal-600 dark:text-teal-500">
                eVet
              </span>
            </Link>
          </div>
          <ScrollArea className="flex-1 py-4">
            <nav className="grid gap-1 px-2">
              {routes.map((route) => {
                if (!route.roles.includes(user.role)) {
                  return null;
                }

                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-800",
                      pathname === route.href
                        ? "bg-slate-100 text-teal-600 dark:bg-slate-800 dark:text-teal-500"
                        : "text-muted-foreground"
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                <UserIcon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.full_name}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
