import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { NextMiddleware } from "next/server";

export const middleware: NextMiddleware = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;

  const token =
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value;

  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isProtectedPage =
    pathname.startsWith("/diagnosis") || pathname.startsWith("/admin");

  // Unauthenticated user on protected page
  if (!token && isProtectedPage) {
    const loginUrl = new URL("/signin", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to access auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/diagnosis", req.url));
  }

  return NextResponse.next();
};

// For role-based access, use `withAuth` with custom callbacks
export default withAuth(middleware, {
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;

      // If accessing admin routes, ensure user is ADMIN
      if (pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }

      // All other authenticated routes
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/signin", "/signup", "/diagnosis", "/admin/:path*"],
};
