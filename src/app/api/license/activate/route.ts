import { NextResponse } from "next/server";

import { getLocale } from "@/lib/i18n-server";
import { activateLicense } from "@/lib/license";

export async function POST(request: Request) {
  const body = (await request.json()) as { activationCode?: string };
  const locale = await getLocale();
  const result = await activateLicense(body.activationCode ?? "", locale);

  return NextResponse.json(result, {
    status: result.success ? 200 : result.status === "revoked" ? 403 : 400,
  });
}
