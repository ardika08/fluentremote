import { NextResponse } from "next/server";

import { savePreferences, getPreferences } from "@/lib/license";
import type { SettingsPreferenceInput } from "@/types/domain";

export async function GET() {
  const preferences = await getPreferences();
  return NextResponse.json(preferences);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<SettingsPreferenceInput>;

  if (!body.sourceLanguage || !body.targetLanguage || !body.aiProvider) {
    return NextResponse.json(
      { message: "sourceLanguage, targetLanguage, and aiProvider are required." },
      { status: 400 },
    );
  }

  try {
    const preferences = await savePreferences({
      sourceLanguage: body.sourceLanguage,
      targetLanguage: body.targetLanguage,
      aiProvider: body.aiProvider,
      openAIApiKey: body.openAIApiKey,
      maiaRouterApiKey: body.maiaRouterApiKey,
      clearOpenAIApiKey: body.clearOpenAIApiKey,
      clearMaiaRouterApiKey: body.clearMaiaRouterApiKey,
    });

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
