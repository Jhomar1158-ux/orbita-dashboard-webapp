import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const hasCompletedOnboarding = request.cookies.get(
    "has_completed_onboarding"
  );

  const isLoggedIn = request.cookies.get("is_logged_in");

  if (path === "/" && !hasCompletedOnboarding) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (path === "/onboarding" && hasCompletedOnboarding) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !isLoggedIn &&
    !path.startsWith("/login") &&
    !path.startsWith("/onboarding")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|_static|.*\\..*).*)"],
};
