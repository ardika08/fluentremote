import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerSession } from "@/lib/auth-server";
import { savePreferences, getPreferences } from "@/lib/license";
import type { SettingsPreferenceInput } from "@/types/domain";

const preferencesSchema = z.object({
  sourceLanguage: z.string().trim().min(1).max(64),
  targetLanguage: z.string().trim().min(1).max(64),
  aiProvider: z.enum(["openai", "maia_router"]),
  openAIApiKey: z.string().max(256).optional(),
  maiaRouterApiKey: z.string().max(256).optional(),
  clearOpenAIApiKey: z.boolean().optional(),
  clearMaiaRouterApiKey: z.boolean().optional(),
});

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Sign in to view preferences." }, { status: 401 });
  }

  const preferences = await getPreferences();
  return NextResponse.json(preferences);
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Sign in to save preferences." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = preferencesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid preferences payload.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const preferences = await savePreferences(parsed.data as SettingsPreferenceInput);
    return NextResponse.json(preferences);
  } catch (error) {
    if (error instanceof Error && error.message === "PURCHASE_REQUIRED") {
      return NextResponse.json(
        { message: "Complete your purchase before saving provider API keys." },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { message: "Unable to save preferences right now." },
      { status: 500 },
    );
  }
}
