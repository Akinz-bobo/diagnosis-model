import type React from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  breadcrumb?: {
    title: string;
    href: string;
  }[];
}

export function DashboardHeader({
  heading,
  text,
  children,
  breadcrumb,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {breadcrumb && <Breadcrumb segments={breadcrumb} />}
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-heading font-bold tracking-tight md:text-3xl">
            {heading}
          </h1>
          {text && <p className="text-muted-foreground">{text}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
