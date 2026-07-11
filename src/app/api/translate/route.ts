import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerSession } from "@/lib/auth-server";
import {
  getLicenseSnapshot,
  getPreferences,
  getProviderApiKeyForCurrentUser,
} from "@/lib/license";
import { getRateLimiter, getRateLimitIdentifier } from "@/lib/rate-limit";
import { translateText } from "@/lib/translate";

const translateSchema = z.object({
  text: z.string().trim().min(1).max(5000),
  sourceLanguage: z.string().trim().min(1).max(64),
  targetLanguage: z.string().trim().min(1).max(64),
  aiProvider: z.enum(["openai", "maia_router"]).optional(),
  mode: z.enum(["read", "write"]).default("read"),
});

// 30 requests per minute per IP/user
const limiter = getRateLimiter("translate", { limit: 30, windowMs: 60_000 });

export async function POST(request: Request) {
  // Auth guard
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Sign in to use translation." }, { status: 401 });
  }

  // Rate limiting — keyed by user ID for authenticated users
  const identifier = session.user.id ?? getRateLimitIdentifier(request);
  const rateLimit = limiter.check(identifier);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please wait a moment and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": "30",
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  // Input validation
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = translateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid translate payload.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // License check
  const licenseSnapshot = await getLicenseSnapshot();
  if (!licenseSnapshot.hasPurchased || licenseSnapshot.status !== "active") {
    return NextResponse.json(
      { message: "Complete your purchase before using live translation." },
      { status: 403 },
    );
  }

  const preferences = await getPreferences();
  const provider = parsed.data.aiProvider ?? preferences.aiProvider;

  try {
    const apiKey = await getProviderApiKeyForCurrentUser(provider);
    const result = await translateText({
      text: parsed.data.text,
      sourceLanguage: parsed.data.sourceLanguage,
      targetLanguage: parsed.data.targetLanguage,
      mode: parsed.data.mode,
      provider,
      apiKey,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "OPENAI_KEY_REQUIRED") {
        return NextResponse.json(
          { message: "Save your OpenAI API key in Settings before using this provider." },
          { status: 400 },
        );
      }

      if (error.message === "MAIA_ROUTER_KEY_REQUIRED") {
        return NextResponse.json(
          { message: "Save your MAIA Router API key in Settings before using this provider." },
          { status: 400 },
        );
      }

      if (error.message === "PURCHASE_REQUIRED") {
        return NextResponse.json(
          { message: "Complete your purchase before using live translation." },
          { status: 403 },
        );
      }

      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Something went wrong while calling the translate backend." },
      { status: 500 },
    );
  }
}
