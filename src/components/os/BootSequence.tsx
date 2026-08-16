import bootLogo from "../../assets/boot-logo.png";
import helloVideo from "../../assets/hello.mp4";
import { useEffect, useMemo, useRef, useState } from "react";
import { playBootChime, playBootLoadingSound } from "@/os/bootSound";
import { useOS } from "@/os/store";

/* ------------------------------------------------------------------ *
 * Startup state machine: BOOT → HELLO → WELCOME → DESKTOP
 * ------------------------------------------------------------------ */

export type BootPhase = "BOOT" | "HELLO" | "WELCOME" | "DESKTOP";
export type BootState = "INITIALIZING" | "LOADING" | "READY" | "COMPLETED";

const SPEED: Record<string, number> = { slow: 1.5, normal: 1, fast: 0.6 };
const HELLO_LENGTH = 1600;

/** Waypoints the boot progress steps through (never linear). */
const WAYPOINTS = [0, 15, 32, 51, 68, 82, 94, 100];

function waypointProgress(t: number) {
  // t: 0..1 of the boot timeline → percentage following the waypoint curve.
  const segments = WAYPOINTS.length - 1;
  const scaled = Math.min(0.999999, Math.max(0, t)) * segments;
  const i = Math.floor(scaled);
  const local = scaled - i;
  // smoothstep inside each segment: accelerate, settle, accelerate again.
  const eased = local * local * (3 - 2 * local);
  return WAYPOINTS[i]! + (WAYPOINTS[i + 1]! - WAYPOINTS[i]!) * eased;
}

function stateFor(pct: number): BootState {
  if (pct >= 100) return "COMPLETED";
  if (pct >= 85) return "READY";
  if (pct >= 20) return "LOADING";
  return "INITIALIZING";
}

/** BootManager — owns the whole startup timeline. */
export function BootSequence({ onFinish }: { onFinish: () => void }) {
  const { settings } = useOS();
  const [phase, setPhase] = useState<BootPhase>("BOOT");
  const [progress, setProgress] = useState(0);
  const [bootExiting, setBootExiting] = useState(false);
  const finished = useRef(false);

  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const reduced = settings.reduceMotion || !!prefersReduced;
  const speed = reduced ? 0.3 : (SPEED[settings.bootSpeed] ?? 1);
  const bootSoundRef = useRef<(() => void) | null>(null);

  const timing = useMemo(
    () => ({
      boot: 2300 * speed,
      hold: 400 * speed,
      fade: 520 * speed,
      hello: 4000 * speed,
      welcome: 1600 * speed,
    }),
    [speed],
  );

  // Startup chime — once, unless muted.
  useEffect(() => {
    if (!settings.bootSound || reduced) return;
    const stop = playBootChime();
    return () => stop?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Boot loading sound — during BOOT phase
  useEffect(() => {
    if (phase !== "BOOT" || !settings.bootSound || reduced) return;
    
    console.log("[Boot] Starting boot sound for", timing.boot, "ms");
    const stop = playBootLoadingSound(timing.boot);
    bootSoundRef.current = stop;
    
    return () => {
      console.log("[Boot] Stopping boot sound");
      bootSoundRef.current?.();
      bootSoundRef.current = null;
    };
  }, [phase, timing.boot, settings.bootSound, reduced]);

  // Lock the page down for the whole startup: no scrollbars, no white flash.
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, []);

  // BOOT: progress driven by the boot-state sequence.
  useEffect(() => {
    if (phase !== "BOOT") return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / timing.boot);
      setProgress(waypointProgress(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const hold = window.setTimeout(() => setBootExiting(true), timing.boot + timing.hold);
    const next = window.setTimeout(() => setPhase("HELLO"), timing.boot + timing.hold + timing.fade);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hold);
      window.clearTimeout(next);
    };
  }, [phase, timing]);

  // HELLO → WELCOME → DESKTOP
  useEffect(() => {
    if (phase !== "HELLO") return;
    const t = window.setTimeout(() => setPhase("WELCOME"), timing.hello + 300 * speed);
    return () => window.clearTimeout(t);
  }, [phase, timing, speed]);

  useEffect(() => {
    if (phase !== "WELCOME") return;
    const t = window.setTimeout(() => {
      if (finished.current) return;
      finished.current = true;
      setPhase("DESKTOP");
      onFinish();
    }, timing.welcome);
    return () => window.clearTimeout(t);
  }, [phase, timing, onFinish]);

  if (phase === "DESKTOP") return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black text-white">
      {phase === "BOOT" && (
        <BootScreen progress={progress} state={stateFor(progress)} exiting={bootExiting} reduced={reduced} />
      )}
      {phase === "HELLO" && <HelloScreen duration={timing.hello} reduced={reduced} />}
      {phase === "WELCOME" && <WelcomeScreen reduced={reduced} />}
    </div>
  );
}

