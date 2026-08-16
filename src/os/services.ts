// Device services. Real browser APIs only — never fabricated values.
import { bus } from "./bus";

export type Support = "supported" | "unsupported" | "permission-required" | "unknown";

/* ---------------- Clock ---------------- */
export type ClockState = { now: Date; timeZone: string; locale: string };

class Clock {
  private timer: ReturnType<typeof setInterval> | null = null;
  state: ClockState = {
    now: new Date(),
    timeZone: "UTC",
    locale: "en-US",
  };
  private subs = new Set<(s: ClockState) => void>();

  start() {
    if (typeof window === "undefined" || this.timer) return;
    const res = Intl.DateTimeFormat().resolvedOptions();
    this.state = { now: new Date(), timeZone: res.timeZone, locale: res.locale };
    this.timer = setInterval(() => {
      this.state = { ...this.state, now: new Date() };
      this.subs.forEach((s) => s(this.state));
      bus.emit("TIME_CHANGED", this.state.now);
    }, 1000);
  }
  subscribe(fn: (s: ClockState) => void) {
    this.start();
    this.subs.add(fn);
    fn(this.state);
    return () => {
      this.subs.delete(fn);
    };
  }
}
export const ClockService = new Clock();

export function formatTime(d: Date, locale: string) {
  return d.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
}
export function formatDate(d: Date, locale: string) {
  return d.toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

/* ---------------- Battery ---------------- */
export type BatteryState = { support: Support; level: number | null; charging: boolean | null };

type BatteryManagerLike = EventTarget & { level: number; charging: boolean };

class Battery {
  state: BatteryState = { support: "unknown", level: null, charging: null };
  private subs = new Set<(s: BatteryState) => void>();
  private started = false;

  async start() {
    if (this.started || typeof navigator === "undefined") return;
    this.started = true;
    const getBattery = (navigator as unknown as { getBattery?: () => Promise<BatteryManagerLike> }).getBattery;
    if (!getBattery) {
      this.set({ support: "unsupported", level: null, charging: null });
      return;
    }
    try {
      const b = await getBattery.call(navigator);
      const read = () => {
        this.set({ support: "supported", level: Math.round(b.level * 100), charging: b.charging });
      };
      read();
      b.addEventListener("levelchange", () => {
        read();
        bus.emit("BATTERY_CHANGED", this.state);
      });
      b.addEventListener("chargingchange", () => {
        read();
        bus.emit("CHARGING_CHANGED", this.state);
      });
    } catch {
      this.set({ support: "unsupported", level: null, charging: null });
    }
  }
  private set(s: BatteryState) {
    this.state = s;
    this.subs.forEach((fn) => fn(s));
    bus.emit("BATTERY_CHANGED", s);
  }
  subscribe(fn: (s: BatteryState) => void) {
    void this.start();
    this.subs.add(fn);
    fn(this.state);
    return () => {
      this.subs.delete(fn);
    };
  }
}
export const BatteryService = new Battery();

/* ---------------- Network ---------------- */
export type NetworkState = {
  online: boolean;
  effectiveType: string | null;
  downlink: number | null;
  rtt: number | null;
  saveData: boolean | null;
  infoSupport: Support;
};

type ConnectionLike = EventTarget & {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
};

class Network {
  state: NetworkState = {
    online: true,
    effectiveType: null,
    downlink: null,
    rtt: null,
    saveData: null,
    infoSupport: "unknown",
  };
  private subs = new Set<(s: NetworkState) => void>();
  private started = false;

  start() {
    if (this.started || typeof window === "undefined") return;
    this.started = true;
    const conn = (navigator as unknown as { connection?: ConnectionLike }).connection;
    const read = () => {
      this.state = {
        online: navigator.onLine,
        effectiveType: conn?.effectiveType ?? null,
        downlink: conn?.downlink ?? null,
        rtt: conn?.rtt ?? null,
        saveData: conn?.saveData ?? null,
        infoSupport: conn ? "supported" : "unsupported",
      };
      this.subs.forEach((fn) => fn(this.state));
    };
    read();
    window.addEventListener("online", () => {
      read();
      bus.emit("ONLINE", this.state);
    });
    window.addEventListener("offline", () => {
      read();
      bus.emit("OFFLINE", this.state);
    });
    conn?.addEventListener("change", () => {
      read();
      bus.emit("NETWORK_CHANGED", this.state);
    });
  }
  subscribe(fn: (s: NetworkState) => void) {
    this.start();
    this.subs.add(fn);
    fn(this.state);
    return () => {
      this.subs.delete(fn);
    };
  }
}
export const NetworkService = new Network();

/* ---------------- Bluetooth ---------------- */
type BluetoothLike = {
  requestDevice: (o: unknown) => Promise<{ name?: string; id: string }>;
  getAvailability?: () => Promise<boolean>;
};

export const BluetoothService = {
  support(): Support {
    if (typeof navigator === "undefined") return "unknown";
    return (navigator as unknown as { bluetooth?: BluetoothLike }).bluetooth
      ? "permission-required"
      : "unsupported";
  },
  async available(): Promise<boolean> {
    const bt = (navigator as unknown as { bluetooth?: BluetoothLike }).bluetooth;
    if (!bt?.getAvailability) return false;
    try {
      return await bt.getAvailability();
    } catch {
      return false;
    }
  },
  async connect(): Promise<{ name: string; id: string }> {
    const bt = (navigator as unknown as { bluetooth?: BluetoothLike }).bluetooth;
    if (!bt) throw new Error("Web Bluetooth is unavailable in this browser");
    const device = await bt.requestDevice({ acceptAllDevices: true });
    const result = { name: device.name ?? "Unnamed device", id: device.id };
    bus.emit("BLUETOOTH_CONNECTED", result);
    return result;
  },
};

/* ---------------- Screen / Browser / Device ---------------- */
export const ScreenService = {
  info() {
    if (typeof window === "undefined") return null;
    return {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      pixelRatio: window.devicePixelRatio,
      colorDepth: window.screen.colorDepth,
      orientation: window.matchMedia("(orientation: portrait)").matches ? "Portrait" : "Landscape",
    };
  },
};

export const BrowserService = {
  info() {
    if (typeof navigator === "undefined") return null;
    const ua = navigator.userAgent;
    const name = /Edg\//.test(ua)
      ? "Edge"
      : /OPR\//.test(ua)
        ? "Opera"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Chrome\//.test(ua)
            ? "Chrome"
            : /Safari\//.test(ua)
              ? "Safari"
              : "Unknown";
    return {
      name,
      language: navigator.language,
      languages: navigator.languages?.join(", ") ?? navigator.language,
      platformHint: /Mobi|Android|iPhone|iPad/.test(ua) ? "Mobile" : "Desktop",
      cookiesEnabled: navigator.cookieEnabled,
      hardwareConcurrency:
        typeof navigator.hardwareConcurrency === "number" ? navigator.hardwareConcurrency : null,
      userAgent: ua,
    };
  },
};

export const DeviceService = {
  snapshot() {
    return {
      screen: ScreenService.info(),
      browser: BrowserService.info(),
      timeZone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "—",
      online: typeof navigator !== "undefined" ? navigator.onLine : null,
    };
  },
};

/* ---------------- Permissions / Capabilities ---------------- */
export const PermissionService = {
  async query(name: string): Promise<string> {
    if (typeof navigator === "undefined" || !navigator.permissions) return "unknown";
    try {
      const res = await navigator.permissions.query({ name: name as PermissionName });
      return res.state;
    } catch {
      return "unknown";
    }
  },
};

export const CapabilityService = {
  list(): { name: string; status: Support; note?: string }[] {
    if (typeof navigator === "undefined") return [];
    const has = (v: unknown): Support => (v ? "supported" : "unsupported");
    const n = navigator as unknown as Record<string, unknown>;
    return [
      { name: "Battery Status API", status: has(n['getBattery']) },
      { name: "Web Bluetooth", status: BluetoothService.support(), note: "Requires explicit user action" },
      { name: "Network Information API", status: has(n['connection']) },
      {
        name: "Geolocation",
        status: n['geolocation'] ? "permission-required" : "unsupported",
        note: "Permission required",
      },
      {
        name: "Notifications",
        status: typeof window !== "undefined" && "Notification" in window ? "permission-required" : "unsupported",
      },
      { name: "Screen Wake Lock", status: has(n['wakeLock']) },
      { name: "Clipboard API", status: has(n['clipboard']) },
      { name: "Share API", status: has(n['share']) },
      { name: "Storage (IndexedDB)", status: has(typeof indexedDB !== "undefined") },
      { name: "Service Worker", status: has(n['serviceWorker']) },
    ];
  },
};

/* ---------------- Location + Weather ---------------- */
export type Coords = { latitude: number; longitude: number };

export const LocationService = {
  supported() {
    return typeof navigator !== "undefined" && !!navigator.geolocation;
  },
  request(): Promise<Coords> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error("Geolocation unavailable"));
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          bus.emit("LOCATION_CHANGED", c);
          resolve(c);
        },
        (err) => reject(new Error(err.message)),
        { timeout: 15000, maximumAge: 300000 },
      );
    });
  },
};

