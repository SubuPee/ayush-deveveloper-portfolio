import { useEffect, useState } from "react";
import type { AppId } from "@/os/registry";
import { useClock, useNetwork } from "@/os/hooks";
import { LiveWeather, type WeatherSnapshot } from "@/os/liveWeather";
import { BluetoothService } from "@/os/services";

type Live = {
  now: Date;
  locale: string;
  weather: WeatherSnapshot;
  online: boolean;
  strength: number; // 0..3 signal bars
  bluetooth: boolean;
};

/**
 * Realistic macOS-style app tiles drawn as SVG. Tiles that represent live data
 * (Weather, Calendar, Settings, Network, Bluetooth, Activity, Terminal) update
 * continuously while the session is running.
 */
export function AppGlyph({
  id,
  className,
  style,
}: {
  id: AppId | "trash";
  className?: string;
  style?: React.CSSProperties;
}) {
  const live = useLive();
  const build = GLYPHS[id] ?? GLYPHS["preview"]!;
  const G = build(live);
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} role="img" aria-hidden focusable="false">
      <defs>{G.defs}</defs>
      <rect x="0" y="0" width="64" height="64" rx="15" fill={G.bg} />
      {G.art}
      <rect x="0.5" y="0.5" width="63" height="63" rx="14.5" fill="url(#glyphGloss)" />
      <rect x="0.5" y="0.5" width="63" height="63" rx="14.5" fill="none" stroke="rgba(255,255,255,0.25)" />
    </svg>
  );
}

