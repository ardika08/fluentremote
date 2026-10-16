import { redirect } from "next/navigation";

/** Pengaturan tidak lagi berdiri sendiri — semua ada di dalam dashboard. */
export default function SettingsPage() {
  redirect("/dashboard/terjemahan");
}
