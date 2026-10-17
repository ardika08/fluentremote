import { NextResponse } from "next/server";

import {
  issueMemberLicense,
  reissueMemberLicense,
  resetMemberDevice,
  restoreMemberLicense,
  revokeMemberLicense,
  type AdminActionResult,
} from "@/lib/admin-members";
import { getServerSession, isAdminEmail } from "@/lib/auth-server";

/**
 * Aksi admin untuk menu Member.
 *
 * Guard-nya di server (email ada di ADMIN_EMAILS), bukan hanya menyembunyikan tombol —
 * jadi endpoint ini tetap menolak siapa pun yang bukan admin.
 */
export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  }

  let body: { userId?: string; action?: string };
  try {
    body = (await request.json()) as { userId?: string; action?: string };
  } catch {
    return NextResponse.json({ message: "Body tidak valid." }, { status: 400 });
  }

  const userId = String(body.userId ?? "").trim();
  const action = String(body.action ?? "").trim();

  if (!userId || !action) {
    return NextResponse.json({ message: "userId dan action wajib diisi." }, { status: 400 });
  }

  const adminEmail = session.user.email;
  let result: AdminActionResult;

  switch (action) {
    case "revoke":
      result = await revokeMemberLicense(userId, adminEmail);
      break;
    case "restore":
      result = await restoreMemberLicense(userId, adminEmail);
      break;
    case "issue":
      result = await issueMemberLicense(userId, adminEmail);
      break;
    case "reissue":
      result = await reissueMemberLicense(userId, adminEmail);
      break;
    case "reset-device":
      result = await resetMemberDevice(userId, adminEmail);
      break;
    default:
      return NextResponse.json({ message: "Aksi tidak dikenal." }, { status: 400 });
  }

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