/* ------------------------------- Boot ------------------------------- */

function BootScreen({
  progress,
  state,
  exiting,
  reduced,
}: {
  progress: number;
  state: BootState;
  exiting: boolean;
  reduced: boolean;
}) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center bg-black transition-opacity duration-500 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label={`Starting Ayush World — ${state.toLowerCase()} ${Math.round(progress)}%`}
    >
      {/* logo sits slightly above centre, like a real startup screen */}
      <div className="flex flex-col items-center -translate-y-[6vh]">
        <BootLogo reduced={reduced} />
        <BootProgress value={progress} />
      </div>
    </div>
  );
}

function BootLogo({ reduced }: { reduced: boolean }) {
  return (
    <div className={reduced ? "" : "boot-logo-in"}>
      <img
        src={bootLogo}
        alt="Ayush World"
        className="h-20 w-20 select-none object-contain sm:h-24 sm:w-24 md:h-28 md:w-28"
        draggable={false}
      />
    </div>
  );
}

function BootProgress({ value }: { value: number }) {
  return (
    <div className="mt-12 h-[5px] w-[220px] overflow-hidden rounded-full bg-white/15 sm:w-[280px] md:w-[320px]">
      <div
        className="h-full w-full origin-left rounded-full bg-white/90"
        style={{ transform: `scaleX(${value / 100})`, willChange: "transform" }}
      />
    </div>
  );
}

/* ------------------------------ Hello ------------------------------- */

function HelloScreen({ duration, reduced }: { duration: number; reduced: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || reduced) return;
    videoRef.current.play();
  }, [reduced]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <video
        ref={videoRef}
        src={helloVideo}
        className="w-[min(84vw,660px)]"
        muted
        playsInline
      />
    </div>
  );
}

/* ----------------------------- Welcome ------------------------------ */

function WelcomeScreen({ reduced }: { reduced: boolean }) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-black px-6 text-center ${
        reduced ? "" : "welcome-in"
      }`}
    >
      <AyushMark className="mb-4 h-12 w-12 opacity-80 sm:h-14 sm:w-14" />
      <h1 className="text-2xl font-light tracking-tight sm:text-4xl md:text-5xl">Welcome to Ayush World</h1>
      <p className="text-xs text-white/50 sm:text-sm">An interactive developer portfolio</p>
    </div>
  );
}

/** Original Ayush World mark — an orbiting "A" glyph. */
export function AyushMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-label="Ayush World" role="img">
      <defs>
        <linearGradient id="awg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9ae6d0" />
          <stop offset="100%" stopColor="#7aa7ff" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="38" fill="none" stroke="url(#awg)" strokeWidth="2" opacity="0.5" />
      <ellipse cx="50" cy="50" rx="38" ry="15" fill="none" stroke="url(#awg)" strokeWidth="1.4" opacity="0.35" />
      <path d="M32 68 L50 26 L68 68" fill="none" stroke="url(#awg)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 55 H60" stroke="url(#awg)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function HelloScript({ progress }: { progress: number }) {
  // This function is no longer used - replaced with video
  return null;
}
