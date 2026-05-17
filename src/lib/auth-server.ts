import { headers } from "next/headers";

import { auth } from "@/lib/auth";

function getAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

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
  if (!email) {
    return false;
  }

  return getAdminEmails().has(email.toLowerCase());
}

export async function isAdminSession() {
  const session = await getServerSession();

  return Boolean(session?.user?.email && isAdminEmail(session.user.email));
}
