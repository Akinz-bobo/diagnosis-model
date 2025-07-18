import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/diagnosis",
];

// Define admin-only routes
const ADMIN_ROUTES = [
  "/dashboard/users",
  "/dashboard/organizations",
  "/dashboard/subscriptions",
];

// Define routes that should redirect logged-in users
const AUTH_ROUTES = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password"
];

// This function runs before withAuth middleware
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Get the token from cookies (if it exists)
  const token = 
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value;
  
  // Check if the current route is an authentication route
  const isAuthRoute = AUTH_ROUTES.some(route => 
    pathname.startsWith(route) || pathname === route
  );
  
  // Redirect authenticated users away from auth pages
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/diagnosis", req.url));
  }

  // Protect specific routes
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    // If no token, redirect to sign-in page
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }
    // If accessing admin routes, check for admin role
  
  // For all other routes, let NextAuth withAuth handle the authentication
  return NextResponse.next();

}

// Use withAuth for protected routes
export default withAuth(
  // Define a function for more granular control
  function authMiddleware(req) {
    // This will pass through since we've already done our custom redirects
    return NextResponse.next();
  },
  {
    callbacks: {
      // This callback runs when NextAuth is determining if the user is authorized
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // For admin routes, check if user has admin role
        if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
          return token?.role === "admin" || token?.role === "super_admin";
        }
        
        // For org admin routes
        if (pathname.startsWith("/dashboard/organization")) {
          return token?.role === "org_admin" || 
                 token?.role === "admin" || 
                 token?.role === "super_admin";
        }
        
        // For general protected routes, just check if token exists
        return !!token;
      },
    },
    pages: {
      signIn: '/signin',
      error: '/signin',
    },
  }
);

export const config = {
  // Apply this middleware to protected and auth routes
  matcher: [
    /*
     * Match all protected routes:
     * - Dashboard routes
     * - Profile routes
     * - Diagnosis routes
     * - API routes that should be protected
     * 
     * And all auth routes:
     * - Sign in
     * - Sign up
     * - Password reset
     */
    '/dashboard/:path*',
    '/profile/:path*',
    '/diagnosis/:path*',
    '/subscription/:path*',
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password/:path*'
  ],
};
