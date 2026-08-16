import { useCallback, useEffect, useRef, useState } from "react";
import { CloudSun, X } from "lucide-react";
import { useOS, type WidgetId } from "@/os/store";
import { useClock } from "@/os/hooks";
import { LocationService, WeatherService, type Weather } from "@/os/services";

function useWidgetDrag(id: WidgetId) {
  const { settings, updateWidget } = useOS();
  const w = settings.widgets[id];
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const resize = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const [active, setActive] = useState(false);

  const onMove = useCallback(
    (e: PointerEvent) => {
      if (drag.current) {
        const d = drag.current;
        updateWidget(id, {
          x: Math.max(8, Math.min(window.innerWidth - 80, d.ox + e.clientX - d.x)),
          y: Math.max(32, Math.min(window.innerHeight - 60, d.oy + e.clientY - d.y)),
        });
      } else if (resize.current) {
        const r = resize.current;
        updateWidget(id, {
          width: Math.max(180, r.w + e.clientX - r.x),
          height: Math.max(110, r.h + e.clientY - r.y),
        });
      }
    },
    [id, updateWidget],
  );

  useEffect(() => {
    if (!active) return;
    const stop = () => {
      drag.current = null;
      resize.current = null;
      setActive(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
    };
  }, [active, onMove]);

  return {
    state: w,
    startDrag: (e: React.PointerEvent) => {
      drag.current = { x: e.clientX, y: e.clientY, ox: w.x, oy: w.y };
      setActive(true);
    },
    startResize: (e: React.PointerEvent) => {
      e.stopPropagation();
      resize.current = { x: e.clientX, y: e.clientY, w: w.width, h: w.height };
      setActive(true);
    },
  };
}

function WidgetShell({
  id,
  children,
  className,
}: {
  id: WidgetId;
  children: React.ReactNode;
  className?: string;
}) {
  const { updateWidget } = useOS();
  const { state, startDrag, startResize } = useWidgetDrag(id);
  if (!state.visible) return null;
  return (
    <div
      className={`group absolute z-10 overflow-hidden rounded-3xl shadow-[0_20px_45px_rgba(15,23,42,0.28)] ${className ?? ""}`}
      style={{ left: state.x, top: state.y, width: state.width, height: state.height }}
      onPointerDown={startDrag}
    >
      <button
        aria-label="Close widget"
        onClick={() => updateWidget(id, { visible: false })}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute right-2 top-2 z-10 rounded-full bg-black/25 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
      >
        <X className="h-3 w-3" />
      </button>
      {children}
      <span
        onPointerDown={startResize}
        className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
        aria-label="Resize widget"
      />
    </div>
  );
}

/* ---------------- Analog clock ---------------- */
export function ClockWidget() {
  const { now, locale } = useClock();
  const sec = now.getSeconds();
  const min = now.getMinutes() + sec / 60;
  const hour = (now.getHours() % 12) + min / 60;

  return (
    <WidgetShell id="clock" className="bg-white/85 backdrop-blur-2xl">
      <div className="flex h-full w-full items-center justify-center p-3">
        <svg viewBox="0 0 200 200" className="h-full w-full max-h-full">
          <circle cx="100" cy="100" r="96" className="fill-white" />
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i * 6 * Math.PI) / 180;
            const long = i % 5 === 0;
            const r1 = long ? 78 : 84;
            return (
              <line
                key={i}
                x1={100 + r1 * Math.sin(a)}
                y1={100 - r1 * Math.cos(a)}
                x2={100 + 88 * Math.sin(a)}
                y2={100 - 88 * Math.cos(a)}
                stroke={long ? "#0f172a" : "#cbd5e1"}
                strokeWidth={long ? 2 : 1}
                strokeLinecap="round"
              />
            );
          })}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = ((i + 1) * 30 * Math.PI) / 180;
            return (
              <text
                key={i}
                x={100 + 64 * Math.sin(a)}
                y={100 - 64 * Math.cos(a) + 5}
                textAnchor="middle"
                fontSize="14"
                fill="#0f172a"
                fontWeight="500"
              >
                {i + 1}
              </text>
            );
          })}
          <text x="100" y="138" textAnchor="middle" fontSize="11" fill="#64748b">
            {now.toLocaleDateString(locale, { month: "short", day: "numeric" })}
          </text>
          <text x="100" y="150" textAnchor="middle" fontSize="7" fill="#f97316">
            ayush world
          </text>
          <line
            x1="100"
            y1="112"
            x2={100 + 44 * Math.sin((hour * 30 * Math.PI) / 180)}
            y2={100 - 44 * Math.cos((hour * 30 * Math.PI) / 180)}
            stroke="#0f172a"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="100"
            y1="116"
            x2={100 + 68 * Math.sin((min * 6 * Math.PI) / 180)}
            y2={100 - 68 * Math.cos((min * 6 * Math.PI) / 180)}
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="100"
            y1="120"
            x2={100 + 78 * Math.sin((sec * 6 * Math.PI) / 180)}
            y2={100 - 78 * Math.cos((sec * 6 * Math.PI) / 180)}
            stroke="#f97316"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="4" fill="#0f172a" />
        </svg>
      </div>
    </WidgetShell>
  );
}

