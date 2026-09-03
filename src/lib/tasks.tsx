import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Priority = "high" | "medium" | "low";

export type Task = {
  id: string;
  title: string;
  priority: Priority;
  due: string; // ISO datetime-local string e.g. 2026-09-02T14:00
  completed: boolean;
  category?: string;
};

const STORAGE_KEY = "alora-lola-tasks-v2";
const LEGACY_KEYS = ["alora-lola-tasks", "taskflow-tasks"];

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** A time relative to "now", rounded to the nearest half hour — always realistic. */
function inHours(hours: number) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + Math.round(hours * 60), 0, 0);
  d.setMinutes(d.getMinutes() < 30 ? 0 : 30, 0, 0);
  return toLocalInput(d);
}

function createSampleTasks(): Task[] {
  return [
    { id: "t1", title: "Complete project report", priority: "high", due: inHours(-3), completed: true, category: "Reporting" },
    { id: "t2", title: "Respond to client emails", priority: "medium", due: inHours(-1.5), completed: true, category: "Inbox" },
    { id: "t3", title: "Prepare presentation", priority: "high", due: inHours(2), completed: false, category: "Slides" },
    { id: "t4", title: "Attend team meeting", priority: "low", due: inHours(4), completed: false, category: "Meeting" },
    { id: "t5", title: "Review weekly performance", priority: "medium", due: inHours(24), completed: false, category: "Analytics" },
    { id: "t6", title: "Submit project documentation", priority: "medium", due: inHours(30), completed: false, category: "Docs" },
  ];
}

const SAMPLE_TASKS: Task[] = createSampleTasks();


type TaskContextValue = {
  tasks: Task[];
  addTask: (t: Omit<Task, "id">) => void;
  updateTask: (id: string, patch: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  stats: {
    completed: number;
    remaining: number;
    highPriority: number;
    score: number;
    completionRate: number;
    highPriorityDone: number;
    highPriorityTotal: number;
    overdue: Task[];
  };
};

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);

  useEffect(() => {
    // Clear pre-release sample data that used stale placeholder dates.
    for (const key of LEGACY_KEYS) window.localStorage.removeItem(key);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Task[];
        if (Array.isArray(parsed)) setTasks(parsed);
      } catch {
        /* keep sample data */
      }
    } else {
      const fresh = createSampleTasks();
      setTasks(fresh);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    }
  }, []);


  const addTask = useCallback(
    (t: Omit<Task, "id">) => {
      setTasks((prev) => {
        const next = [{ ...t, id: crypto.randomUUID() }, ...prev];
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const updateTask = useCallback((id: string, patch: Partial<Omit<Task, "id">>) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...patch } : t));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    const remaining = tasks.length - completed;
    const highPriority = tasks.filter((t) => t.priority === "high" && !t.completed).length;
    const highPriorityTotal = tasks.filter((t) => t.priority === "high").length;
    const highPriorityDone = tasks.filter((t) => t.priority === "high" && t.completed).length;
    const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    const overdue = tasks.filter((t) => !t.completed && t.due && new Date(t.due).getTime() < Date.now());
    const score = Math.max(
      0,
      Math.min(100, Math.round(completionRate * 0.7 + (highPriorityTotal ? (highPriorityDone / highPriorityTotal) * 30 : 30) - overdue.length * 3)),
    );
    return { completed, remaining, highPriority, score, completionRate, highPriorityDone, highPriorityTotal, overdue };
  }, [tasks]);

  const value = useMemo(
    () => ({ tasks, addTask, updateTask, deleteTask, toggleTask, stats }),
    [tasks, addTask, updateTask, deleteTask, toggleTask, stats],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used inside TaskProvider");
  return ctx;
}

export function formatDue(due: string) {
  if (!due) return "No deadline";
  const d = new Date(due);
  if (Number.isNaN(d.getTime())) return due;
  const isToday = d.toDateString() === new Date().toDateString();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return isToday ? `Today · ${time}` : `${d.toLocaleDateString([], { month: "short", day: "numeric" })} · ${time}`;
}
