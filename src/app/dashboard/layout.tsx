import { redirect } from "next/navigation";

import { DashboardShell, type DashboardLabels } from "@/components/dashboard/dashboard-shell";
import { getServerSession } from "@/lib/auth-server";
import { getLocale } from "@/lib/i18n-server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in?redirectTo=/dashboard");
  }

  const locale = await getLocale();
  const isId = locale === "id";

  const labels: DashboardLabels = {
    brand: "FluentRemote",
    overview: isId ? "Ringkasan" : "Overview",
    license: isId ? "Lisensi & Aktivasi" : "License & Activation",
    translation: isId ? "Terjemahan" : "Translation",
    extension: isId ? "Ekstensi" : "Extension",
    account: isId ? "Akun" : "Account",
    backToSite: isId ? "Lihat situs" : "View site",
    signOut: isId ? "Keluar" : "Sign out",
    signingOut: isId ? "Keluar..." : "Signing out...",
    menu: isId ? "Buka menu" : "Open menu",
  };

  return (
    <DashboardShell
      user={{ name: session.user.name ?? "", email: session.user.email ?? "" }}
      labels={labels}
    >
      {children}
    </DashboardShell>
  );
}
