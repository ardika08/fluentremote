import { NextResponse } from "next/server";
import { z } from "zod";

import { getExtensionConfig, getExtensionCorsHeaders } from "@/lib/extension-api";
import { getRateLimiter, getRateLimitIdentifier } from "@/lib/rate-limit";

const syncSchema = z.object({
  licenseKey: z.string().trim().min(1).max(128),
});

// 20 syncs per minute per IP — sync is heavier than translate (DB lookup)
const limiter = getRateLimiter("extension-sync", { limit: 20, windowMs: 60_000 });

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getExtensionCorsHeaders(),
  });
}

export async function POST(request: Request) {
  // Rate limiting — keyed by IP (no session on extension routes)
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
          "X-RateLimit-Limit": "20",
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  try {
    const body = await request.json();
    const parsed = syncSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid extension sync payload." },
        {
          status: 400,
          headers: getExtensionCorsHeaders(),
        },
      );
    }

    const result = await getExtensionConfig(parsed.data.licenseKey);

    return NextResponse.json(result, {
      headers: getExtensionCorsHeaders(),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message === "LICENSE_REQUIRED"
          ? "Paste your license key to sync the extension."
          : error.message === "LICENSE_INVALID"
            ? "That license key is not valid."
            : error.message === "LICENSE_REVOKED"
              ? "This license key has been revoked."
              : error.message === "PURCHASE_REQUIRED"
                ? "This account has not completed purchase yet."
                : error.message === "LICENSE_UNASSIGNED"
                  ? "This license key is not attached to an account yet."
                  : error.message
        : "Unable to sync extension settings right now.";

    return NextResponse.json(
      { message },
      {
        status: 400,
        headers: getExtensionCorsHeaders(),
      },
    );
  }
}
