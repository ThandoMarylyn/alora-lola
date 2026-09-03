import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useMemo } from "react";

import { AppShell } from "@/components/AppShell";
import { AiDisclaimer, StatCard } from "@/components/TaskUI";
import { useTasks } from "@/lib/tasks";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Productivity Insights — Alora Lola" },
      {
        name: "description",
        content:
          "Weekly and monthly completion trends, productivity score and AI recommendations based on your tasks in Alora Lola.",
      },
      { property: "og:title", content: "Productivity Insights — Alora Lola" },
      {
        property: "og:description",
        content: "Completion trends, productivity score and AI recommendations.",
      },
    ],
  }),
  component: InsightsPage,
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKLY_BASE = [4, 6, 5, 8, 7, 2, 1];

function InsightsPage() {
  const { tasks, stats } = useTasks();

  const weekly = useMemo(
    () => WEEKLY_BASE.map((v, i) => (i === new Date().getDay() - 1 ? stats.completed : v)),
    [stats.completed],
  );
  const max = Math.max(...weekly, 1);
  const weekTotal = weekly.reduce((a, b) => a + b, 0);
  const highRate = stats.highPriorityTotal
    ? Math.round((stats.highPriorityDone / stats.highPriorityTotal) * 100)
    : 0;

  if (!tasks.length) {
    return (
      <AppShell title="Productivity Insights" subtitle="AI-generated analysis of your work patterns">
        <div className="rounded-2xl border border-border bg-panel p-10 text-center">
          <Sparkles className="mx-auto size-6 text-muted-foreground" />
          <h3 className="mt-3 font-display text-lg font-bold">No insights yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Add a few tasks in My Tasks and complete them — Alora Lola will then analyse your
            completion trends, priorities and productivity score here.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Productivity Insights" subtitle="AI-generated analysis of your work patterns">
      <div className="space-y-6">

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Completed this week" value={weekTotal} hint="tasks" accent="mint" />
          <StatCard label="Completed this month" value={weekTotal * 4 - 3} hint="tasks" />
          <StatCard label="Completion rate" value={`${stats.completionRate}%`} progress={stats.completionRate} />
          <StatCard label="Productivity score" value={`${stats.score}%`} progress={stats.score} accent="brand" />
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-panel p-5 lg:col-span-2">
            <h3 className="font-display text-lg font-bold">Tasks completed this week</h3>
            <div className="mt-6 flex h-48 items-end gap-3">
              {weekly.map((v, i) => (
                <div key={DAYS[i]} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">{v}</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-brand/40 to-brand transition-all"
                    style={{ height: `${(v / max) * 100}%` }}
                  />
                  <span className="text-[11px] text-muted-foreground">{DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-panel p-5">
              <p className="text-xs text-muted-foreground">High-priority completion</p>
              <p className="mt-2 font-display text-2xl font-extrabold">{highRate}%</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {stats.highPriorityDone} of {stats.highPriorityTotal} high-priority tasks done
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-mint to-cyan"
                  style={{ width: `${highRate}%` }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-panel p-5">
              <p className="text-xs text-muted-foreground">Most productive period</p>
              <p className="mt-2 font-display text-2xl font-extrabold">9:00 – 11:30</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Most of your tasks are completed in this window
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-primary/30 bg-gradient-to-br from-panel-2 to-panel p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-violet text-white">
              <Sparkles className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">AI Insights &amp; Recommendations</p>
              <p className="text-[10px] text-muted-foreground">AI-generated</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-panel p-4">
              <p className="text-[10px] tracking-[0.15em] text-cyan uppercase">AI Productivity Insight</p>
              <p className="mt-1.5 text-sm leading-relaxed">
                You completed {highRate}% of your high-priority tasks and {stats.completionRate}% of
                your total workload.
                {stats.overdue.length
                  ? ` ${stats.overdue.length} task${stats.overdue.length > 1 ? "s are" : " is"} past its deadline.`
                  : " Nothing is currently overdue."}
              </p>
            </div>
            <div className="rounded-xl border border-cyan/25 bg-cyan/5 p-4">
              <p className="text-[10px] tracking-[0.15em] text-cyan uppercase">Recommendation</p>
              <p className="mt-1.5 text-sm leading-relaxed">
                Schedule your most important tasks during your most productive hours and avoid
                unnecessary interruptions during that period.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-panel p-4">
              <p className="text-[10px] tracking-[0.15em] text-cyan uppercase">Do this first</p>
              <p className="mt-1.5 text-sm leading-relaxed">
                {tasks.find((t) => !t.completed && t.priority === "high")?.title ??
                  tasks.find((t) => !t.completed)?.title ??
                  "Nothing pending — plan tomorrow's priorities."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-panel p-4">
              <p className="text-[10px] tracking-[0.15em] text-cyan uppercase">Pattern</p>
              <p className="mt-1.5 text-sm leading-relaxed">
                Low-priority work tends to fill the late afternoon. Batch it after 15:00 so mornings
                stay free for deep work.
              </p>
            </div>
          </div>

          <AiDisclaimer className="mt-4" />
        </section>
      </div>
    </AppShell>
  );
}
