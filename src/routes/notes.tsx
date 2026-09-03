import { createFileRoute } from "@tanstack/react-router";
import { FileText, Sparkles } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { AiError, AiLoading, AiOutputPanel } from "@/components/AiOutput";
import { AiDisclaimer } from "@/components/TaskUI";
import { callAi } from "@/lib/ai";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Alora Lola" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a concise summary with key decisions, action items and deadlines using Alora Lola.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Alora Lola" },
      {
        property: "og:description",
        content: "Summarise meeting notes into decisions, action items and deadlines.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summarize = async () => {
    const value = notes.trim();
    if (value.length < 30) {
      setError("Please paste your meeting notes first (at least 30 characters).");
      return;
    }
    setError("");
    setLoading(true);
    setOutput("");
    const result = await callAi({
      mode: "notes",
      messages: [{ role: "user", content: `Meeting notes:\n${value}` }],
    });
    setLoading(false);
    if ("error" in result) setError(result.error);
    else setOutput(result.reply);
  };

  return (
    <AppShell title="Meeting Notes Summarizer" subtitle="AI-Powered Workplace Productivity Assistant">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-panel p-5">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet text-white">
              <FileText className="size-4" />
            </span>
            <div className="leading-tight">
              <h2 className="font-display text-base font-bold">Paste your meeting notes</h2>
              <p className="text-[11px] text-muted-foreground">
                Only the information in your notes is used — nothing is invented.
              </p>
            </div>
          </div>

          <label htmlFor="meeting-notes" className="text-xs font-medium text-muted-foreground">
            Meeting notes
          </label>
          <textarea
            id="meeting-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={16}
            placeholder="Paste the raw notes from your meeting here — discussion points, decisions, who agreed to do what, and any dates mentioned."
            className="mt-2 w-full resize-y rounded-xl border border-border bg-panel-2 p-3.5 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          />

          <button
            onClick={summarize}
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-violet px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            <Sparkles className="size-4" />
            {loading ? "Summarising…" : "Summarize notes"}
          </button>
          <AiDisclaimer className="mt-4" />
        </section>

        <section className="space-y-4">
          {loading ? <AiLoading label="Alora Lola is summarising your notes…" /> : null}
          {error ? <AiError message={error} /> : null}
          {!loading && !error && !output ? (
            <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center">
              <FileText className="mx-auto size-6 text-muted-foreground" />
              <h3 className="mt-3 font-display text-base font-bold">No summary yet</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                Paste your meeting notes and select Summarize notes to get key decisions, action
                items and deadlines.
              </p>
            </div>
          ) : null}
          {output ? (
            <AiOutputPanel title="Meeting summary" value={output} onChange={setOutput} rows={18} />
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}
