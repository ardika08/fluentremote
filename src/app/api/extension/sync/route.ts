import { NextResponse } from "next/server";
import { z } from "zod";

import { getExtensionConfig, getExtensionCorsHeaders } from "@/lib/extension-api";

const syncSchema = z.object({
  licenseKey: z.string().trim().min(1).max(128),
});

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getExtensionCorsHeaders(),
  });
}

export async function POST(request: Request) {
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
