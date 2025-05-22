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

  if (token) {
    const decoded = decodeJwt(token);
    const isExpired = !decoded || decoded.exp * 1000 < Date.now();

    if (isExpired) {
      // Remove the expired token cookie and redirect to /signin
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("expired", "1");
      const res = NextResponse.redirect(signInUrl);
      res.cookies.set("token", "", { maxAge: 0, path: "/" }); // Remove cookie
      return res;
    }

    // Authenticated users shouldn't visit /signin or /signup
    if (
      req.nextUrl.pathname.startsWith("/signin") ||
      req.nextUrl.pathname.startsWith("/signup")
    ) {
      return NextResponse.redirect(new URL("/diagnosis", req.url));
    }
  } else {
    // Not logged in - prevent access to protected routes
    if (
      req.nextUrl.pathname.startsWith("/diagnosis") ||
      req.nextUrl.pathname.startsWith("/admin")
    ) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/signup", "/diagnosis", "/admin/:path*"],
};
