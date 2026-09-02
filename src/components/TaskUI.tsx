import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

import { formatDue, useTasks, type Priority, type Task } from "@/lib/tasks";
import { cn } from "@/lib/utils";

const PRIORITY_STYLES: Record<Priority, string> = {
  high: "bg-rose/15 text-rose",
  medium: "bg-amber/15 text-amber",
  low: "bg-cyan/15 text-cyan",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        PRIORITY_STYLES[priority],
      )}
    >
      {priority}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent,
  progress,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "brand" | "rose" | "mint";
  progress?: number;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-panel p-5 transition-colors hover:border-primary/40",
        accent === "rose" && "border-rose/30 bg-rose/5",
        accent === "brand" && "border-primary/40 bg-gradient-to-br from-panel-2 to-primary/10",
      )}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 font-display text-3xl font-extrabold",
          accent === "rose" && "text-rose",
          accent === "mint" && "text-mint",
        )}
      >
        {value}
      </p>
      {typeof progress === "number" ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand to-cyan transition-all"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : null}
      {hint ? <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function TaskRow({ task }: { task: Task }) {
  const { toggleTask, deleteTask, updateTask } = useTasks();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [due, setDue] = useState(task.due);

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          updateTask(task.id, { title: title.trim(), priority, due });
          setEditing(false);
        }}
        className="space-y-3 rounded-xl border border-primary/40 bg-panel-2 p-3"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Task name"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            aria-label="Priority"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input
            type="datetime-local"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            aria-label="Deadline"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            >
              Save changes
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border bg-panel-2/60 p-3 transition-colors hover:border-primary/30">
      <button
        onClick={() => toggleTask(task.id)}
        aria-label={task.completed ? `Mark ${task.title} as pending` : `Mark ${task.title} as complete`}
        aria-pressed={task.completed}
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors",
          task.completed ? "border-mint bg-mint text-black" : "border-border hover:border-primary",
        )}
      >
        {task.completed ? <Check className="size-3" strokeWidth={3} /> : null}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium transition-colors",
            task.completed && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {task.category ? `${task.category} · ` : ""}
          {formatDue(task.due)}
        </p>
      </div>

      <PriorityBadge priority={task.priority} />

      <div className="flex gap-1 opacity-60 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => setEditing(true)}
          aria-label={`Edit ${task.title}`}
          className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          aria-label={`Delete ${task.title}`}
          className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-rose"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export function AddTaskForm({ onClose }: { onClose: () => void }) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [due, setDue] = useState("");
  const [error, setError] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) {
          setError("Please enter a task name.");
          return;
        }
        addTask({ title: title.trim(), priority, due, completed: false });
        onClose();
      }}
      className="space-y-3 rounded-2xl border border-primary/40 bg-panel p-4"
    >
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold">New task</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cancel new task"
          className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
      <input
        value={title}
        autoFocus
        onChange={(e) => {
          setTitle(e.target.value);
          setError("");
        }}
        placeholder="What needs to be done?"
        aria-label="Task name"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {error ? <p className="text-xs text-rose">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          aria-label="Priority"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="high">High priority</option>
          <option value="medium">Medium priority</option>
          <option value="low">Low priority</option>
        </select>
        <input
          type="datetime-local"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          aria-label="Deadline"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="ml-auto rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Add task
        </button>
      </div>
    </form>
  );
}

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("text-[11px] leading-relaxed text-muted-foreground", className)}>
      <span className="font-semibold text-cyan">Responsible AI:</span> AI-generated responses may
      contain errors or inaccuracies. Review AI suggestions before using them for important
      workplace decisions.
    </p>
  );
}
