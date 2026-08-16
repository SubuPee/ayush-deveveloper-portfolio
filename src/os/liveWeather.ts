import { bus } from "./bus";
import { WeatherService, type Weather } from "./services";

const CACHE_KEY = "ayush-os.weather.cache.v1";

type Snapshot = { temperature: number; condition: string; place: string; at: number } | null;

let snapshot: Snapshot = null;
let started = false;
const subs = new Set<(s: Snapshot) => void>();

function publish(next: Snapshot) {
  snapshot = next;
  subs.forEach((fn) => fn(next));
}

function fromWeather(w: Weather): Snapshot {
  return { temperature: w.temperature, condition: w.condition, place: w.place, at: Date.now() };
}

async function refresh() {
  try {
    // Coarse, permission-free location so tiles can show live conditions immediately.
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return;
    const geo = (await res.json()) as { latitude?: number; longitude?: number };
    if (typeof geo.latitude !== "number" || typeof geo.longitude !== "number") return;
    const w = await WeatherService.fetch({ latitude: geo.latitude, longitude: geo.longitude });
    const snap = fromWeather(w);
    publish(snap);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(snap));
    } catch {
      /* ignore */
    }
  } catch {
    /* offline or blocked — tiles fall back to a day/night glyph */
  }
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) publish(JSON.parse(raw) as Snapshot);
  } catch {
    /* ignore */
  }
  bus.on("WEATHER_UPDATED", (payload) => {
    const w = payload as Weather | undefined;
    if (w?.condition) {
      const snap = fromWeather(w);
      publish(snap);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(snap));
      } catch {
        /* ignore */
      }
    }
  });
  void refresh();
  window.setInterval(() => void refresh(), 15 * 60 * 1000);
}

export const LiveWeather = {
  get current() {
    return snapshot;
  },
  subscribe(fn: (s: Snapshot) => void) {
    start();
    subs.add(fn);
    fn(snapshot);
    return () => {
      subs.delete(fn);
    };
  },
};

export type WeatherSnapshot = Snapshot;
