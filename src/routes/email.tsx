import { createFileRoute } from "@tanstack/react-router";
import { Mail, Sparkles } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { AiError, AiLoading, AiOutputPanel } from "@/components/AiOutput";
import { AiDisclaimer } from "@/components/TaskUI";
import { callAi } from "@/lib/ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Alora Lola" },
      {
        name: "description",
        content:
          "Generate clear, professional workplace emails in a formal, friendly or persuasive tone with Alora Lola.",
      },
      { property: "og:title", content: "Smart Email Generator — Alora Lola" },
      {
        property: "og:description",
        content: "Draft professional workplace emails with AI in seconds.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;
type Tone = (typeof TONES)[number];

function EmailPage() {
  const [instructions, setInstructions] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    const value = instructions.trim();
    if (value.length < 10) {
      setError("Please describe what the email should say (at least 10 characters).");
      return;
    }
    setError("");
    setLoading(true);
    setOutput("");
    const result = await callAi({
      mode: "email",
      tone,
      messages: [{ role: "user", content: `Tone: ${tone}\n\nInstructions:\n${value}` }],
    });
    setLoading(false);
    if ("error" in result) setError(result.error);
    else setOutput(result.reply);
  };

  return (
    <AppShell title="Smart Email Generator" subtitle="AI-Powered Workplace Productivity Assistant">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-panel p-5">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet text-white">
              <Mail className="size-4" />
            </span>
            <div className="leading-tight">
              <h2 className="font-display text-base font-bold">What should the email say?</h2>
              <p className="text-[11px] text-muted-foreground">
                Alora Lola only uses the details you provide — it will not invent facts.
              </p>
            </div>
          </div>

          <label htmlFor="email-instructions" className="text-xs font-medium text-muted-foreground">
            Your instructions
          </label>
          <textarea
            id="email-instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={9}
            placeholder="e.g. Ask my manager to move Friday's project review to Monday because the client data arrives late."
            className="mt-2 w-full resize-y rounded-xl border border-border bg-panel-2 p-3.5 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          />

          <p className="mt-4 text-xs font-medium text-muted-foreground">Tone</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  tone === t
                    ? "border-primary/50 bg-primary/15 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-violet px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            <Sparkles className="size-4" />
            {loading ? "Generating email…" : "Generate email"}
          </button>
          <AiDisclaimer className="mt-4" />
        </section>

        <section className="space-y-4">
          {loading ? <AiLoading label="Alora Lola is writing your email…" /> : null}
          {error ? <AiError message={error} /> : null}
          {!loading && !error && !output ? (
            <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center">
              <Mail className="mx-auto size-6 text-muted-foreground" />
              <h3 className="mt-3 font-display text-base font-bold">No email generated yet</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                Describe what you need to communicate, choose a tone and select Generate email.
              </p>
            </div>
          ) : null}
          {output ? (
            <AiOutputPanel title="Generated email" value={output} onChange={setOutput} />
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}
