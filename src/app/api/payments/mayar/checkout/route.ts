import { NextResponse } from "next/server";

import { createMayarCheckout } from "@/lib/mayar";

export async function POST() {
  try {
    const result = await createMayarCheckout();
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "AUTH_REQUIRED") {
        return NextResponse.json({ message: "Sign in first." }, { status: 401 });
      }

      if (error.message === "DATABASE_REQUIRED") {
        return NextResponse.json(
          { message: "Database belum dikonfigurasi." },
          { status: 500 },
        );
      }

      if (error.message === "MAYAR_API_KEY_MISSING") {
        return NextResponse.json(
          { message: "MAYAR_API_KEY belum dikonfigurasi di environment." },
          { status: 500 },
        );
      }

      if (error.message === "MAYAR_INVOICE_FAILED") {
        return NextResponse.json(
          { message: "Gagal membuat invoice Mayar. Coba lagi." },
          { status: 502 },
        );
      }

      if (error.message === "MAYAR_INVOICE_NO_LINK") {
        return NextResponse.json(
          { message: "Invoice dibuat tapi URL checkout tidak tersedia." },
          { status: 502 },
        );
      }

      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Tidak bisa membuat checkout Mayar saat ini." },
      { status: 500 },
    );
  }
}
