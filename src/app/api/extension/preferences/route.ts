import { NextResponse } from "next/server";
import { z } from "zod";

import {
  getExtensionConfig,
  getExtensionCorsHeaders,
  updateExtensionPreferences,
} from "@/lib/extension-api";

const preferencesSchema = z.object({
  licenseKey: z.string().trim().min(1).max(128),
  sourceLanguage: z.string().trim().min(1).max(64),
  targetLanguage: z.string().trim().min(1).max(64),
});

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getExtensionCorsHeaders(),
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const licenseKey = searchParams.get("licenseKey")?.trim();

  if (!licenseKey) {
    return NextResponse.json(
      { message: "License key is required." },
      { status: 400, headers: getExtensionCorsHeaders() },
    );
  }

  try {
    const result = await getExtensionConfig(licenseKey);
    return NextResponse.json(result, { headers: getExtensionCorsHeaders() });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message === "LICENSE_INVALID"
              ? "That license key is not valid."
              : error.message === "LICENSE_REVOKED"
                ? "This license key has been revoked."
                : error.message === "PURCHASE_REQUIRED"
                  ? "This account is not ready for extension use yet."
                  : error.message
            : "Unable to load extension preferences right now.",
      },
      { status: 400, headers: getExtensionCorsHeaders() },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = preferencesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid extension preferences payload." },
        { status: 400, headers: getExtensionCorsHeaders() },
      );
    }

    const result = await updateExtensionPreferences(parsed.data);
    return NextResponse.json(result, { headers: getExtensionCorsHeaders() });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message === "LICENSE_INVALID"
              ? "That license key is not valid."
              : error.message === "LICENSE_REVOKED"
                ? "This license key has been revoked."
                : error.message === "PURCHASE_REQUIRED"
                  ? "This account is not ready for extension use yet."
                  : error.message
            : "Unable to update extension preferences right now.",
      },
      { status: 400, headers: getExtensionCorsHeaders() },
    );
  }
}
