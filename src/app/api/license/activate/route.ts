import { NextResponse } from "next/server";
import { z } from "zod";

import { getLocale } from "@/lib/i18n-server";
import { activateLicense } from "@/lib/license";

const activateSchema = z.object({
  activationCode: z
    .string()
    .trim()
    .min(1, "Activation code is required.")
    .max(64, "Activation code is too long."),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = activateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.errors[0]?.message ?? "Invalid activation code." },
      { status: 400 },
    );
  }

  const locale = await getLocale();
  const result = await activateLicense(parsed.data.activationCode, locale);

  return NextResponse.json(result, {
    status: result.success ? 200 : result.status === "revoked" ? 403 : 400,
  });
}
