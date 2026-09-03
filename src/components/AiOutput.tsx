import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { AiDisclaimer } from "@/components/TaskUI";
import { cn } from "@/lib/utils";

export function AiLoading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-panel px-4 py-4 text-sm text-muted-foreground">
      <span className="flex gap-1">
        <span className="size-1.5 animate-bounce rounded-full bg-cyan [animation-delay:-0.2s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-cyan [animation-delay:-0.1s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-cyan" />
      </span>
      {label}
    </div>
  );
}

export function AiError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-foreground"
    >
      {message}
    </div>
  );
}

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      {copied ? <Check className="size-3.5 text-mint" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/** Editable AI result panel with copy-to-clipboard and the Responsible AI notice. */
export function AiOutputPanel({
  title,
  value,
  onChange,
  rows = 16,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="leading-tight">
          <h3 className="font-display text-base font-bold">{title}</h3>
          <p className="text-[11px] text-muted-foreground">AI-generated · editable</p>
        </div>
        <CopyButton value={value} />
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        aria-label={title}
        className="w-full resize-y rounded-xl border border-border bg-panel-2 p-4 text-sm leading-relaxed text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      />
      <AiDisclaimer className="mt-3" />
    </div>
  );
}