export type Weather = {
  place: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  wind: number;
  sunrise: string;
  sunset: string;
  high: number;
  low: number;
  updated: Date;
  forecast: { day: string; high: number; low: number; condition: string }[];
};

const WMO: Record<number, string> = {
  0: "Clear",
  1: "Mostly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Heavy Drizzle",
  61: "Light Rain",
  63: "Rain",
  65: "Heavy Rain",
  71: "Light Snow",
  73: "Snow",
  75: "Heavy Snow",
  80: "Rain Showers",
  81: "Rain Showers",
  82: "Violent Showers",
  95: "Thunderstorm",
  96: "Thunderstorm w/ Hail",
  99: "Severe Thunderstorm",
};

export function conditionText(code: number) {
  return WMO[code] ?? "Unknown";
}

export const WeatherService = {
  async fetch(coords: Coords): Promise<Weather> {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=5`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather service unavailable");
    const data = await res.json();
    let place = `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`;
    try {
      const geo = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`,
      );
      if (geo.ok) {
        const g = await geo.json();
        place = g.city || g.locality || g.principalSubdivision || place;
      }
    } catch {
      /* keep coordinate label */
    }
    const days: string[] = data.daily.time;
    const weather: Weather = {
      place,
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      condition: conditionText(data.current.weather_code),
      humidity: data.current.relative_humidity_2m,
      wind: Math.round(data.current.wind_speed_10m),
      sunrise: new Date(data.daily.sunrise[0]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      sunset: new Date(data.daily.sunset[0]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      high: Math.round(data.daily.temperature_2m_max[0]),
      low: Math.round(data.daily.temperature_2m_min[0]),
      updated: new Date(),
      forecast: days.slice(0, 5).map((d, i) => ({
        day: new Date(d).toLocaleDateString([], { weekday: "short" }),
        high: Math.round(data.daily.temperature_2m_max[i]),
        low: Math.round(data.daily.temperature_2m_min[i]),
        condition: conditionText(data.daily.weather_code[i]),
      })),
    };
    bus.emit("WEATHER_UPDATED", weather);
    return weather;
  },
};
