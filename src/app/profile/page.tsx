import { redirect } from "next/navigation";

/** Profil pindah ke dashboard. */
export default function ProfilePage() {
  redirect("/dashboard/akun");
}
