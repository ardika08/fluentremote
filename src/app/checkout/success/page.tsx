import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";

import { CheckoutSuccessStatus } from "@/components/checkout-success-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-server";
import { getLocale } from "@/lib/i18n-server";
import { getLicenseSnapshot } from "@/lib/license";
import { getCurrentUserLatestPurchase } from "@/lib/mayar";

export default async function CheckoutSuccessPage() {
  const locale = await getLocale();
  const session = await getServerSession();
  const latestPurchase = session?.user ? await getCurrentUserLatestPurchase() : null;
  const snapshot = session?.user ? await getLicenseSnapshot() : null;
  const isId = locale === "id";

  const copy = {
    title: isId ? "Pembayaran Mayar sedang diproses." : "Your Mayar payment is being processed.",
    description: isId
      ? "Jika webhook sudah masuk, license unik Anda akan langsung muncul di Settings. Bila belum, tunggu beberapa detik lalu refresh."
      : "Once the webhook arrives, your unique license will appear in Settings automatically. If it has not arrived yet, wait a few seconds and refresh.",
    paid: isId ? "Pembayaran berhasil diterima." : "Payment has been received.",
    pending: isId ? "Menunggu konfirmasi webhook Mayar." : "Waiting for Mayar webhook confirmation.",
    expired: isId
      ? "Checkout Mayar sudah kedaluwarsa. Silakan buat pembayaran baru."
      : "The Mayar checkout has expired. Please create a new payment.",
    failed: isId
      ? "Pembayaran tidak berhasil. Silakan ulangi checkout."
      : "The payment did not complete successfully. Please retry checkout.",
    polling: isId ? "Memantau status webhook" : "Watching webhook status",
    refresh: isId ? "Cek ulang sekarang" : "Check again now",
    continuePayment: isId ? "Lanjutkan pembayaran" : "Continue payment",
    redirecting: isId ? "Mengalihkan ke Settings" : "Redirecting to Settings",
    openSettings: isId ? "Buka Settings" : "Open Settings",
    backCheckout: isId ? "Kembali ke checkout" : "Back to checkout",
    orderLabel: isId ? "ID order" : "Order ID",
    mobileLabel: isId ? "Nomor invoice" : "Invoice mobile",
    steps: {
      checkout: isId ? "Checkout dibuat" : "Checkout created",
      payment: isId ? "Pembayaran diterima" : "Payment received",
      license: isId ? "License diterbitkan" : "License issued",
      settings: isId ? "Workspace siap" : "Workspace ready",
    },
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12 lg:px-10">
      <Card className="bg-[var(--color-card)]">
        <CardHeader className="gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            {snapshot?.hasPurchased ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Clock3 className="h-4 w-4" />
            )}
            Mayar
          </div>
          <CardTitle>{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <CheckoutSuccessStatus
            initialHasPurchased={Boolean(snapshot?.hasPurchased)}
            initialPurchase={
              latestPurchase
                ? {
                    id: latestPurchase.id,
                    status: latestPurchase.status,
                    checkoutUrl: latestPurchase.checkoutUrl,
                    customerMobile: latestPurchase.customerMobile,
                  }
                : null
            }
            dictionary={copy}
          />
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard">{copy.openSettings}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/checkout">{copy.backCheckout}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
