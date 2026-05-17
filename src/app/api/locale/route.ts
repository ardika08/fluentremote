import { NextResponse } from "next/server";

import { defaultLocale, localeCookieName } from "@/lib/i18n";
import type { Locale } from "@/types/domain";

const ONE_YEAR = 60 * 60 * 24 * 365;

function buildCookieResponse(response: NextResponse, locale: Locale) {
  response.cookies.set(localeCookieName, locale, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
    httpOnly: false,
    secure: false,
  });
  return response;
}

export async function POST(request: Request) {
  const body = (await request.json()) as { locale?: string };
  const locale: Locale = body.locale === "en" ? "en" : defaultLocale;

  return buildCookieResponse(NextResponse.json({ locale }), locale);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const locale: Locale = searchParams.get("locale") === "en" ? "en" : defaultLocale;
  const redirect = searchParams.get("redirect") || "/";
  const redirectUrl = new URL(redirect, origin);

  return buildCookieResponse(NextResponse.redirect(redirectUrl), locale);
}
