import { NextResponse } from "next/server";

import { createMayarCheckout, ensureMayarConfigReady } from "@/lib/mayar";

export async function POST(request: Request) {
  try {
    await ensureMayarConfigReady();
    const body = (await request.json()) as { mobile?: string };
    const result = await createMayarCheckout({
      mobile: body.mobile ?? "",
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "AUTH_REQUIRED") {
        return NextResponse.json({ message: "Sign in first." }, { status: 401 });
      }

      if (error.message === "MOBILE_REQUIRED") {
        return NextResponse.json(
          { message: "Nomor handphone wajib diisi untuk checkout Mayar." },
          { status: 400 },
        );
      }

      if (error.message === "MAYAR_API_KEY_MISSING") {
        return NextResponse.json(
          { message: "MAYAR_API_KEY belum dikonfigurasi di environment." },
          { status: 500 },
        );
      }

      if (error.message === "MAYAR_WEBHOOK_TOKEN_MISSING") {
        return NextResponse.json(
          { message: "MAYAR_WEBHOOK_TOKEN belum dikonfigurasi di environment." },
          { status: 500 },
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
