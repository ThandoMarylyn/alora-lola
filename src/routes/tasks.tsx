import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { AddTaskForm, TaskRow } from "@/components/TaskUI";
import { useTasks } from "@/lib/tasks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "My Tasks — Alora Lola" },
      {
        name: "description",
        content: "Create, edit, prioritise and complete your work tasks in Alora Lola.",
      },
      { property: "og:title", content: "My Tasks — Alora Lola" },
      {
        property: "og:description",
        content: "Create, edit, prioritise and complete your work tasks.",
      },
    ],
  }),
  component: TasksPage,
});

const FILTERS = ["All", "Pending", "Completed", "High Priority"] as const;
type Filter = (typeof FILTERS)[number];

function TasksPage() {
  const { tasks, stats } = useTasks();
  const [filter, setFilter] = useState<Filter>("All");
  const [adding, setAdding] = useState(false);

  const visible = useMemo(() => {
    switch (filter) {
      case "Pending":
        return tasks.filter((t) => !t.completed);
      case "Completed":
        return tasks.filter((t) => t.completed);
      case "High Priority":
        return tasks.filter((t) => t.priority === "high");
      default:
        return tasks;
    }
  }, [tasks, filter]);

  return (
    <AppShell title="My Tasks" subtitle={`${stats.remaining} pending · ${stats.completed} completed`}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  filter === f
                    ? "border-primary/50 bg-primary/15 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-violet px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Plus className="size-4" /> Add Task
          </button>
        </div>

        {adding ? <AddTaskForm onClose={() => setAdding(false)} /> : null}

        <div className="space-y-2 rounded-2xl border border-border bg-panel p-4">
          {visible.length ? (
            visible.map((t) => <TaskRow key={t.id} task={t} />)
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nothing here for the “{filter}” filter.
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
