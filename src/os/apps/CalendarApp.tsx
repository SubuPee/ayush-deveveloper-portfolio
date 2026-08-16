import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AppProps } from "../registry";
import { useClock } from "../hooks";

export default function CalendarApp(_props: AppProps) {
  const { now, locale } = useClock();
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState<Date>(() => new Date());

  const grid = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const isSame = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const shift = (months: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + months, 1));

  return (
    <div
      className="flex h-full flex-col bg-card p-5 outline-none"
      tabIndex={0}
      onKeyDown={(e) => {
        const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
        const delta = map[e.key];
        if (delta !== undefined) {
          e.preventDefault();
          const next = new Date(selected);
          next.setDate(next.getDate() + delta);
          setSelected(next);
          setCursor(new Date(next.getFullYear(), next.getMonth(), 1));
        }
      }}
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {cursor.toLocaleDateString(locale, { month: "long", year: "numeric" })}
          </h2>
          <p className="text-xs text-muted-foreground">
            Today · {now.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded-md p-1.5 hover:bg-muted" onClick={() => shift(-12)} aria-label="Previous year">
            «
          </button>
          <button className="rounded-md p-1.5 hover:bg-muted" onClick={() => shift(-1)} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
            onClick={() => {
              const t = new Date();
              setCursor(new Date(t.getFullYear(), t.getMonth(), 1));
              setSelected(t);
            }}
          >
            Today
          </button>
          <button className="rounded-md p-1.5 hover:bg-muted" onClick={() => shift(1)} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1.5 hover:bg-muted" onClick={() => shift(12)} aria-label="Next year">
            »
          </button>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-7 text-center text-[11px] uppercase tracking-wider text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-1 grid flex-1 grid-cols-7 gap-1">
        {grid.map((d, i) => (
          <button
            key={i}
            disabled={!d}
            onClick={() => d && setSelected(d)}
            className={`flex min-h-9 items-start justify-center rounded-md p-1.5 text-sm transition-colors ${
              !d
                ? "cursor-default"
                : isSame(d, selected)
                  ? "bg-primary text-primary-foreground"
                  : isSame(d, now)
                    ? "bg-primary/15 font-semibold"
                    : "hover:bg-muted"
            }`}
          >
            {d?.getDate() ?? ""}
          </button>
        ))}
      </div>

      <footer className="mt-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
        Selected: {selected.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        {" · "}
        Use arrow keys to navigate.
      </footer>
    </div>
  );
}
