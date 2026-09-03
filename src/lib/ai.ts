export type AiMode = "assistant" | "planner" | "email" | "notes";

export type AiMessage = { role: "user" | "assistant"; content: string };

export type AiResult = { reply: string } | { error: string };

/** Calls the Alora Lola AI endpoint. All prompt engineering happens server-side. */
export async function callAi(payload: {
  mode: AiMode;
  messages: AiMessage[];
  context?: string;
  tone?: string;
}): Promise<AiResult> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { reply?: string; error?: string };
    if (!res.ok || !data.reply) {
      return { error: data.error ?? "The AI could not generate a response. Please try again." };
    }
    return { reply: data.reply };
  } catch {
    return { error: "Network problem — Alora Lola could not reach the AI. Please try again." };
  }
}
