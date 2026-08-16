import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { applications } from "@/os/registry";
import { takeLaunchOrigin } from "@/os/launchOrigin";
import { useOS, type WindowState } from "@/os/store";

const MENUBAR_H = 28;

export function WindowFrame({ win, mobile }: { win: WindowState; mobile: boolean }) {
  const { focusWindow, closeWindow, minimizeWindow, toggleMaximize, moveWindow, resizeWindow, activeWindowId } =
    useOS();
  const def = applications[win.appId];
  const AppComponent = def.component;
  const active = activeWindowId === win.id;
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const resizeRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  // Expand the window out of the icon it was launched from.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const origin = takeLaunchOrigin(win.appId);
    if (!origin) return;
    if (document.documentElement.dataset["reduceMotion"] === "true") return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const sx = Math.max(0.05, origin.width / r.width);
    const sy = Math.max(0.05, origin.height / r.height);
    const tx = origin.x + origin.width / 2 - (r.x + r.width / 2);
    const ty = origin.y + origin.height / 2 - (r.y + r.height / 2);
    el.animate(
      [
        { transform: `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`, opacity: 0.25, borderRadius: "24px" },
        { transform: "none", opacity: 1, borderRadius: "12px" },
      ],
      { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (dragRef.current) {
        const d = dragRef.current;
        moveWindow(
          win.id,
          Math.max(0, Math.min(window.innerWidth - 120, d.ox + e.clientX - d.x)),
          Math.max(MENUBAR_H, Math.min(window.innerHeight - 60, d.oy + e.clientY - d.y)),
        );
      } else if (resizeRef.current) {
        const r = resizeRef.current;
        resizeWindow(
          win.id,
          Math.max(def.minimumSize.width, r.w + e.clientX - r.x),
          Math.max(def.minimumSize.height, r.h + e.clientY - r.y),
        );
      }
    },
    [win.id, moveWindow, resizeWindow, def.minimumSize.width, def.minimumSize.height],
  );

  useEffect(() => {
    if (!dragging) return;
    const stop = () => {
      dragRef.current = null;
      resizeRef.current = null;
      setDragging(false);
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stop);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stop);
    };
  }, [dragging, onPointerMove]);

  if (win.minimized) return null;

  const style: React.CSSProperties = mobile
    ? { inset: 0, top: MENUBAR_H, bottom: 78, zIndex: win.z, position: "absolute" }
    : win.maximized
      ? { left: 0, top: MENUBAR_H, width: "100%", height: `calc(100% - ${MENUBAR_H + 84}px)`, zIndex: win.z, position: "absolute" }
      : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.z, position: "absolute" };

  return (
    <div
      ref={frameRef}
      style={style}
      onPointerDown={() => focusWindow(win.id)}
      className={`window-frame flex flex-col overflow-hidden rounded-xl border border-white/12 bg-card/95 backdrop-blur-2xl ${
        active ? "shadow-window-active" : "shadow-window"
      }`}
    >
      <div
        className="flex h-9 shrink-0 select-none items-center gap-2 border-b border-border/60 bg-muted/60 px-3"
        onDoubleClick={() => !mobile && toggleMaximize(win.id)}
        onPointerDown={(e) => {
          if (mobile || win.maximized) return;
          dragRef.current = { x: e.clientX, y: e.clientY, ox: win.x, oy: win.y };
          setDragging(true);
        }}
      >
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Close window"
            onClick={() => closeWindow(win.id)}
            className="h-3 w-3 rounded-full bg-[#ff5f57] transition-transform hover:scale-110"
          />
          <button
            aria-label="Minimize window"
            onClick={() => minimizeWindow(win.id)}
            className="h-3 w-3 rounded-full bg-[#febc2e] transition-transform hover:scale-110"
          />
          <button
            aria-label="Maximize window"
            onClick={() => toggleMaximize(win.id)}
            className="h-3 w-3 rounded-full bg-[#28c840] transition-transform hover:scale-110"
          />
        </div>
        <p className="flex-1 truncate text-center text-xs font-medium text-muted-foreground">{win.title}</p>
        <div className="w-14" />
      </div>

      <div className="relative flex-1 overflow-hidden">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Loading {def.name}…
            </div>
          }
        >
          <AppComponent windowId={win.id} params={win.params} />
        </Suspense>
      </div>

      {!mobile && !win.maximized ? (
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            resizeRef.current = { x: e.clientX, y: e.clientY, w: win.width, h: win.height };
            setDragging(true);
          }}
          className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
          aria-label="Resize window"
        />
      ) : null}
    </div>
  );
}
