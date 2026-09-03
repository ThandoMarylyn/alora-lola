import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: "user" | "assistant"; content: string };

type Mode = "assistant" | "planner" | "email" | "notes";

type Body = { messages?: ChatMessage[]; context?: string; mode?: Mode; tone?: string };

const BASE = [
  "You are Alora Lola, an AI-Powered Workplace Productivity Assistant.",
  "You are an AI, never a human. Be concise, practical and professional.",
  "Never invent facts, deadlines, names or data the user did not provide.",
  "If information is missing, state the assumption or limitation clearly and encourage the user to verify important details.",
].join(" ");

const MODE_PROMPTS: Record<Mode, string> = {
  assistant:
    "Act as a helpful professional workplace AI assistant. Provide practical, clear and professional responses to the user's workplace questions. Use the information provided by the user and do not invent facts. When information is uncertain, clearly state the limitation and encourage the user to verify important information. Use short paragraphs and bullet lists.",
  planner:
    "Act as a professional AI task planner and scheduler. Analyse the user's tasks for urgency and importance, consider the deadlines provided, and recommend the order in which the tasks should be completed. Do not invent deadlines or facts the user did not provide; state assumptions explicitly when information is missing. Reply in plain text using exactly these four section headings, each on its own line: 'AI Task Plan', 'Priority Order', 'Recommended Schedule', 'Why These Tasks Were Prioritised'. Use short numbered or bulleted lines under each heading.",
  email:
    "Act as a professional workplace communication assistant. Based on the user's instructions, generate a clear and professional email. Maintain the user's intended meaning and do not invent facts. Adjust the writing style according to the selected tone: Formal, Friendly or Persuasive. Make the email concise, professional and appropriate for a workplace environment. Return only the email itself, including a subject line, and use [square brackets] for any detail the user did not provide.",
  notes:
    "Act as a professional meeting assistant. Analyse the meeting notes provided by the user and produce a concise summary. Clearly identify the key decisions, action items, responsible tasks and deadlines mentioned in the notes. Do not add information that is not contained in the original notes. If a deadline or responsible person is not provided, do not invent one. Reply in plain text using these section headings, each on its own line: 'Summary', 'Key Decisions', 'Action Items', 'Deadlines'. If a section has nothing in the notes, write 'Not specified in the notes.'",
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, context, mode, tone } = (await request.json()) as Body;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response(JSON.stringify({ error: "Messages are required." }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "AI is not configured for this workspace." }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }

        const activeMode: Mode = mode && MODE_PROMPTS[mode] ? mode : "assistant";

        const system = [
          BASE,
          MODE_PROMPTS[activeMode],
          tone ? `Selected tone: ${tone}.` : "",
          context ? `The user's current tasks and productivity data:\n${context}` : "",
        ]
          .filter(Boolean)
          .join("\n");


        const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "Lovable-API-Key": apiKey,
          },
          body: JSON.stringify({
            model: "openai/gpt-5.6-sol",
            input: [
              { role: "system", content: system },
              ...messages.map((m) => ({ role: m.role, content: m.content })),
            ],
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          let message = "The AI assistant is temporarily unavailable. Please try again.";
          if (res.status === 429) message = "Too many requests right now. Please wait a moment and try again.";
          if (res.status === 402) message = "AI credits have run out for this workspace.";
          if (res.status === 403) message = "AI access is currently blocked for this workspace.";
          console.error("AI gateway error", res.status, text);
          return new Response(JSON.stringify({ error: message }), {
            status: res.status,
            headers: { "content-type": "application/json" },
          });
        }

        const data = (await res.json()) as {
          output_text?: string;
          output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
        };

        const reply =
          data.output_text ??
          data.output
            ?.flatMap((item) => item.content ?? [])
            .filter((c) => c.type === "output_text" || typeof c.text === "string")
            .map((c) => c.text ?? "")
            .join("\n")
            .trim();

        return new Response(
          JSON.stringify({ reply: reply || "I couldn't generate a response. Please try again." }),
          { headers: { "content-type": "application/json" } },
        );
      },
    },
  },
});
