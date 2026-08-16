import { useEffect, useMemo, useRef, useState } from "react";
import { AppGlyph } from "./AppGlyph";
import { dockApps, applications, type AppId } from "@/os/registry";
import { setLaunchOrigin } from "@/os/launchOrigin";
import { useOS } from "@/os/store";

const ORDER_KEY = "ayush-os.dock-order.v1";

export function Dock({ mobile }: { mobile: boolean }) {
  const { openApp, windows, focusWindow, settings } = useOS();
  const [hover, setHover] = useState<number | null>(null);
  const [bouncing, setBouncing] = useState<AppId | null>(null);
  const [order, setOrder] = useState<AppId[]>(() => dockApps.map((a) => a.id));
  const [drag, setDrag] = useState<{ id: AppId; from: number; over: number; dx: number; dy: number } | null>(null);
  const [ready, setReady] = useState(false);

  const startRef = useRef<{ x: number; y: number; index: number; moved: boolean } | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const vertical = !mobile && settings.dockPosition !== "bottom";
  const size = mobile ? 46 : settings.dockSize + 8;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDER_KEY);
      if (!raw) return;
      const saved = (JSON.parse(raw) as AppId[]).filter((id) => dockApps.some((a) => a.id === id));
      const missing = dockApps.map((a) => a.id).filter((id) => !saved.includes(id));
      if (saved.length) setOrder([...saved, ...missing]);
    } catch {
      /* ignore */
    }
  }, []);

  // Fallback in case the entrance animation is skipped (reduced motion).
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 1100);
    return () => window.clearTimeout(t);
  }, []);


  const items = useMemo(() => order.map((id) => applications[id]).filter(Boolean), [order]);

  const persist = (next: AppId[]) => {
    setOrder(next);
    try {
      localStorage.setItem(ORDER_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const launch = (id: AppId, el?: HTMLElement | null) => {
    setBouncing(id);
    window.setTimeout(() => setBouncing((b) => (b === id ? null : b)), 520);
    const iconRect = el?.querySelector("svg")?.getBoundingClientRect() ?? el?.getBoundingClientRect();
    if (iconRect) {
      setLaunchOrigin(id, { x: iconRect.left, y: iconRect.top, width: iconRect.width, height: iconRect.height });
    }
    const open = windows.find((w) => w.appId === id);
    if (open) focusWindow(open.id);
    else openApp(id);
  };


  const onPointerDown = (e: React.PointerEvent, index: number) => {
    if (mobile) return;
    startRef.current = { x: e.clientX, y: e.clientY, index, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent, id: AppId) => {
    const start = startRef.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const axis = vertical ? dy : dx;
    if (!start.moved && Math.hypot(dx, dy) < 6) return;
    start.moved = true;
    const step = size + 12;
    const shift = Math.round(axis / step);
    const over = Math.max(0, Math.min(items.length - 1, start.index + shift));
    setDrag({ id, from: start.index, over, dx, dy });
  };

  const endDrag = (e: React.PointerEvent, id: AppId) => {
    const start = startRef.current;
    startRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (!start) return;
    if (!start.moved) {
      launch(id, e.currentTarget as HTMLElement);
      setDrag(null);
      return;
    }
    if (drag && drag.over !== drag.from) {
      const next = order.filter((a) => a !== id);
      next.splice(drag.over, 0, id);
      persist(next);
    }
    setDrag(null);
  };

  const positionClass = mobile
    ? "bottom-3 left-1/2 -translate-x-1/2"
    : settings.dockPosition === "bottom"
      ? "bottom-2 left-1/2 -translate-x-1/2"
      : settings.dockPosition === "left"
        ? "left-3 top-1/2 -translate-y-1/2"
        : "right-3 top-1/2 -translate-y-1/2";

  const enterVars = vertical
    ? ({
        "--dock-tx": "0%",
        "--dock-ty": "-50%",
        "--dock-ex": settings.dockPosition === "left" ? "-26px" : "26px",
        "--dock-ey": "0px",
      } as React.CSSProperties)
    : ({ "--dock-tx": "-50%", "--dock-ty": "0px", "--dock-ex": "0px", "--dock-ey": "26px" } as React.CSSProperties);

  return (
    <div
      ref={listRef}
      style={enterVars}
      onAnimationEnd={() => setReady(true)}
      className={`fixed z-40 flex ${vertical ? "flex-col" : "flex-row"} items-end gap-3 rounded-[26px] border border-white/10 bg-neutral-800/55 px-3 py-2.5 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.14)] transition-[background-color,box-shadow] duration-300 ${positionClass} ${ready ? "" : "dock-enter pointer-events-none"}`}
      onPointerLeave={() => setHover(null)}
    >
      {items.map((app, i) => {
        const running = windows.some((w) => w.appId === app.id);
        const dragging = drag?.id === app.id;
        const distance = hover === null || drag || !ready ? 99 : Math.abs(hover - i);

        const magnify = !settings.dockMagnification || mobile ? 1 : distance === 0 ? 1.45 : distance === 1 ? 1.22 : distance === 2 ? 1.08 : 1;
        const lift = mobile || distance > 2 ? 0 : distance === 0 ? -14 : distance === 1 ? -7 : -2;
        // Push neighbours aside so magnified icons never overlap.
        const spread = dragging ? 0 : (size * (magnify - 1)) / 2;

        // Gap opened for the dragged item's target slot.
        let slide = 0;
        if (drag && !dragging) {
          const step = size + 12;
          if (drag.from < i && i <= drag.over) slide = -step;
          else if (drag.over <= i && i < drag.from) slide = step;
        }

        const transform = dragging
          ? `translate(${vertical ? 0 : drag.dx}px, ${vertical ? drag.dy : Math.min(0, drag.dy)}px) scale(1.25)`
          : vertical
            ? `translate(${lift}px, ${slide}px) scale(${magnify})`
            : `translate(${slide}px, ${lift}px) scale(${magnify})`;

        return (
          <button
            key={app.id}
            onPointerEnter={() => setHover(i)}
            onPointerDown={(e) => onPointerDown(e, i)}
            onPointerMove={(e) => onPointerMove(e, app.id)}
            onPointerUp={(e) => endDrag(e, app.id)}
            onPointerCancel={() => {
              startRef.current = null;
              setDrag(null);
            }}
            className={`dock-item group relative flex touch-none select-none flex-col items-center will-change-transform ${dragging ? "dock-item-dragging z-50" : ""} ${bouncing === app.id && !dragging ? "dock-bounce" : ""}`}
            style={{
              transform,
              transformOrigin: vertical ? "left center" : "bottom center",
              ...(vertical
                ? { marginTop: spread, marginBottom: spread }
                : { marginLeft: spread, marginRight: spread }),
            }}
            aria-label={app.name}
          >
            <span
              className={`pointer-events-none absolute -top-10 whitespace-nowrap rounded-lg bg-neutral-900/90 px-2.5 py-1 text-[11px] font-medium text-white shadow-lg transition-all duration-200 ${
                dragging ? "opacity-0" : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
              }`}
            >
              {app.name}
            </span>
            <AppGlyph
              id={app.id}
              style={{ width: size, height: size }}
              className="drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)] transition-[filter] duration-200 group-active:drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
            />
            <span
              className={`mt-1.5 rounded-full bg-white/90 transition-all duration-300 ${running ? "h-[3px] w-[3px] opacity-100" : "h-[3px] w-[3px] opacity-0"}`}
              aria-hidden
            />
          </button>
        );
      })}
      <div className={vertical ? "my-1 h-px w-full bg-white/20" : "mx-1 h-12 w-px self-center bg-white/25"} />
      <button
        aria-label="Trash"
        onClick={() => undefined}
        className="dock-item group relative flex items-center justify-center hover:-translate-y-2 hover:scale-110 active:scale-95"
        style={{ width: size, height: size }}
      >
        <AppGlyph id="trash" className="h-full w-full" />
      </button>
    </div>
  );
}
