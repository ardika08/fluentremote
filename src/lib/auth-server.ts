import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export const ADMIN_EMAIL = "ardika.yudha08@gmail.com";

export async function getServerSession() {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    return null;
  }
}

export function isAdminEmail(email: string | null | undefined) {
  return email?.toLowerCase() === ADMIN_EMAIL;
}

export async function isAdminSession() {
  const session = await getServerSession();

  return Boolean(session?.user?.email && isAdminEmail(session.user.email));
}
