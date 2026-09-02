import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: "user" | "assistant"; content: string };

type Body = { messages?: ChatMessage[]; context?: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, context } = (await request.json()) as Body;
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

        const system = [
          "You are the TaskFlow AI productivity assistant inside a workplace productivity app.",
          "You are an AI, never a human. Be concise, practical and professional.",
          "Help with prioritisation, planning, scheduling, summarising tasks and professional writing.",
          "Use short paragraphs and bullet lists. Never invent data you were not given.",
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
