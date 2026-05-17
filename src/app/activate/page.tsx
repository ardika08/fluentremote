import { redirect } from "next/navigation";

import { getLicenseSnapshot } from "@/lib/license";

export default async function ActivatePage() {
  const snapshot = await getLicenseSnapshot();

  redirect(snapshot.hasPurchased ? "/settings" : "/checkout");
}
