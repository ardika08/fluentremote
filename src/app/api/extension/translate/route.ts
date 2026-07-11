import { NextResponse } from "next/server";
import { z } from "zod";

import { getExtensionCorsHeaders, translateForExtension } from "@/lib/extension-api";
import { getRateLimiter, getRateLimitIdentifier } from "@/lib/rate-limit";

const translateSchema = z.object({
  licenseKey: z.string().trim().min(1).max(128),
  text: z.string().trim().min(1).max(5000),
  sourceLanguage: z.string().trim().min(1).max(64).optional(),
  targetLanguage: z.string().trim().min(1).max(64).optional(),
  aiProvider: z.enum(["openai", "maia_router"]).optional(),
  mode: z.enum(["read", "write"]).default("read"),
});

// 60 requests per minute per license key (extension users translate more frequently)
const limiter = getRateLimiter("extension-translate", { limit: 60, windowMs: 60_000 });

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getExtensionCorsHeaders(),
  });
}

export async function POST(request: Request) {
  // Rate limiting — keyed by IP for extension routes (no session)
  const identifier = getRateLimitIdentifier(request);
  const rateLimit = limiter.check(identifier);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please wait a moment and try again." },
      {
        status: 429,
        headers: {
          ...getExtensionCorsHeaders(),
          "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": "60",
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body." },
      { status: 400, headers: getExtensionCorsHeaders() },
    );
  }

  const parsed = translateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid extension translate payload." },
      { status: 400, headers: getExtensionCorsHeaders() },
    );
  }

  try {
    const result = await translateForExtension(parsed.data);
    return NextResponse.json(result, { headers: getExtensionCorsHeaders() });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message === "LICENSE_INVALID"
          ? "That license key is not valid."
          : error.message === "LICENSE_REVOKED"
            ? "This license key has been revoked."
            : error.message === "PURCHASE_REQUIRED"
              ? "This account is not ready for extension use yet."
              : error.message === "OPENAI_KEY_REQUIRED"
                ? "Save your OpenAI API key in Settings before using this provider."
                : error.message === "MAIA_ROUTER_KEY_REQUIRED"
                  ? "Save your MAIA Router API key in Settings before using this provider."
                  : error.message
        : "Unable to translate from the extension right now.";

    return NextResponse.json(
      { message },
      { status: 400, headers: getExtensionCorsHeaders() },
    );
  }
}
