import { useEffect, useRef, useState } from "react";
import {
  BatteryCharging,
  BatteryFull,
  Bluetooth,
  Check,
  Search,
  SlidersHorizontal,
  Wifi,
  WifiOff,
} from "lucide-react";
import { AyushMark } from "./BootSequence";
import { applications } from "@/os/registry";
import { useOS } from "@/os/store";
import { useBattery, useClock, useNetwork } from "@/os/hooks";
import { formatTime } from "@/os/services";
import { wallpapers } from "@/os/wallpapers";

type Item = { label: string; shortcut?: string; action?: () => void; disabled?: boolean; separator?: boolean };

export function MenuBar() {
  const {
    activeApp,
    activeWindowId,
    windows,
    settings,
    updateSettings,
    openApp,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    setSpotlightOpen,
    setControlCenterOpen,
    controlCenterOpen,
  } = useOS();
  const clock = useClock();
  const battery = useBattery();
  const net = useNetwork();
  const def = activeApp ? applications[activeApp] : null;
  const menus = def ? def.menus : ["File", "Edit", "View", "Go", "Window", "Help"];

  const [open, setOpen] = useState<string | null>(null);
  const [wifiOpen, setWifiOpen] = useState(false);
  const [btOpen, setBtOpen] = useState(false);
  const [wifiOn, setWifiOn] = useState(true);
  const [btOn, setBtOn] = useState(true);
  const [ssid, setSsid] = useState("Home WiFi");
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(null);
        setWifiOpen(false);
        setBtOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(null), setWifiOpen(false), setBtOpen(false));
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const appleItems: Item[] = [
    { label: "About Ayush World", action: () => openApp("sysinfo") },
    { separator: true, label: "-" },
    { label: "System Settings…", shortcut: "⌘,", action: () => openApp("settings") },
    { label: "Activity Monitor", action: () => openApp("activity") },
    { separator: true, label: "-" },
    {
      label: settings.reduceMotion ? "Motion: reduced" : "Motion: full",
      action: () => updateSettings({ reduceMotion: !settings.reduceMotion }),
    },
    { separator: true, label: "-" },
    { label: "Close All Windows", action: () => windows.forEach((w) => closeWindow(w.id)) },
  ];

  const menuItems = (name: string): Item[] => {
    switch (name) {
      case "File":
        return [
          { label: "New Finder Window", shortcut: "⌘N", action: () => openApp("finder") },
          { label: "New Terminal", shortcut: "⌥⌘T", action: () => openApp("terminal") },
          { separator: true, label: "-" },
          { label: "Open Spotlight", shortcut: "⌘Space", action: () => setSpotlightOpen(true) },
          {
            label: "Close Window",
            shortcut: "⌘W",
            disabled: !activeWindowId,
            ...(activeWindowId ? { action: () => closeWindow(activeWindowId) } : {}),
          },
        ];
      case "Edit":
        return [
          { label: "Undo", shortcut: "⌘Z", disabled: true },
          { label: "Redo", shortcut: "⇧⌘Z", disabled: true },
          { separator: true, label: "-" },
          { label: "Copy Email", action: () => navigator.clipboard?.writeText("ayush@example.com") },
          { label: "Copy Page Link", action: () => navigator.clipboard?.writeText(window.location.href) },
        ];
      case "View":
        return [
          { label: "Show Control Center", action: () => setControlCenterOpen(true) },
          {
            label: settings.dockMagnification ? "Turn Off Dock Magnification" : "Turn On Dock Magnification",
            action: () => updateSettings({ dockMagnification: !settings.dockMagnification }),
          },
          { separator: true, label: "-" },
          ...wallpapers.slice(0, 4).map((w) => ({
            label: `Wallpaper: ${w.label}`,
            action: () => updateSettings({ wallpaper: w.id }),
          })),
        ];
      case "Go":
        return [
          { label: "Projects", action: () => openApp("safari") },
          { label: "Photos", action: () => openApp("photos") },
          { label: "Music", action: () => openApp("music") },
          { label: "Mail", action: () => openApp("mail") },
          { label: "Calendar", action: () => openApp("calendar") },
        ];
      case "Window":
        return [
          {
            label: "Minimize",
            shortcut: "⌘M",
            disabled: !activeWindowId,
            ...(activeWindowId ? { action: () => minimizeWindow(activeWindowId) } : {}),
          },
          {
            label: "Zoom",
            disabled: !activeWindowId,
            ...(activeWindowId ? { action: () => toggleMaximize(activeWindowId) } : {}),
          },
          { separator: true, label: "-" },
          ...windows.map((w) => ({ label: w.title, action: () => focusWindow(w.id) })),
        ];
      case "Help":
        return [
          { label: "Ayush World Help", action: () => openApp("sysinfo") },
          { label: "Contact Ayush", action: () => openApp("mail") },
        ];
      default:
        return [{ label: `${name} — no actions`, disabled: true }];
    }
  };

  const Dropdown = ({ items }: { items: Item[] }) => (
    <div className="absolute left-0 top-full mt-1 w-60 rounded-xl border border-white/15 bg-neutral-900/90 p-1.5 text-white shadow-2xl backdrop-blur-2xl">
      {items.map((it, i) =>
        it.separator ? (
          <div key={i} className="my-1 h-px bg-white/10" />
        ) : (
          <button
            key={i}
            disabled={it.disabled}
            onClick={() => {
              it.action?.();
              setOpen(null);
            }}
            className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[13px] hover:bg-sky-500/80 disabled:pointer-events-none disabled:text-white/35"
          >
            <span className="truncate">{it.label}</span>
            {it.shortcut ? <span className="pl-3 text-white/50">{it.shortcut}</span> : null}
          </button>
        ),
      )}
    </div>
  );

  return (
    <div
      ref={rootRef}
      className="fixed inset-x-0 top-0 z-[70] flex h-7 items-center gap-1 border-b border-white/10 bg-black/35 px-2 text-[12px] text-white backdrop-blur-xl"
    >
      <div className="relative">
        <button
          onClick={() => setOpen(open === "apple" ? null : "apple")}
          className={`flex items-center rounded px-1.5 py-0.5 ${open === "apple" ? "bg-white/20" : "hover:bg-white/10"}`}
          aria-label="System menu"
        >
          <AyushMark className="h-4 w-4" />
        </button>
        {open === "apple" ? <Dropdown items={appleItems} /> : null}
      </div>

      <span className="px-1.5 font-semibold">{def ? def.name : "Finder"}</span>

      <div className="hidden items-center sm:flex">
        {menus.map((m) => (
          <div key={m} className="relative">
            <button
              onClick={() => setOpen(open === m ? null : m)}
              onMouseEnter={() => open && open !== m && setOpen(m)}
              className={`rounded px-2 py-0.5 ${open === m ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"}`}
            >
              {m}
            </button>
            {open === m ? <Dropdown items={menuItems(m)} /> : null}
          </div>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2 text-white/85">
        <button aria-label="Spotlight" onClick={() => setSpotlightOpen(true)} className="rounded p-1 hover:bg-white/10">
          <Search className="h-3.5 w-3.5" />
        </button>

        <div className="relative">
          <button
            aria-label="Wi-Fi"
            onClick={() => {
              setBtOpen(false);
              setWifiOpen(!wifiOpen);
            }}
            className={`rounded p-1 ${wifiOpen ? "bg-white/20" : "hover:bg-white/10"}`}
          >
            {wifiOn && net.online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5 text-red-400" />}
          </button>
          {wifiOpen ? (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/15 bg-neutral-900/90 p-3 text-white shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-2">
                <span className="text-sm font-semibold">Wi-Fi</span>
                <Switch on={wifiOn} onChange={setWifiOn} />
              </div>
              <div className={wifiOn ? "" : "pointer-events-none opacity-40"}>
                {["Home WiFi", "Office Network", "iPhone Hotspot"].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSsid(n)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm ${
                      ssid === n ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <Wifi className="h-4 w-4 text-sky-400" />
                    <span className="flex-1 text-left">{n}</span>
                    {ssid === n ? <Check className="h-4 w-4 text-sky-400" /> : null}
                  </button>
                ))}
              </div>
              <div className="mt-2 border-t border-white/10 pt-2">
                <button
                  onClick={() => {
                    openApp("network");
                    setWifiOpen(false);
                  }}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Network Preferences…
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <button
            aria-label="Bluetooth"
            onClick={() => {
              setWifiOpen(false);
              setBtOpen(!btOpen);
            }}
            className={`rounded p-1 ${btOpen ? "bg-white/20" : "hover:bg-white/10"}`}
          >
            <Bluetooth className={`h-3.5 w-3.5 ${btOn ? "" : "text-white/40"}`} />
          </button>
          {btOpen ? (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/15 bg-neutral-900/90 p-3 text-white shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-2">
                <span className="text-sm font-semibold">Bluetooth</span>
                <Switch on={btOn} onChange={setBtOn} />
              </div>
              <p className="text-sm text-white/60">
                {btOn ? 'Now discoverable as "Ayush\'s MacBook Pro"' : "Bluetooth is off"}
              </p>
              <div className="mt-2 border-t border-white/10 pt-2">
                <button
                  onClick={() => {
                    openApp("bluetooth");
                    setBtOpen(false);
                  }}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Bluetooth Preferences…
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <button
          aria-label="Control Center"
          onClick={() => setControlCenterOpen(!controlCenterOpen)}
          className="rounded p-1 hover:bg-white/10"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
        </button>
        <span className="flex items-center gap-1">
          {battery.charging ? <BatteryCharging className="h-4 w-4" /> : <BatteryFull className="h-4 w-4" />}
          {battery.level !== null ? `${battery.level}%` : "—"}
        </span>
        <span className="tabular-nums">{formatTime(clock.now, clock.locale)}</span>
      </div>
    </div>
  );
}

function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`h-6 w-11 rounded-full p-0.5 transition-colors ${on ? "bg-green-500" : "bg-white/25"}`}
    >
      <span className={`block h-5 w-5 rounded-full bg-white transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}
