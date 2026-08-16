import { useEffect, useRef, useState } from "react";
import type { AppProps } from "../registry";
import { useOS } from "../store";
import { applications } from "../registry";
import { useBattery, useNetwork } from "../hooks";
import { Row, Section } from "./ui";

export default function ActivityMonitorApp(_props: AppProps) {
  const { windows, closeWindow, recentApps } = useOS();
  const battery = useBattery();
  const net = useNetwork();
  const [fps, setFps] = useState(0);
  const frames = useRef(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      frames.current += 1;
      if (t - last >= 1000) {
        setFps(frames.current);
        frames.current = 0;
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const memory = (performance as unknown as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } })
    .memory;

  return (
    <div className="h-full overflow-auto bg-card p-6">
      <Section title="Processes">
        <div className="rounded-lg border border-border/60">
          <div className="grid grid-cols-4 border-b border-border/60 px-3 py-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="col-span-2">Application</span>
            <span>State</span>
            <span className="text-right">Action</span>
          </div>
          {windows.length ? (
            windows.map((w) => (
              <div key={w.id} className="grid grid-cols-4 items-center px-3 py-2 text-sm">
                <span className="col-span-2">{applications[w.appId].name}</span>
                <span className="text-muted-foreground">
                  {w.minimized ? "Minimized" : w.maximized ? "Maximized" : "Running"}
                </span>
                <span className="text-right">
                  <button
                    onClick={() => closeWindow(w.id)}
                    className="rounded border border-border px-2 py-0.5 text-xs hover:bg-muted"
                  >
                    Quit
                  </button>
                </span>
              </div>
            ))
          ) : (
            <p className="px-3 py-4 text-sm text-muted-foreground">No applications running.</p>
          )}
        </div>
      </Section>

      <Section title="System">
        <Row label="Open windows" value={windows.length} />
        <Row label="Registered applications" value={Object.keys(applications).length} />
        <Row label="Recent apps" value={recentApps.map((a) => applications[a].name).join(", ") || "—"} />
        <Row label="Render rate" value={`${fps} fps`} />
        <Row
          label="JS heap"
          value={
            memory
              ? `${(memory.usedJSHeapSize / 1048576).toFixed(1)} MB / ${(memory.jsHeapSizeLimit / 1048576).toFixed(0)} MB`
              : "Not exposed by this browser"
          }
        />
        <Row label="Network" value={net.online ? `Online${net.effectiveType ? ` · ${net.effectiveType}` : ""}` : "Offline"} />
        <Row
          label="Battery"
          value={battery.level !== null ? `${battery.level}% ${battery.charging ? "· Charging" : ""}` : "Unavailable"}
        />
      </Section>
    </div>
  );
}