function useLive(): Live {
  const clock = useClock();
  const net = useNetwork();
  const [weather, setWeather] = useState<WeatherSnapshot>(LiveWeather.current);
  const [bluetooth, setBluetooth] = useState(false);

  useEffect(() => LiveWeather.subscribe(setWeather), []);
  useEffect(() => {
    let alive = true;
    void BluetoothService.available?.()
      ?.then((ok: boolean) => alive && setBluetooth(!!ok))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const type = net.effectiveType ?? "4g";
  const strength = !net.online ? 0 : type === "4g" ? 3 : type === "3g" ? 2 : 1;

  return {
    now: clock.now,
    locale: clock.locale,
    weather,
    online: net.online,
    strength,
    bluetooth,
  };
}

const gloss = (
  <linearGradient id="glyphGloss" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="rgba(255,255,255,0.32)" />
    <stop offset="45%" stopColor="rgba(255,255,255,0.05)" />
    <stop offset="100%" stopColor="rgba(0,0,0,0.06)" />
  </linearGradient>
);

const grad = (id: string, from: string, to: string) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor={from} />
    <stop offset="100%" stopColor={to} />
  </linearGradient>
);

type Glyph = { bg: string; defs: React.ReactNode; art: React.ReactNode };

const label = (text: string, y: number, size: number, fill: string, weight = 600) => (
  <text
    x="32"
    y={y}
    textAnchor="middle"
    fontSize={size}
    fontWeight={weight}
    fill={fill}
    fontFamily="system-ui, -apple-system, sans-serif"
  >
    {text}
  </text>
);

const GLYPHS: Record<string, (live: Live) => Glyph> = {
  finder: () => ({
    bg: "url(#gFinder)",
    defs: (
      <>
        {gloss}
        {grad("gFinder", "#54c6ff", "#1573f0")}
      </>
    ),
    art: (
      <>
        <path d="M32 6v52" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        <path d="M20 22v7M44 22v7" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M20 40c5 6 19 6 24 0" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      </>
    ),
  }),
  safari: (live) => ({
    bg: "url(#gSafari)",
    defs: (
      <>
        {gloss}
        {grad("gSafari", "#f4f7fb", "#cfd9e6")}
        <radialGradient id="gSafariDial" cx="0.5" cy="0.2">
          <stop offset="0%" stopColor="#3aa9ff" />
          <stop offset="100%" stopColor="#1d6fd0" />
        </radialGradient>
      </>
    ),
    art: (
      <>
        <circle cx="32" cy="32" r="22" fill="url(#gSafariDial)" />
        <circle cx="32" cy="32" r="22" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        {/* Needle sweeps with the seconds hand. */}
        <g transform={`rotate(${live.now.getSeconds() * 6} 32 32)`}>
          <path d="M42 22 30 30 22 42 34 34z" fill="#fff" />
          <path d="M42 22 30 30 34 34z" fill="#ff4b4b" />
        </g>
      </>
    ),
  }),
  terminal: (live) => ({
    bg: "url(#gTerm)",
    defs: (
      <>
        {gloss}
        {grad("gTerm", "#3a3f4a", "#12151b")}
      </>
    ),
    art: (
      <>
        <rect x="8" y="12" width="48" height="40" rx="6" fill="#0b0e13" />
        <rect x="8" y="12" width="48" height="9" rx="4.5" fill="#2b3140" />
        <path d="M16 30l7 6-7 6" stroke="#e7f7ea" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Blinking caret driven by the system clock. */}
        <rect
          x="28"
          y="34"
          width="14"
          height="4"
          rx="1"
          fill="#e7f7ea"
          opacity={live.now.getSeconds() % 2 === 0 ? 1 : 0.25}
        />
      </>
    ),
  }),
  photos: () => ({
    bg: "#ffffff",
    defs: <>{gloss}</>,
    art: (
      <g transform="translate(32,32)">
        {["#f7b500", "#f7761f", "#ef3d4a", "#c341c8", "#4f6ff0", "#2ec5e8", "#37c26a"].map((c, i) => (
          <ellipse key={c} rx="7" ry="17" fill={c} opacity="0.82" transform={`rotate(${(i * 180) / 7})`} />
        ))}
      </g>
    ),
  }),
  mail: () => ({
    bg: "url(#gMail)",
    defs: (
      <>
        {gloss}
        {grad("gMail", "#5ec2ff", "#1d7dfb")}
      </>
    ),
    art: (
      <>
        <rect x="10" y="18" width="44" height="28" rx="5" fill="#fff" />
        <path d="M12 21l20 15 20-15" fill="none" stroke="#4f9ff5" strokeWidth="3" strokeLinejoin="round" />
      </>
    ),
  }),
  calendar: (live) => ({
    bg: "#ffffff",
    defs: <>{gloss}</>,
    art: (
      <>
        <rect x="0" y="0" width="64" height="17" rx="15" fill="#f5414f" />
        <rect x="0" y="10" width="64" height="8" fill="#f5414f" />
        {label(live.now.toLocaleDateString(live.locale, { weekday: "short" }).toUpperCase(), 13, 9, "#fff")}
        {label(String(live.now.getDate()), 50, 30, "#2b2b2f", 300)}
      </>
    ),
  }),
  weather: (live) => {
    const cond = (live.weather?.condition ?? "").toLowerCase();
    const hour = live.now.getHours();
    const night = hour < 6 || hour >= 19;
    const rain = /rain|drizzle|shower|thunder/.test(cond);
    const snow = /snow/.test(cond);
    const cloudy = /cloud|overcast|fog/.test(cond);
    return {
      bg: night ? "url(#gWeatherNight)" : "url(#gWeather)",
      defs: (
        <>
          {gloss}
          {grad("gWeather", "#4fb8ff", "#1668d8")}
          {grad("gWeatherNight", "#28407a", "#0d1733")}
        </>
      ),
      art: (
        <>
          {night ? (
            <path d="M31 12a13 13 0 1 0 14 16 10 10 0 0 1-14-16z" fill="#ffe9a8" />
          ) : (
            <circle cx="24" cy="23" r="9" fill="#ffd75e" />
          )}
          {(cloudy || rain || snow || !live.weather) && (
            <path d="M25 44a9 9 0 0 1 1-17 12 12 0 0 1 22 4 7 7 0 0 1-2 13z" fill="#fff" />
          )}
          {rain &&
            [0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${26 + i * 8} 48 l-2 6`}
                stroke="#bfe6ff"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            ))}
          {snow &&
            [0, 1, 2].map((i) => <circle key={i} cx={26 + i * 8} cy={51} r="2" fill="#eaf6ff" />)}
          {live.weather &&
            label(`${live.weather.temperature}°`, night ? 58 : 58, 15, night ? "#ffffff" : "#ffffff", 600)}
        </>
      ),
    };
  },
  settings: (live) => ({
    bg: "url(#gSet)",
    defs: (
      <>
        {gloss}
        {grad("gSet", "#9aa3ae", "#5b636e")}
      </>
    ),
    art: (
      <>
        {/* Gear turns one tooth per second — a live system pulse. */}
        <g fill="#e9edf2" transform={`rotate(${live.now.getSeconds() * 6} 32 32)`}>
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x="30" y="6" width="4" height="12" rx="2" transform={`rotate(${i * 45} 32 32)`} />
          ))}
        </g>
        <circle cx="32" cy="32" r="17" fill="#e9edf2" />
        <circle cx="32" cy="32" r="8" fill="#6b737e" />
      </>
    ),
  }),
  activity: (live) => {
    const s = live.now.getSeconds();
    const pts = Array.from({ length: 7 }).map((_, i) => {
      const v = 20 + Math.abs(Math.sin((s + i * 3) / 2.2)) * 18;
      return `${13 + i * 6},${Math.round(46 - (v - 20))}`;
    });
    return {
      bg: "url(#gAct)",
      defs: (
        <>
          {gloss}
          {grad("gAct", "#f4f6f9", "#d5dbe4")}
        </>
      ),
      art: (
        <>
          <rect x="9" y="14" width="46" height="36" rx="6" fill="#1f2430" />
          <polyline
            points={pts.join(" ")}
            fill="none"
            stroke="#3ddc84"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ),
    };
  },
  preview: () => ({
    bg: "url(#gPrev)",
    defs: (
      <>
        {gloss}
        {grad("gPrev", "#f6f8fb", "#cfd7e2")}
      </>
    ),
    art: (
      <>
        <path d="M18 8h20l10 10v38H18z" fill="#fff" stroke="#b9c3d1" strokeWidth="1.4" />
        <path d="M38 8v10h10" fill="#e3e9f1" />
        <path d="M23 28h18M23 35h18M23 42h12" stroke="#8e9bad" strokeWidth="2.4" strokeLinecap="round" />
      </>
    ),
  }),
  network: (live) => ({
    bg: live.online ? "url(#gNet)" : "url(#gNetOff)",
    defs: (
      <>
        {gloss}
        {grad("gNet", "#3ad0e8", "#0b86b8")}
        {grad("gNetOff", "#8b95a3", "#4b535e")}
      </>
    ),
    art: (
      <>
        <path
          d="M13 26a28 28 0 0 1 38 0"
          fill="none"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          opacity={live.strength >= 3 ? 1 : 0.3}
        />
        <path
          d="M20 34a18 18 0 0 1 24 0"
          fill="none"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          opacity={live.strength >= 2 ? 1 : 0.3}
        />
        <circle cx="32" cy="45" r="4" fill="#fff" opacity={live.strength >= 1 ? 1 : 0.3} />
      </>
    ),
  }),
  bluetooth: (live) => ({
    bg: live.bluetooth ? "url(#gBt)" : "url(#gBtOff)",
    defs: (
      <>
        {gloss}
        {grad("gBt", "#5aa8ff", "#1b53d6")}
        {grad("gBtOff", "#8b95a3", "#4b535e")}
      </>
    ),
    art: (
      <path
        d="M28 20l10 8-14 12 14-12-10-8v24l10-8-14-12"
        fill="none"
        stroke="#fff"
        strokeWidth="3.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ),
  }),
  sysinfo: (live) => ({
    bg: "url(#gInfo)",
    defs: (
      <>
        {gloss}
        {grad("gInfo", "#e9edf3", "#b9c2ce")}
      </>
    ),
    art: (
      <>
        <rect x="10" y="14" width="44" height="28" rx="4" fill="#2a3040" />
        <rect x="14" y="18" width="36" height="20" rx="2" fill="#5fa8ff" opacity="0.85" />
        <text
          x="32"
          y="32"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill="#0d2547"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {live.now.toLocaleTimeString(live.locale, { hour: "2-digit", minute: "2-digit" })}
        </text>
        <path d="M22 48h20l3 5H19z" fill="#9aa5b4" />
      </>
    ),
  }),
  music: () => ({
    bg: "#0d0d0d",
    defs: <>{gloss}</>,
    art: (
      <>
        <circle cx="32" cy="32" r="23" fill="#1ed760" />
        <g stroke="#0b0b0b" strokeLinecap="round" fill="none">
          <path d="M21 26c8-2.4 17-1.6 24 2.2" strokeWidth="4" />
          <path d="M22.5 33.4c6.6-2 14-1.3 19.8 1.9" strokeWidth="3.4" />
          <path d="M24 40.2c5.2-1.6 11-1 15.6 1.5" strokeWidth="2.8" />
        </g>
      </>
    ),
  }),
  camera: () => ({
    bg: "url(#gCam)",
    defs: (
      <>
        {gloss}
        {grad("gCam", "#f3f4f6", "#9ca3af")}
      </>
    ),
    art: (
      <>
        <rect x="12" y="18" width="40" height="30" rx="8" fill="#1b1d21" />
        <circle cx="32" cy="33" r="10.5" fill="#0b0c0e" />
        <circle cx="32" cy="33" r="7.5" fill="#2b2f36" />
        <circle cx="29" cy="30" r="2.6" fill="rgba(255,255,255,0.75)" />
        <circle cx="45" cy="24" r="1.9" fill="#f6c344" />
      </>
    ),
  }),
  contacts: () => ({
    bg: "url(#gCon)",
    defs: (
      <>
        {gloss}
        {grad("gCon", "#e0b177", "#a9713a")}
      </>
    ),
    art: (
      <>
        <rect x="12" y="12" width="34" height="40" rx="7" fill="rgba(255,255,255,0.22)" />
        <circle cx="29" cy="27" r="7" fill="rgba(255,255,255,0.9)" />
        <path d="M17 46c2-7 7.5-10.5 12-10.5S39 39 41 46z" fill="rgba(255,255,255,0.9)" />
        <g fill="#e2554f">
          <rect x="46" y="18" width="6" height="6" rx="2" />
          <rect x="46" y="29" width="6" height="6" rx="2" fill="#f5a524" />
          <rect x="46" y="40" width="6" height="6" rx="2" fill="#4a9df0" />
        </g>
      </>
    ),
  }),
  trash: () => ({
    bg: "rgba(255,255,255,0.16)",
    defs: <>{gloss}</>,
    art: (
      <>
        <path d="M20 22h24l-2.5 28a4 4 0 0 1-4 3.6H26.5a4 4 0 0 1-4-3.6z" fill="rgba(255,255,255,0.85)" />
        <path d="M17 19h30M27 19v-3h10v3" stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round" fill="none" />
      </>
    ),
  }),
};
