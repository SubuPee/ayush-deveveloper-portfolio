import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { bus } from "./bus";
import { applications, type AppId } from "./registry";

export type WindowState = {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  params?: Record<string, string> | undefined;
};

export type WidgetId = "clock" | "weather" | "calendar";
export type WidgetState = { x: number; y: number; width: number; height: number; visible: boolean };

export type BootSpeed = "slow" | "normal" | "fast";

export type Settings = {
  theme: "dark" | "light" | "auto";
  wallpaper: string;
  dockPosition: "bottom" | "left" | "right";
  dockSize: number;
  dockMagnification: boolean;
  reduceMotion: boolean;
  bootSpeed: BootSpeed;
  bootSound: boolean;
  widgets: Record<WidgetId, WidgetState>;
};

const defaultSettings: Settings = {
  theme: "dark",
  wallpaper: "silk",
  dockPosition: "bottom",
  dockSize: 52,
  dockMagnification: true,
  reduceMotion: false,
  bootSpeed: "normal",
  bootSound: true,
  widgets: {
    clock: { x: 360, y: 90, width: 260, height: 260, visible: true },
    weather: { x: 980, y: 60, width: 250, height: 150, visible: true },
    calendar: { x: 980, y: 230, width: 250, height: 230, visible: true },
  },
};

const SETTINGS_KEY = "ayush-os.settings.v3";
const WINDOWS_KEY = "ayush-os.windows.v1";
const RECENT_KEY = "ayush-os.recents.v1";

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as object) } as T;
  } catch {
    return fallback;
  }
}

type OSContextValue = {
  windows: WindowState[];
  activeWindowId: string | null;
  activeApp: AppId | null;
  settings: Settings;
  recentApps: AppId[];
  recentSearches: string[];
  spotlightOpen: boolean;
  controlCenterOpen: boolean;
  resolvedTheme: "dark" | "light";
  openApp: (appId: AppId, params?: Record<string, string>, title?: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, w: number, h: number, x?: number, y?: number) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  updateWidget: (id: WidgetId, patch: Partial<WidgetState>) => void;
  setSpotlightOpen: (v: boolean) => void;
  setControlCenterOpen: (v: boolean) => void;
  addRecentSearch: (q: string) => void;
};

const OSContext = createContext<OSContextValue | null>(null);

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used inside OSProvider");
  return ctx;
}

export function OSProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [recentApps, setRecentApps] = useState<AppId[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [systemDark, setSystemDark] = useState(true);
  const zRef = useRef(30);

  // Hydrate persisted state on the client only.
  useEffect(() => {
    setSettings(load<Settings>(SETTINGS_KEY, defaultSettings));
    try {
      const raw = localStorage.getItem(WINDOWS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as WindowState[];
        const valid = saved.filter((w) => applications[w.appId]);
        setWindows(valid);
        zRef.current = valid.reduce((m, w) => Math.max(m, w.z), 30);
      }
      const recents = localStorage.getItem(RECENT_KEY);
      if (recents) {
        const parsed = JSON.parse(recents) as { apps: AppId[]; searches: string[] };
        setRecentApps(parsed.apps ?? []);
        setRecentSearches(parsed.searches ?? []);
      }
    } catch {
      /* ignore corrupt state */
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const onChange = () => setSystemDark(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem(WINDOWS_KEY, JSON.stringify(windows));
  }, [windows]);
  useEffect(() => {
    localStorage.setItem(RECENT_KEY, JSON.stringify({ apps: recentApps, searches: recentSearches }));
  }, [recentApps, recentSearches]);

  const resolvedTheme: "dark" | "light" =
    settings.theme === "auto" ? (systemDark ? "dark" : "light") : settings.theme;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    document.documentElement.dataset["reduceMotion"] = settings.reduceMotion ? "true" : "false";
    bus.emit("THEME_CHANGED", resolvedTheme);
  }, [resolvedTheme, settings.reduceMotion]);

  const focusWindow = useCallback((id: string) => {
    zRef.current += 1;
    const z = zRef.current;
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)));
    setActiveWindowId(id);
  }, []);

  const openApp = useCallback(
    (appId: AppId, params?: Record<string, string>, title?: string) => {
      const def = applications[appId];
      setRecentApps((r) => [appId, ...r.filter((a) => a !== appId)].slice(0, 8));
      setWindows((ws) => {
        const existing = ws.find((w) => w.appId === appId);
        zRef.current += 1;
        if (existing) {
          const updated = ws.map((w) =>
            w.id === existing.id
              ? {
                  ...w,
                  z: zRef.current,
                  minimized: false,
                  params: params ?? w.params,
                  title: title ?? w.title,
                }
              : w,
          );
          setActiveWindowId(existing.id);
          return updated;
        }
        const id = `${appId}-${Date.now()}`;
        const offset = ws.length * 26;
        const maxW = typeof window !== "undefined" ? window.innerWidth : 1280;
        const maxH = typeof window !== "undefined" ? window.innerHeight : 800;
        const width = Math.min(def.defaultSize.width, maxW - 80);
        const height = Math.min(def.defaultSize.height, maxH - 140);
        const win: WindowState = {
          id,
          appId,
          title: title ?? def.name,
          x: Math.max(20, Math.min((maxW - width) / 2 + offset - 60, maxW - width - 20)),
          y: Math.max(40, Math.min(70 + offset, maxH - height - 90)),
          width,
          height,
          z: zRef.current,
          minimized: false,
          maximized: false,
          ...(params ? { params } : {}),
        };
        setActiveWindowId(id);
        bus.emit("WINDOW_OPENED", win);
        bus.emit("APP_LAUNCHED", appId);
        return [...ws, win];
      });
    },
    [],
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
    setActiveWindowId((cur) => (cur === id ? null : cur));
    bus.emit("WINDOW_CLOSED", id);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
    setActiveWindowId((cur) => (cur === id ? null : cur));
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)));
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resizeWindow = useCallback((id: string, width: number, height: number, x?: number, y?: number) => {
    setWindows((ws) =>
      ws.map((w) =>
        w.id === id ? { ...w, width, height, x: x ?? w.x, y: y ?? w.y } : w,
      ),
    );
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const updateWidget = useCallback((id: WidgetId, patch: Partial<WidgetState>) => {
    setSettings((s) => ({ ...s, widgets: { ...s.widgets, [id]: { ...s.widgets[id], ...patch } } }));
    bus.emit("WIDGET_MOVED", { id, patch });
  }, []);

  const addRecentSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setRecentSearches((r) => [q, ...r.filter((s) => s !== q)].slice(0, 6));
  }, []);

  const activeApp = useMemo(() => {
    const win = windows.find((w) => w.id === activeWindowId);
    return win ? win.appId : null;
  }, [windows, activeWindowId]);

  const value: OSContextValue = {
    windows,
    activeWindowId,
    activeApp,
    settings,
    recentApps,
    recentSearches,
    spotlightOpen,
    controlCenterOpen,
    resolvedTheme,
    openApp,
    closeWindow,
    focusWindow,
    minimizeWindow,
    toggleMaximize,
    moveWindow,
    resizeWindow,
    updateSettings,
    updateWidget,
    setSpotlightOpen,
    setControlCenterOpen,
    addRecentSearch,
  };

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}
