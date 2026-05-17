import { cookies } from "next/headers";

import { defaultLocale, localeCookieName } from "@/lib/i18n";
import type { Locale } from "@/types/domain";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(localeCookieName)?.value;
  return value === "en" ? "en" : defaultLocale;
}
