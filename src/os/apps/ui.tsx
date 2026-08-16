import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AppShell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("h-full w-full overflow-auto bg-card text-card-foreground", className)}>{children}</div>;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-6">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

export function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export function Dot({ ok }: { ok: boolean | null }) {
  return (
    <span
      className={cn(
        "mr-2 inline-block h-2 w-2 rounded-full align-middle",
        ok === null ? "bg-muted-foreground" : ok ? "bg-emerald-500" : "bg-destructive",
      )}
    />
  );
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="text-sm font-medium">{title}</p>
      {hint ? <p className="max-w-sm text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
