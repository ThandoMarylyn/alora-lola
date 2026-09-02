import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListChecks,
  Bot,
  BarChart3,
  Settings as SettingsIcon,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { useTheme } from "@/lib/theme";
import { useTasks } from "@/lib/tasks";
import { cn } from "@/lib/utils";
import { SupportChat } from "@/components/SupportChat";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "My Tasks", icon: ListChecks },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/insights", label: "Productivity Insights", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="grid size-9 place-items-center rounded-xl border border-border bg-panel text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      <p className="mb-2 px-3 text-[10px] tracking-[0.18em] text-muted-foreground uppercase">Workspace</p>
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border border-primary/40 bg-primary/15 text-foreground"
                : "border border-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className={cn("size-4", active && "text-primary")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet font-display text-lg font-extrabold text-white">
        T
      </div>
      <div className="leading-tight">
        <p className="font-display text-[15px] font-bold tracking-tight">TaskFlow AI</p>
        <p className="text-[11px] text-muted-foreground">Productivity Console</p>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { stats } = useTasks();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 size-[420px] rounded-full bg-violet/15 blur-[130px]" />
        <div className="absolute top-1/3 -right-32 size-[380px] rounded-full bg-cyan/10 blur-[130px]" />
      </div>

      <div className="relative flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-panel/60 backdrop-blur-xl md:flex">
          <div className="flex h-20 items-center px-5">
            <Brand />
          </div>
          <div className="flex-1 px-3 py-4">
            <NavLinks />
          </div>
          <div className="p-3">
            <div className="rounded-2xl border border-border bg-panel-2 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold">Today's progress</span>
                <span className="text-[10px] text-cyan">{stats.score}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand to-cyan transition-all"
                  style={{ width: `${stats.score}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {stats.completed} completed · {stats.remaining} remaining
              </p>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                aria-label="Open navigation menu"
                className="grid size-9 shrink-0 place-items-center rounded-xl border border-border bg-panel text-muted-foreground md:hidden"
              >
                <Menu className="size-4" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate font-display text-lg font-bold tracking-tight">{title}</h1>
                {subtitle ? (
                  <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-cyan to-brand text-[12px] font-bold text-black">
                DR
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">{children}</div>
        </main>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-border bg-panel p-4">
            <div className="mb-6 flex items-center justify-between">
              <Brand />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="grid size-9 place-items-center rounded-xl border border-border text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <SupportChat />
    </div>
  );
}
