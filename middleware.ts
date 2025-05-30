import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwt(token: string): { exp: number } | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString());
    return decoded;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const isDiagnosisRoute = req.nextUrl.pathname.startsWith("/diagnosis");

  if (token) {
    const decoded = decodeJwt(token);
    const isExpired = !decoded || decoded.exp * 1000 < Date.now();
    if (isExpired) {
      // Token is expired, redirect to /signin
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("expired", "1");
      return NextResponse.redirect(signInUrl);
    }
    // Authenticated users shouldn't visit /signin or /signup
    if (
      req.nextUrl.pathname.startsWith("/signin") ||
      req.nextUrl.pathname.startsWith("/signup")
    ) {
      return NextResponse.redirect(new URL("/diagnosis", req.url));
    }
    // Allow access to /diagnosis if token is valid and not expired
    return NextResponse.next();
  } else {
    // Not logged in - prevent access to protected routes
    if (isDiagnosisRoute || req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    // Allow access to /signin, /signup, etc. for unauthenticated users
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/signin", "/signup", "/diagnosis", "/admin/:path*"],
};
