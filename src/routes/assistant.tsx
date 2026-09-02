import { createFileRoute } from "@tanstack/react-router";
import { Bot, RotateCcw, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { AiDisclaimer } from "@/components/TaskUI";
import { formatDue, useTasks } from "@/lib/tasks";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Alora Lola" },
      {
        name: "description",
        content:
          "Ask the Alora Lola AI assistant to prioritise tasks, plan your workday or draft professional messages.",
      },
      { property: "og:title", content: "AI Assistant — Alora Lola" },
      {
        property: "og:description",
        content: "Prioritise tasks, plan your workday and draft messages with AI.",
      },
    ],
  }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Prioritise my tasks for today.",
  "Help me plan my workday.",
  "Summarise my tasks.",
  "How can I improve my productivity?",
  "Create a schedule for my tasks.",
  "Help me write a professional email.",
];

const WELCOME: Msg = {
  role: "assistant",
  content:
    "I'm the Alora Lola AI assistant. I can prioritise your tasks, plan your day, summarise your workload or help you draft professional messages. What would you like to work on?",
};

function AssistantPage() {
  const { tasks, stats } = useTasks();
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || loading) return;
    const next = [...messages, { role: "user" as const, content: value }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);

    const context = [
      `Productivity score: ${stats.score}%. Completion rate: ${stats.completionRate}%.`,
      `Completed: ${stats.completed}, remaining: ${stats.remaining}, overdue: ${stats.overdue.length}.`,
      "Tasks:",
      ...tasks.map(
        (t) =>
          `- ${t.title} | ${t.priority} priority | due ${formatDue(t.due)} | ${t.completed ? "completed" : "pending"}`,
      ),
    ].join("\n");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m !== WELCOME).map((m) => ({ role: m.role, content: m.content })),
          context,
        }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        setError(data.error ?? "The assistant could not respond. Please try again.");
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply as string }]);
      }
    } catch {
      setError("Network problem — the assistant could not be reached. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="AI Assistant" subtitle="AI-Powered Productivity Assistant">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-panel px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet text-white">
              <Bot className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Alora Lola AI Assistant</p>
              <p className="text-[11px] text-muted-foreground">AI-generated responses</p>
            </div>
          </div>
          <button
            onClick={() => {
              setMessages([WELCOME]);
              setError("");
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3.5" /> Clear conversation
          </button>
        </div>

        <div className="flex h-[55vh] min-h-[360px] flex-col gap-4 overflow-y-auto rounded-2xl border border-border bg-panel p-4">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end gap-3" : "flex gap-3"}>
              {m.role === "assistant" ? (
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand to-violet text-white">
                  <Bot className="size-3.5" />
                </span>
              ) : null}
              <div
                className={
                  m.role === "user"
                    ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground"
                    : "max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap text-foreground"
                }
              >
                {m.content}
              </div>
              {m.role === "user" ? (
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-panel-2 text-muted-foreground">
                  <User className="size-3.5" />
                </span>
              ) : null}
            </div>
          ))}
          {loading ? (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-brand to-violet text-white">
                <Bot className="size-3.5" />
              </span>
              <span className="glow-dot">Thinking…</span>
            </div>
          ) : null}
          {error ? (
            <p className="rounded-xl border border-rose/40 bg-rose/10 px-3 py-2 text-xs text-rose">
              {error}
            </p>
          ) : null}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your tasks, planning or workplace writing…"
            aria-label="Message the AI assistant"
            className="min-w-0 flex-1 rounded-xl border border-border bg-panel px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet text-white transition hover:opacity-90 disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => void send(s)}
              disabled={loading}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>

        <AiDisclaimer />
      </div>
    </AppShell>
  );
}
