import type {
  AIProvider,
  TranslationMode,
  TranslationResponse,
} from "@/types/domain";

type TranslateTextParams = {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  provider: AIProvider;
  mode: TranslationMode;
  apiKey: string;
};

function buildInstruction({
  sourceLanguage,
  targetLanguage,
  mode,
}: Omit<TranslateTextParams, "provider" | "text">) {
  if (mode === "write") {
    return `Translate the following chat draft from ${sourceLanguage} to ${targetLanguage}. Keep the meaning intact, make the tone professional and natural for client messaging, and respond with translation only.`;
  }

  return `Translate the following chat message from ${sourceLanguage} to ${targetLanguage}. Preserve tone and intent, and respond with translation only.`;
}

function extractResponseText(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;

  const maybeOutputText =
    "output_text" in payload && typeof payload.output_text === "string"
      ? payload.output_text
      : null;

  if (maybeOutputText) return maybeOutputText.trim();

  if ("output" in payload && Array.isArray(payload.output)) {
    const textParts = payload.output
      .flatMap((item) => {
        if (!item || typeof item !== "object" || !("content" in item)) return [];
        const content = item.content;
        if (!Array.isArray(content)) return [];

        return content
          .map((part) => {
            if (!part || typeof part !== "object") return null;
            if ("text" in part && typeof part.text === "string") return part.text;
            return null;
          })
          .filter(Boolean);
      })
      .join("\n")
      .trim();

    if (textParts) return textParts;
  }

  return null;
}

function extractChatCompletionText(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("choices" in payload)) {
    return null;
  }

  const choices = payload.choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;

  const firstChoice = choices[0];
  if (!firstChoice || typeof firstChoice !== "object" || !("message" in firstChoice)) {
    return null;
  }

  const message = firstChoice.message;
  if (!message || typeof message !== "object" || !("content" in message)) return null;

  return typeof message.content === "string" ? message.content.trim() : null;
}

async function callResponsesCompatibleApi(
  endpoint: string,
  apiKey: string,
  params: Omit<TranslateTextParams, "provider">,
) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TRANSLATION_MODEL ?? "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: buildInstruction(params) }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: params.text }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Translation request failed: ${response.status} ${errorText}`);
  }

  const payload = (await response.json()) as unknown;
  const translatedText = extractResponseText(payload);

  if (!translatedText) {
    throw new Error("Translation provider returned an empty response.");
  }

  return translatedText;
}

async function translateWithOpenAI(
  params: Omit<TranslateTextParams, "provider">,
): Promise<string> {
  return callResponsesCompatibleApi(
    "https://api.openai.com/v1/responses",
    params.apiKey,
    params,
  );
}

async function translateWithMaia(
  params: Omit<TranslateTextParams, "provider">,
): Promise<string> {
  const baseUrl = process.env.MAIA_ROUTER_BASE_URL ?? "https://api.maiarouter.ai/v1";
  const model = process.env.MAIA_ROUTER_MODEL ?? "maia/gemini-2.5-flash";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: buildInstruction(params),
        },
        {
          role: "user",
          content: params.text,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`MAIA translation request failed: ${response.status} ${errorText}`);
  }

  const payload = (await response.json()) as unknown;
  const translatedText = extractChatCompletionText(payload);

  if (!translatedText) {
    throw new Error("MAIA Router returned an empty completion.");
  }

  return translatedText;
}

export async function translateText(
  params: TranslateTextParams,
): Promise<TranslationResponse> {
  const translatedText =
    params.provider === "openai"
      ? await translateWithOpenAI(params)
      : await translateWithMaia(params);

  return {
    provider: params.provider,
    mode: params.mode,
    translatedText,
  };
}
