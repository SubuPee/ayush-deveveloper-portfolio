import { useState } from "react";
import { CloudSun, Droplets, Sunrise, Sunset, Wind } from "lucide-react";
import type { AppProps } from "../registry";
import { LocationService, WeatherService, type Weather } from "../services";
import { useClock } from "../hooks";
import { Row } from "./ui";

export default function WeatherApp(_props: AppProps) {
  const { locale } = useClock();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const enable = async () => {
    setStatus("loading");
    setError("");
    try {
      const coords = await LocationService.request();
      setWeather(await WeatherService.fetch(coords));
      setStatus("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load weather");
      setStatus("error");
    }
  };

  if (!weather)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-card p-8 text-center">
        <CloudSun className="h-10 w-10 text-primary" />
        <p className="text-sm font-medium">Location permission required</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Ayush World never accesses your location silently. Grant permission to load live conditions for your
          area.
        </p>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <button
          onClick={enable}
          disabled={status === "loading" || !LocationService.supported()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {status === "loading" ? "Locating…" : "Enable Location"}
        </button>
        {!LocationService.supported() ? (
          <p className="text-xs text-muted-foreground">Geolocation is unavailable in this browser.</p>
        ) : null}
      </div>
    );

  return (
    <div className="h-full overflow-auto bg-gradient-to-b from-sky-600/20 to-transparent p-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">{weather.place}</p>
        <p className="text-6xl font-extralight">{weather.temperature}°</p>
        <p className="text-sm">{weather.condition}</p>
        <p className="text-xs text-muted-foreground">
          H {weather.high}° · L {weather.low}° · Feels like {weather.feelsLike}°
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Droplets, label: "Humidity", value: `${weather.humidity}%` },
          { icon: Wind, label: "Wind", value: `${weather.wind} km/h` },
          { icon: Sunrise, label: "Sunrise", value: weather.sunrise },
          { icon: Sunset, label: "Sunset", value: weather.sunset },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
            <m.icon className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
            <p className="text-sm font-medium">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border/60 bg-card/60 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">5-day forecast</p>
        {weather.forecast.map((f) => (
          <Row key={f.day} label={`${f.day} · ${f.condition}`} value={`${f.high}° / ${f.low}°`} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Updated {weather.updated.toLocaleTimeString(locale)}</span>
        <button onClick={enable} className="rounded-md border border-border px-2 py-1 hover:bg-muted">
          Refresh
        </button>
      </div>
    </div>
  );
}
