import { NextRequest, NextResponse } from "next/server";

const TOKEN_KEY = "mathical_access_token";

// Routes that require authentication
const PROTECTED_PATHS = ["/solve"];

// Routes an already-authenticated user shouldn't see (optional, e.g. login/register)
const AUTH_PATHS = ["/login", "/register"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(TOKEN_KEY)?.value;

  if (isProtectedPath(pathname) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath(pathname) && token) {
    return NextResponse.redirect(new URL("/solve", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/solve/:path*", "/login", "/register"],
};