import { LifeBuoy, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "support"; text: string };

const RULES: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["add task", "can't add", "cannot add", "adding", "new task", "create task"],
    answer:
      "Let's troubleshoot that. Open My Tasks and press \"Add Task\", then check that you've entered a task name — it's the only required field. If the form still won't submit, refresh the page and try again.",
  },
  {
    keywords: ["delete", "remove", "trash"],
    answer:
      "To delete a task, hover (or tap) the task row and select the trash icon on the right. Deleting is permanent and removes the task from this browser's saved data.",
  },
  {
    keywords: ["edit", "change task", "rename", "update task"],
    answer:
      "Select the pencil icon on a task row. You can change the name, priority and deadline, then press Save changes.",
  },
  {
    keywords: ["dark", "light", "theme", "mode", "colour", "color"],
    answer:
      "Use the sun/moon button in the top bar, or go to Settings → Appearance. Your choice is saved in this browser and stays applied as you move between pages.",
  },
  {
    keywords: ["navigate", "navigation", "menu", "sidebar", "page", "find"],
    answer:
      "On desktop, use the left sidebar. On mobile, tap the menu button at the top left. It links to Dashboard, My Tasks, AI Assistant, Productivity Insights and Settings.",
  },
  {
    keywords: ["ai", "assistant", "chatbot", "response", "not responding", "reply"],
    answer:
      "The AI Assistant page answers productivity questions. If a reply fails, the page shows the error — usually a temporary connection issue. Wait a moment and send the message again. AI answers may contain errors, so review them before acting.",
  },
  {
    keywords: ["priority", "high priority", "urgent"],
    answer:
      "Set a priority when creating or editing a task. On My Tasks you can filter by High Priority to see only urgent work.",
  },
  {
    keywords: ["filter", "completed", "pending"],
    answer:
      "On My Tasks, use the filter chips above the list: All, Pending, Completed and High Priority.",
  },
  {
    keywords: ["settings", "account", "notification", "profile"],
    answer:
      "Settings holds appearance, notification, AI and account preferences. Changes there are saved in this browser.",
  },
  {
    keywords: ["data", "lost", "disappear", "saved", "storage"],
    answer:
      "Your tasks and preferences are stored in this browser. Clearing browser data, or using a private window, will reset them to the sample data.",
  },
  {
    keywords: ["insight", "score", "chart", "productivity score"],
    answer:
      "Productivity Insights calculates from your current tasks: completion rate, high-priority completion and a productivity score. Complete a few tasks and the charts update immediately.",
  },
];

const FALLBACK =
  "I couldn't resolve this issue automatically. Please check the Settings or Help section for additional support.";

const QUICK = ["I can't add a task", "How do I switch theme?", "How do filters work?"];

function answerFor(input: string) {
  const q = input.toLowerCase();
  const hit = RULES.find((r) => r.keywords.some((k) => q.includes(k)));
  return hit ? hit.answer : FALLBACK;
}

export function SupportChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "support",
      text: "Hi, I'm Alora Lola Support — an automated assistant for platform problems. Ask me about tasks, navigation, themes or settings.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { role: "user", text: value }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: "support", text: answerFor(value) }]);
      setTyping(false);
    }, 600);
  };

  return (
    <>
      {open ? (
        <div className="fixed inset-x-3 bottom-3 z-40 flex max-h-[75vh] flex-col overflow-hidden rounded-2xl border border-border bg-panel shadow-2xl sm:inset-x-auto sm:right-5 sm:bottom-24 sm:w-[360px]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-cyan to-brand text-xs font-bold text-black">
                S
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">Alora Lola Support</p>
                <p className="text-[10px] text-mint">Automated platform help</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close support chat"
              className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-xs leading-relaxed text-primary-foreground"
                    : "max-w-[90%] rounded-2xl rounded-bl-sm bg-panel-2 px-3 py-2 text-xs leading-relaxed text-foreground"
                }
              >
                {m.text}
              </div>
            ))}
            {typing ? (
              <div className="max-w-[60%] rounded-2xl rounded-bl-sm bg-panel-2 px-3 py-2 text-xs text-muted-foreground">
                <span className="glow-dot">Alora Lola Support is typing…</span>
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your problem…"
                aria-label="Message Alora Lola Support"
                className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90"
              >
                <Send className="size-4" />
              </button>
            </form>
            <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
              Automated responses only — this assistant cannot contact a human agent.
            </p>
          </div>
        </div>
      ) : null}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Alora Lola Support"
        className="fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-br from-brand to-violet px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
      >
        <LifeBuoy className="size-4" />
        <span className="hidden sm:inline">Alora Lola Support</span>
      </button>
    </>
  );
}
