import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIVATE_MATCHERS = [
  "/settings",
  "/profile",
  "/checkout",
  "/install-extension",
  "/dev/backend",
];

function hasOptimisticAuthCookie(request: NextRequest) {
  return request.cookies.getAll().some(({ name }) => {
    const lower = name.toLowerCase();
    return lower.includes("better-auth") || lower.includes("session");
  });
}

function isPrivatePath(pathname: string) {
  return PRIVATE_MATCHERS.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAuthed = hasOptimisticAuthCookie(request);

  if (isPrivatePath(pathname) && !isAuthed) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirectTo", `${pathname}${search}`);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/settings/:path*",
    "/profile/:path*",
    "/checkout/:path*",
    "/install-extension/:path*",
    "/dev/backend/:path*",
  ],
};
