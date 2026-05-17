import { NextResponse } from "next/server";

import { getLicenseSnapshot } from "@/lib/license";

export async function GET() {
  const snapshot = await getLicenseSnapshot();

  return NextResponse.json(snapshot);
}