/* ---------------- Calendar ---------------- */
export function CalendarWidget() {
  const { now, locale } = useClock();
  const [view, setView] = useState(() => new Date());
  const year = view.getFullYear();
  const month = view.getMonth();
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7; // Monday-first
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  const shift = (d: number) => setView(new Date(year, month + d, 1));

  return (
    <WidgetShell id="calendar" className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
      <div className="flex h-full flex-col p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/70">{year}</p>
            <p className="text-lg font-semibold leading-tight">
              {view.toLocaleDateString(locale, { month: "long" })}
            </p>
          </div>
          <div className="flex gap-1">
            <button onPointerDown={(e) => e.stopPropagation()} onClick={() => shift(-1)} className="rounded-full bg-white/20 px-2 text-sm" aria-label="Previous month">
              ‹
            </button>
            <button onPointerDown={(e) => e.stopPropagation()} onClick={() => shift(1)} className="rounded-full bg-white/20 px-2 text-sm" aria-label="Next month">
              ›
            </button>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-7 gap-y-1 text-center text-[9px] text-white/70">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="mt-1 grid flex-1 grid-cols-7 gap-y-1 text-center text-[10px]">
          {cells.map((d, i) => {
            const isToday =
              d !== null && d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
            return (
              <span key={i} className="flex items-center justify-center">
                {d === null ? (
                  ""
                ) : (
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      isToday ? "bg-white font-semibold text-fuchsia-600" : ""
                    }`}
                  >
                    {d}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </WidgetShell>
  );
}

/* ---------------- Weather ---------------- */
export function WeatherWidget() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "denied">("idle");
  const { openApp } = useOS();

  const load = async () => {
    setState("loading");
    try {
      const coords = await LocationService.request();
      setWeather(await WeatherService.fetch(coords));
      setState("idle");
    } catch {
      setState("denied");
    }
  };

  return (
    <WidgetShell id="weather" className="bg-gradient-to-br from-sky-400 to-blue-600 text-white">
      <div className="flex h-full flex-col justify-between p-4">
        {weather ? (
          <>
            <p className="text-[11px] uppercase tracking-widest text-white/80">{weather.place}</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-light leading-none">{weather.temperature}°</p>
              <CloudSun className="h-8 w-8 text-white/90" />
            </div>
            <p className="text-xs text-white/85">{weather.condition}</p>
            <p className="text-[11px] text-white/70">
              H {weather.high}° · L {weather.low}°
            </p>
          </>
        ) : (
          <>
            <CloudSun className="h-7 w-7 text-white/90" />
            <p className="text-xs text-white/85">
              {state === "denied" ? "Location permission needed" : "Live weather for your area"}
            </p>
            <div className="flex gap-2">
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={load}
                className="rounded-full bg-white/25 px-3 py-1 text-[11px]"
              >
                {state === "loading" ? "Locating…" : "Enable"}
              </button>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => openApp("weather")}
                className="rounded-full bg-white/15 px-3 py-1 text-[11px]"
              >
                Open app
              </button>
            </div>
          </>
        )}
      </div>
    </WidgetShell>
  );
}
