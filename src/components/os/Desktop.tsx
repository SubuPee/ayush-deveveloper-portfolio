import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { BrandIcon, type BrandId } from "./BrandIcon";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { Spotlight } from "./Spotlight";
import { ControlCenter } from "./ControlCenter";
import { CalendarWidget, ClockWidget, WeatherWidget } from "./Widgets";
import { WindowFrame } from "./WindowFrame";
import { setLaunchOrigin } from "@/os/launchOrigin";
import { openExternal } from "@/os/openExternal";
import { LinkLayer } from "./LinkLayer";
import { useOS } from "@/os/store";
import { appList, type AppId } from "@/os/registry";
import { shortcuts } from "@/os/data";
import { useClock, useIsMobile } from "@/os/hooks";
import { resolveWallpaper, wallpapers } from "@/os/wallpapers";

function icon(name: string) {
  return (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Circle;
}

export function Desktop() {
  const { windows, settings, openApp, closeWindow, activeWindowId, focusWindow, minimizeWindow, updateSettings } =
    useOS();
  const mobile = useIsMobile();
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "w" && activeWindowId) {
        e.preventDefault();
        closeWindow(activeWindowId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeWindowId, closeWindow]);

  if (mobile) return <MobileShell />;

  return (
    <div
      className="desktop-root relative h-screen w-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${resolveWallpaper(settings.wallpaper)})` }}
      onContextMenu={(e) => {
        e.preventDefault();
        setMenu({ x: e.clientX, y: e.clientY });
      }}
      onClick={() => setMenu(null)}
    >
      <MenuBar />
      <LinkLayer />

      {menu ? (
        <div
          className="fixed z-[60] w-56 rounded-xl border border-white/15 bg-neutral-900/90 p-2 text-white shadow-2xl backdrop-blur-2xl"
          style={{ left: Math.min(menu.x, window.innerWidth - 240), top: Math.min(menu.y, window.innerHeight - 320) }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="px-2 pb-1 text-[11px] uppercase tracking-widest text-white/45">Change wallpaper</p>
          <div className="grid grid-cols-3 gap-1.5 px-1 pb-2">
            {wallpapers.map((w) => (
              <button
                key={w.id}
                title={w.label}
                onClick={() => {
                  updateSettings({ wallpaper: w.id });
                  setMenu(null);
                }}
                className={`h-10 rounded-md border-2 bg-cover bg-center ${
                  settings.wallpaper === w.id ? "border-sky-400" : "border-transparent"
                }`}
                style={{ backgroundImage: `url(${w.src})` }}
              />
            ))}
          </div>
          <button
            onClick={() => {
              openApp("settings");
              setMenu(null);
            }}
            className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/10"
          >
            Desktop Settings…
          </button>
        </div>
      ) : null}

      <div className="absolute left-3 top-10 grid grid-flow-col grid-rows-6 gap-x-1 gap-y-2">
        {shortcuts.map((s) => {
          const Icon = icon(s.icon);
          const activate = (e: { currentTarget: HTMLElement }) => {
            if (s.href) {
              openExternal(s.href, s.label);
              return;
            }
            if (!s.app) return;
            const rect = e.currentTarget.querySelector("span")?.getBoundingClientRect();
            if (rect) {
              setLaunchOrigin(s.app as AppId, { x: rect.left, y: rect.top, width: rect.width, height: rect.height });
            }
            openApp(s.app as AppId);
          };
          return (
            <button
              key={s.id}
              onDoubleClick={activate}
              onKeyDown={(e) => e.key === "Enter" && activate(e)}
              className="group flex w-20 flex-col items-center gap-1 rounded-xl p-1.5 text-white transition-colors hover:bg-white/20"
              title={`Double-click to open ${s.label}`}
            >
              {s.brand ? (
                <span className="block h-12 w-12 transition-transform group-hover:scale-105">
                  <BrandIcon id={s.brand as BrandId} className="block h-12 w-12" />
                </span>
              ) : (
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-[14px] shadow-[0_8px_18px_rgba(15,23,42,0.35)] transition-transform group-hover:scale-105"
                  style={{ background: s.color }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </span>
              )}
              <span className="rounded px-1 text-[10px] leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      <ClockWidget />
      <WeatherWidget />
      <CalendarWidget />


      {windows.map((w) => (
        <WindowFrame key={w.id} win={w} mobile={false} />
      ))}

      {/* Minimized windows tray */}
      {windows.some((w) => w.minimized) ? (
        <div className="fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 gap-2 rounded-xl border border-white/15 bg-black/40 px-3 py-2 backdrop-blur-xl">
          {windows
            .filter((w) => w.minimized)
            .map((w) => (
              <button
                key={w.id}
                onClick={() => focusWindow(w.id)}
                className="rounded-md bg-white/15 px-2 py-1 text-[11px] text-white hover:bg-white/25"
              >
                {w.title}
              </button>
            ))}
        </div>
      ) : null}

      <Dock mobile={false} />
      <Spotlight />
      <ControlCenter />
      <button
        aria-label="Minimize focused window"
        className="sr-only"
        onClick={() => activeWindowId && minimizeWindow(activeWindowId)}
      />
    </div>
  );
}

function MobileShell() {
  const { windows, openApp, settings, setSpotlightOpen } = useOS();
  const topWindow = windows.filter((w) => !w.minimized).sort((a, b) => a.z - b.z).pop();

  return (
    <div
      className="relative h-[100dvh] w-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${resolveWallpaper(settings.wallpaper)})` }}
    >
      <MenuBar />
      <LinkLayer />

      <div className="absolute inset-x-0 bottom-0 top-7 overflow-auto p-4 pb-28">
        <button
          onClick={() => setSpotlightOpen(true)}
          className="mb-4 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-left text-sm text-white/70 backdrop-blur-xl"
        >
          Search Ayush World
        </button>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <ClockCard />
          <WeatherCard />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {appList.map((a) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[a.icon] ?? Icons.Circle;
            return (
              <button
                key={a.id}
                onClick={(e) => {
                  const rect = e.currentTarget.querySelector("span")?.getBoundingClientRect();
                  if (rect) setLaunchOrigin(a.id, { x: rect.left, y: rect.top, width: rect.width, height: rect.height });
                  openApp(a.id);
                }} className="flex flex-col items-center gap-1 text-white">
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
                  style={{ background: a.color }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </span>
                <span className="text-[10px] leading-tight">{a.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {topWindow ? <WindowFrame win={topWindow} mobile /> : null}

      <Dock mobile />
      <Spotlight />
      <ControlCenter />
    </div>
  );
}

function ClockCard() {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur-xl">
      <MobileClock />
    </div>
  );
}

function MobileClock() {
  const { locale, now } = useClock();
  return (
    <>
      <p className="text-2xl font-light tabular-nums">
        {now.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })}
      </p>
      <p className="text-xs text-white/70">{now.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "short" })}</p>
    </>
  );
}

function WeatherCard() {
  const { openApp } = useOS();
  return (
    <button
      onClick={() => openApp("weather")}
      className="rounded-2xl border border-white/20 bg-white/10 p-4 text-left text-white backdrop-blur-xl"
    >
      <p className="text-sm">Weather</p>
      <p className="text-xs text-white/70">Tap to enable live conditions for your area</p>
    </button>
  );
}
