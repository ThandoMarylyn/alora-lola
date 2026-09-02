import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { AiDisclaimer } from "@/components/TaskUI";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Alora Lola" },
      {
        name: "description",
        content: "Manage appearance, notification, AI and account preferences in Alora Lola.",
      },
      { property: "og:title", content: "Settings — Alora Lola" },
      {
        property: "og:description",
        content: "Appearance, notification, AI and account preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

const PREF_KEY = "taskflow-prefs";

type Prefs = {
  dailyDigest: boolean;
  deadlineAlerts: boolean;
  weeklyReport: boolean;
  aiSuggestions: boolean;
  aiTone: "concise" | "detailed";
  name: string;
  role: string;
};

const DEFAULT_PREFS: Prefs = {
  dailyDigest: true,
  deadlineAlerts: true,
  weeklyReport: false,
  aiSuggestions: true,
  aiTone: "concise",
  name: "Dana Reddy",
  role: "Product Lead",
};

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border transition-colors",
          checked ? "border-primary bg-primary" : "border-border bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4.5 rounded-full bg-white transition-all",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-panel p-5">
      <h3 className="font-display text-base font-bold">{title}</h3>
      <div className="mt-2 divide-y divide-border">{children}</div>
    </section>
  );
}

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);

  useEffect(() => {
    const raw = window.localStorage.getItem(PREF_KEY);
    if (raw) {
      try {
        setPrefs({ ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<Prefs>) });
      } catch {
        /* keep defaults */
      }
    }
  }, []);

  const update = (patch: Partial<Prefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      window.localStorage.setItem(PREF_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <AppShell title="Settings" subtitle="Preferences are saved in this browser">
      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Appearance">
          <div className="py-3">
            <p className="text-sm font-medium">Theme</p>
            <p className="text-[11px] text-muted-foreground">
              Dark mode is the default. Your choice persists across pages.
            </p>
            <div className="mt-3 flex gap-2">
              {(["dark", "light"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm font-medium capitalize transition-colors",
                    theme === t
                      ? "border-primary/50 bg-primary/15 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t} mode
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Notifications">
          <Toggle
            label="Daily digest"
            description="A morning summary of your tasks"
            checked={prefs.dailyDigest}
            onChange={(v) => update({ dailyDigest: v })}
          />
          <Toggle
            label="Deadline alerts"
            description="Remind me when a task is close to its deadline"
            checked={prefs.deadlineAlerts}
            onChange={(v) => update({ deadlineAlerts: v })}
          />
          <Toggle
            label="Weekly report"
            description="Send a weekly productivity summary"
            checked={prefs.weeklyReport}
            onChange={(v) => update({ weeklyReport: v })}
          />
        </Section>

        <Section title="AI preferences">
          <Toggle
            label="AI recommendations"
            description="Show AI-generated suggestions on the dashboard and insights"
            checked={prefs.aiSuggestions}
            onChange={(v) => update({ aiSuggestions: v })}
          />
          <div className="py-3">
            <p className="text-sm font-medium">Response style</p>
            <p className="text-[11px] text-muted-foreground">How detailed AI answers should be</p>
            <div className="mt-3 flex gap-2">
              {(["concise", "detailed"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update({ aiTone: t })}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm font-medium capitalize transition-colors",
                    prefs.aiTone === t
                      ? "border-primary/50 bg-primary/15 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <AiDisclaimer className="pt-3" />
        </Section>

        <Section title="Account">
          <div className="space-y-3 py-3">
            <label className="block">
              <span className="text-sm font-medium">Display name</span>
              <input
                value={prefs.name}
                onChange={(e) => update({ name: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Role</span>
              <input
                value={prefs.role}
                onChange={(e) => update({ role: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <button
              onClick={() => {
                window.localStorage.removeItem("taskflow-tasks");
                window.location.reload();
              }}
              className="rounded-xl border border-rose/40 px-4 py-2 text-sm font-medium text-rose transition-colors hover:bg-rose/10"
            >
              Reset tasks to sample data
            </button>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}
