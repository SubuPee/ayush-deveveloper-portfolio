import { lazy, type ComponentType } from "react";

export type AppId =
  | "finder"
  | "safari"
  | "terminal"
  | "photos"
  | "mail"
  | "calendar"
  | "weather"
  | "settings"
  | "activity"
  | "preview"
  | "network"
  | "bluetooth"
  | "sysinfo"
  | "music"
  | "camera"
  | "contacts";

export type AppProps = { windowId: string; params?: Record<string, string> | undefined };

export type AppDefinition = {
  id: AppId;
  name: string;
  icon: string; // lucide icon name
  color: string;
  category: "System" | "Portfolio" | "Utilities";
  defaultSize: { width: number; height: number };
  minimumSize: { width: number; height: number };
  keyboardShortcut?: string;
  menus: string[];
  component: ComponentType<AppProps>;
  inDock?: boolean;
};

// Applications are lazily loaded — nothing but the shell loads during boot.
export const applications: Record<AppId, AppDefinition> = {
  finder: {
    id: "finder",
    name: "Finder",
    icon: "FolderOpen",
    color: "linear-gradient(135deg,#38bdf8,#2563eb)",
    category: "System",
    defaultSize: { width: 820, height: 520 },
    minimumSize: { width: 480, height: 320 },
    menus: ["File", "Edit", "View", "Go", "Window", "Help"],
    component: lazy(() => import("./apps/FinderApp")),
    inDock: true,
  },
  safari: {
    id: "safari",
    name: "Safari",
    icon: "Compass",
    color: "linear-gradient(135deg,#60a5fa,#1d4ed8)",
    category: "Portfolio",
    defaultSize: { width: 900, height: 600 },
    minimumSize: { width: 520, height: 380 },
    menus: ["File", "Edit", "View", "History", "Bookmarks", "Window", "Help"],
    component: lazy(() => import("./apps/SafariApp")),
    inDock: true,
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    icon: "SquareTerminal",
    color: "linear-gradient(135deg,#1f2937,#0f172a)",
    category: "Utilities",
    defaultSize: { width: 720, height: 460 },
    minimumSize: { width: 420, height: 280 },
    menus: ["Shell", "Edit", "View", "Window", "Help"],
    component: lazy(() => import("./apps/TerminalApp")),
    inDock: true,
  },
  photos: {
    id: "photos",
    name: "Photos",
    icon: "Image",
    color: "linear-gradient(135deg,#fb7185,#f59e0b)",
    category: "Portfolio",
    defaultSize: { width: 800, height: 540 },
    minimumSize: { width: 420, height: 320 },
    menus: ["File", "Edit", "View", "Window", "Help"],
    component: lazy(() => import("./apps/PhotosApp")),
    inDock: true,
  },
  mail: {
    id: "mail",
    name: "Mail",
    icon: "Mail",
    color: "linear-gradient(135deg,#38bdf8,#6366f1)",
    category: "Portfolio",
    defaultSize: { width: 780, height: 560 },
    minimumSize: { width: 420, height: 360 },
    menus: ["File", "Edit", "View", "Mailbox", "Window", "Help"],
    component: lazy(() => import("./apps/MailApp")),
    inDock: true,
  },
  calendar: {
    id: "calendar",
    name: "Calendar",
    icon: "CalendarDays",
    color: "linear-gradient(135deg,#f87171,#ef4444)",
    category: "Utilities",
    defaultSize: { width: 720, height: 560 },
    minimumSize: { width: 420, height: 400 },
    menus: ["File", "Edit", "View", "Window", "Help"],
    component: lazy(() => import("./apps/CalendarApp")),
    inDock: true,
  },
  weather: {
    id: "weather",
    name: "Weather",
    icon: "CloudSun",
    color: "linear-gradient(135deg,#38bdf8,#0284c7)",
    category: "Utilities",
    defaultSize: { width: 640, height: 540 },
    minimumSize: { width: 380, height: 380 },
    menus: ["File", "View", "Window", "Help"],
    component: lazy(() => import("./apps/WeatherApp")),
    inDock: true,
  },
  settings: {
    id: "settings",
    name: "System Settings",
    icon: "Settings",
    color: "linear-gradient(135deg,#94a3b8,#475569)",
    category: "System",
    defaultSize: { width: 840, height: 560 },
    minimumSize: { width: 520, height: 400 },
    menus: ["Edit", "View", "Window", "Help"],
    component: lazy(() => import("./apps/SettingsApp")),
    inDock: true,
  },
  activity: {
    id: "activity",
    name: "Activity Monitor",
    icon: "Activity",
    color: "linear-gradient(135deg,#34d399,#059669)",
    category: "Utilities",
    defaultSize: { width: 760, height: 520 },
    minimumSize: { width: 440, height: 340 },
    menus: ["View", "Window", "Help"],
    component: lazy(() => import("./apps/ActivityMonitorApp")),
  },
  preview: {
    id: "preview",
    name: "Preview",
    icon: "FileText",
    color: "linear-gradient(135deg,#e2e8f0,#94a3b8)",
    category: "Portfolio",
    defaultSize: { width: 720, height: 640 },
    minimumSize: { width: 400, height: 380 },
    menus: ["File", "Edit", "View", "Window", "Help"],
    component: lazy(() => import("./apps/PreviewApp")),
  },
  network: {
    id: "network",
    name: "Network",
    icon: "Wifi",
    color: "linear-gradient(135deg,#22d3ee,#0891b2)",
    category: "System",
    defaultSize: { width: 620, height: 480 },
    minimumSize: { width: 380, height: 320 },
    menus: ["View", "Window", "Help"],
    component: lazy(() => import("./apps/NetworkApp")),
  },
  bluetooth: {
    id: "bluetooth",
    name: "Bluetooth",
    icon: "Bluetooth",
    color: "linear-gradient(135deg,#60a5fa,#2563eb)",
    category: "System",
    defaultSize: { width: 600, height: 460 },
    minimumSize: { width: 380, height: 320 },
    menus: ["View", "Window", "Help"],
    component: lazy(() => import("./apps/BluetoothApp")),
  },
  music: {
    id: "music",
    name: "Spotify",
    icon: "Music2",
    color: "linear-gradient(135deg,#1ed760,#0b7c37)",
    category: "Utilities",
    defaultSize: { width: 720, height: 520 },
    minimumSize: { width: 420, height: 340 },
    menus: ["File", "View", "Window", "Help"],
    component: lazy(() => import("./apps/MusicApp")),
    inDock: true,
  },
  camera: {
    id: "camera",
    name: "Camera",
    icon: "Camera",
    color: "linear-gradient(135deg,#e5e7eb,#6b7280)",
    category: "Utilities",
    defaultSize: { width: 700, height: 520 },
    minimumSize: { width: 400, height: 340 },
    menus: ["File", "View", "Window", "Help"],
    component: lazy(() => import("./apps/CameraApp")),
    inDock: true,
  },
  contacts: {
    id: "contacts",
    name: "Contacts",
    icon: "User",
    color: "linear-gradient(135deg,#d6a86a,#a9713a)",
    category: "Portfolio",
    defaultSize: { width: 760, height: 520 },
    minimumSize: { width: 420, height: 340 },
    menus: ["File", "Edit", "View", "Window", "Help"],
    component: lazy(() => import("./apps/ContactsApp")),
    inDock: true,
  },
  sysinfo: {
    id: "sysinfo",
    name: "System Information",
    icon: "Cpu",
    color: "linear-gradient(135deg,#a78bfa,#7c3aed)",
    category: "System",
    defaultSize: { width: 760, height: 560 },
    minimumSize: { width: 420, height: 360 },
    menus: ["View", "Window", "Help"],
    component: lazy(() => import("./apps/SystemInfoApp")),
  },
};

export const appList = Object.values(applications);
export const dockApps = appList.filter((a) => a.inDock);
