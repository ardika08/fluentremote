import Link from "next/link";
import { ShieldCheck, WalletCards } from "lucide-react";
import { redirect } from "next/navigation";

import { MayarCheckoutButton } from "@/components/mayar-checkout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-server";
import { getLocale } from "@/lib/i18n-server";
import { getLicenseSnapshot } from "@/lib/license";
import { getCurrentUserLatestPurchase, getMayarPricing } from "@/lib/mayar";

export default async function CheckoutPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const locale = await getLocale();
  const latestPurchase = await getCurrentUserLatestPurchase();
  const snapshot = await getLicenseSnapshot();
  const isId = locale === "id";
  const pricing = getMayarPricing(locale);

  const copy = {
    eyebrow: "Pembelian",
    title: isId
      ? "Selesaikan pembelian FluentRemote untuk membuka lisensi dan panduan pemasangan ekstensi."
      : "Complete your FluentRemote purchase to unlock your license and extension setup.",
    description: isId
      ? "Pembayaran diproses lewat Mayar. Setelah terkonfirmasi, sistem menerbitkan lisensi unik untuk akun Anda dan membuka seluruh fitur di Pengaturan."
      : "This checkout uses Mayar directly. Once the payment is confirmed, the system will issue a unique license to your account and unlock the full Settings workspace.",
    priceLabel: isId ? "Sekali bayar" : "One-time payment",
    includedTitle: isId ? "Yang terbuka setelah pembayaran" : "What unlocks after purchase",
    includedItems: isId
      ? [
          "Kode lisensi unik untuk aktivasi ekstensi.",
          "Penyimpanan API key OpenAI dan MAIA Router milik Anda.",
          "Uji terjemahan langsung dari web ke backend.",
        ]
      : [
          "A unique license key you can copy for extension activation.",
          "User-owned OpenAI and MAIA Router API key storage.",
          "A live translation test from frontend to backend.",
        ],
    liveTitle: isId ? "Checkout Mayar" : "Mayar checkout",
    // Invoice API: name & email diambil dari akun — tidak perlu input nomor HP
    liveDescription: isId
      ? "Klik tombol di bawah untuk membuat invoice Mayar. Detail akun Anda (nama & email) akan dipakai otomatis, lalu Anda diarahkan ke halaman pembayaran Mayar."
      : "Click the button below to generate a Mayar invoice. Your account details (name & email) are used automatically, then you will be redirected to Mayar's payment page.",
    liveAction: isId ? "Lanjut ke pembayaran Mayar" : "Continue to Mayar payment",
    liveProcessing: isId ? "Membuat invoice Mayar..." : "Creating Mayar invoice...",
    alreadyOwned: isId
      ? "Akun ini sudah memiliki akses FluentRemote. Anda dapat langsung membuka Pengaturan."
      : "This account already has FluentRemote access. You can go straight to Settings.",
    openSettings: isId ? "Buka Pengaturan" : "Open Settings",
    latestOrder: isId ? "Checkout terakhir" : "Latest checkout",
    latestPending: isId ? "Menunggu pembayaran" : "Awaiting payment",
    latestPaid: isId ? "Sudah dibayar" : "Paid",
    paymentPipelineEyebrow: isId ? "Gateway asli" : "Live gateway",
    paymentPipelineTitle: isId
      ? "Mayar menangani pembayaran, notifikasi, dan pengalihan halaman."
      : "Mayar handles payment, webhook, and redirect.",
    paymentPipelineDescription: isId
      ? "Invoice dibuat saat itu juga lewat API Mayar. Begitu status pembayaran diterima, lisensi unik langsung ditautkan ke akun Anda."
      : "The invoice is created in real time via the Mayar Invoice API. Once a paid status is received, a unique license is linked to the same signed-in account immediately.",
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-12 lg:px-10">
      <div className="max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
          {copy.eyebrow}
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-foreground)]">
          {copy.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-muted-foreground)]">
          {copy.description}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(30,20,54,0.98),rgba(21,19,29,0.96))] text-white">
          <CardContent className="p-8">
            <Badge variant="primary">{copy.priceLabel}</Badge>
            <div className="mt-7 text-5xl font-semibold sm:text-6xl">{pricing.formatted}</div>
            <div className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-300">
              Akses permanen · Tanpa langganan bulanan
            </div>

            <div className="mt-8">
              {snapshot.hasPurchased ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-4 text-sm leading-7 text-emerald-50">
                    {copy.alreadyOwned}
                  </div>
                  <Button asChild variant="secondary">
                    <Link href="/dashboard">{copy.openSettings}</Link>
                  </Button>
                </div>
              ) : (
                <MayarCheckoutButton
                  title={copy.liveTitle}
                  description={copy.liveDescription}
                  actionLabel={copy.liveAction}
                  processingLabel={copy.liveProcessing}
                />
              )}

              {!snapshot.hasPurchased && latestPurchase ? (
                <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-sm text-slate-200">
                  <div className="font-semibold">{copy.latestOrder}</div>
                  <div className="mt-1">
                    {latestPurchase.status === "paid"
                      ? copy.latestPaid
                      : copy.latestPending}
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="bg-[var(--color-card)]">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                <ShieldCheck className="h-4 w-4" />
                {copy.includedTitle}
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {copy.includedItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-sm leading-7 text-[var(--color-muted-foreground)]"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-card)]">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                <WalletCards className="h-4 w-4" />
                {copy.paymentPipelineEyebrow}
              </div>
              <CardTitle>{copy.paymentPipelineTitle}</CardTitle>
              <CardDescription>{copy.paymentPipelineDescription}</CardDescription>
            </CardHeader>
            <CardContent className="rounded-2xl bg-[var(--color-surface)] px-4 py-4 text-sm leading-7 text-[var(--color-muted-foreground)]">
              {isId
                ? "Selama pembayaran belum selesai, halaman ini membaca status terbaru secara otomatis. Begitu Mayar menandai pembayaran berhasil, lisensi akun Anda langsung aktif."
                : "While an order is pending, the success page and Settings read the latest order status. As soon as Mayar marks the payment as successful, your account license is activated right away."}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
