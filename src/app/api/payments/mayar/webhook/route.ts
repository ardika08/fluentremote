import { NextResponse } from "next/server";

import {
  completePurchaseFromMayarWebhook,
  verifyMayarWebhookRequest,
} from "@/lib/mayar";

export async function POST(request: Request) {
  const isAuthorized = await verifyMayarWebhookRequest(request);

  if (!isAuthorized) {
    return NextResponse.json({ message: "Unauthorized webhook." }, { status: 401 });
  }

  try {
    const payload = await request.json();
    await completePurchaseFromMayarWebhook(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "ORDER_NOT_FOUND") {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Unable to process Mayar webhook." },
      { status: 500 },
    );
  }
}
