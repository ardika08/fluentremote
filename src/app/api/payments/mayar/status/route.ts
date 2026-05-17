import { NextResponse } from "next/server";

import { getLicenseSnapshot } from "@/lib/license";
import { getCurrentUserLatestPurchase } from "@/lib/mayar";

export async function GET() {
  const latestPurchase = await getCurrentUserLatestPurchase();
  const snapshot = await getLicenseSnapshot();

  return NextResponse.json({
    hasPurchased: snapshot.hasPurchased,
    licenseStatus: snapshot.status,
    latestPurchase: latestPurchase
      ? {
          id: latestPurchase.id,
          status: latestPurchase.status,
          checkoutUrl: latestPurchase.checkoutUrl,
          customerMobile: latestPurchase.customerMobile,
        }
      : null,
  });
}
