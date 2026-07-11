import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth-server";
import { getLicenseSnapshot } from "@/lib/license";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Sign in to view license status." }, { status: 401 });
  }

  const snapshot = await getLicenseSnapshot();
  return NextResponse.json(snapshot);
}
