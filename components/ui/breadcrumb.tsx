import * as React from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  segments: {
    title: string;
    href: string;
  }[];
  separator?: React.ReactNode;
  home?: boolean;
}

export function Breadcrumb({
  segments,
  separator,
  home = true,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn(
        "flex items-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <ol className="flex items-center gap-1.5">
        {home && (
          <li className="flex items-center gap-1.5">
            <Link href="/" className="flex items-center hover:text-foreground">
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only">Home</span>
            </Link>
            {separator ? separator : <ChevronRight className="h-3.5 w-3.5" />}
          </li>
        )}
        {segments.map((segment, index) => (
          <li key={segment.href} className="flex items-center gap-1.5">
            <Link href={segment.href} className="hover:text-foreground">
              {segment.title}
            </Link>
            \
            {index < segments.length - 1 &&
              (separator ? (
                separator
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              ))}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface BreadcrumbItemProps
  extends React.ComponentPropsWithoutRef<"li"> {
  isCurrentPage?: boolean;
}

export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  BreadcrumbItemProps
>(({ className, isCurrentPage, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "inline-flex items-center",
      isCurrentPage ? "text-foreground" : "",
      className
    )}
    aria-current={isCurrentPage ? "page" : undefined}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

export interface BreadcrumbLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link> {
  isCurrentPage?: boolean;
}

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  BreadcrumbLinkProps
>(({ className, isCurrentPage, ...props }, ref) => {
  if (isCurrentPage) {
    return (
      <span
        className={cn("text-foreground font-medium", className)}
        aria-current="page"
      >
        {props.children}
      </span>
    );
  }

  return (
    <Link
      ref={ref}
      className={cn("text-muted-foreground hover:text-foreground", className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";
