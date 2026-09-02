import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { AddTaskForm, AiDisclaimer, StatCard, TaskRow } from "@/components/TaskUI";
import { useTasks } from "@/lib/tasks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — TaskFlow AI" },
      {
        name: "description",
        content:
          "Your daily productivity overview: completed tasks, priorities, productivity score and AI recommendations.",
      },
      { property: "og:title", content: "Dashboard — TaskFlow AI" },
      {
        property: "og:description",
        content: "Daily productivity overview with AI-generated recommendations.",
      },
    ],
  }),
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const { tasks, stats } = useTasks();
  const [adding, setAdding] = useState(false);

  const todaysTasks = useMemo(() => tasks.slice(0, 6), [tasks]);

  const nextUp = useMemo(() => {
    const pending = tasks.filter((t) => !t.completed);
    const order = { high: 0, medium: 1, low: 2 } as const;
    return [...pending].sort(
      (a, b) =>
        order[a.priority] - order[b.priority] ||
        new Date(a.due || 0).getTime() - new Date(b.due || 0).getTime(),
    )[0];
  }, [tasks]);

  const aiMessage = nextUp
    ? `You've completed ${stats.completed} of ${tasks.length} tasks. Start with "${nextUp.title}" — it's your highest-leverage item right now${stats.overdue.length ? `, and ${stats.overdue.length} task${stats.overdue.length > 1 ? "s are" : " is"} already overdue` : ""}.`
    : "Everything on your list is complete. Use the freed time to plan tomorrow's priorities.";

  return (
    <AppShell title="Dashboard" subtitle={new Date().toDateString()}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-panel via-panel-2 to-primary/10 p-6 md:p-8">
          <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-primary/20 blur-[80px]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-[11px] font-medium text-cyan">
                <span className="glow-dot size-1.5 rounded-full bg-cyan" /> AI-generated summary
              </span>
              <h2 className="mt-4 font-display text-3xl leading-tight font-extrabold tracking-tight md:text-4xl">
                {greeting()}! What would you like to accomplish today?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{aiMessage}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/assistant"
                className="rounded-xl bg-gradient-to-r from-brand to-violet px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Ask the AI
              </Link>
              <button
                onClick={() => setAdding(true)}
                className="rounded-xl border border-border bg-panel px-5 py-3 text-sm font-semibold transition hover:bg-accent"
              >
                Add task
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Tasks completed" value={stats.completed} hint="in your workspace" accent="mint" />
          <StatCard label="Tasks remaining" value={stats.remaining} hint={`${stats.overdue.length} overdue`} />
          <StatCard label="High priority" value={stats.highPriority} hint="needs attention" accent="rose" />
          <StatCard label="Productivity score" value={`${stats.score}%`} progress={stats.score} accent="brand" />
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-panel p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Today's Tasks</h3>
              <Link to="/tasks" className="text-xs font-semibold text-cyan hover:text-foreground">
                View all
              </Link>
            </div>
            {adding ? (
              <div className="mb-3">
                <AddTaskForm onClose={() => setAdding(false)} />
              </div>
            ) : null}
            <div className="space-y-2">
              {todaysTasks.length ? (
                todaysTasks.map((t) => <TaskRow key={t.id} task={t} />)
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No tasks yet. Add your first one to get started.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-primary/30 bg-gradient-to-b from-panel-2 to-panel p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-violet text-white">
                <Sparkles className="size-4" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">AI Productivity Insight</p>
                <p className="text-[10px] text-muted-foreground">AI-generated</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              You've completed{" "}
              {stats.highPriorityTotal
                ? Math.round((stats.highPriorityDone / stats.highPriorityTotal) * 100)
                : 0}
              % of your high-priority tasks. Your completion rate across all tasks is{" "}
              {stats.completionRate}%.
            </p>
            <div className="mt-4 rounded-xl border border-cyan/25 bg-cyan/5 p-3">
              <p className="text-[10px] tracking-[0.15em] text-cyan uppercase">Recommendation</p>
              <p className="mt-1 text-xs leading-relaxed">
                {stats.overdue.length
                  ? `Clear the ${stats.overdue.length} overdue task${stats.overdue.length > 1 ? "s" : ""} first, then protect a focus block for high-priority work.`
                  : "Schedule your most important tasks during your most productive hours and avoid interruptions during that period."}
              </p>
            </div>
            <AiDisclaimer className="mt-auto pt-4" />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
