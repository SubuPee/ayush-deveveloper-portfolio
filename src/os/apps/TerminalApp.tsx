import { useEffect, useRef, useState } from "react";
import type { AppProps } from "../registry";
import { useBattery, useClock, useNetwork } from "../hooks";
import { BluetoothService, DeviceService, formatDate } from "../services";
import { experience, profile, projects, skills } from "../data";

type Line = { id: number; text: string; kind: "in" | "out" };

const HELP = `Available commands:
  help        show this list
  clear       clear the screen
  whoami      identity
  about       profile summary
  skills      technical skills
  experience  work history
  projects    project list
  project <name>  project detail
  resume      resume summary
  github      github url
  linkedin    linkedin url
  contact     contact details
  battery     live battery status
  network     live network status
  bluetooth   bluetooth availability
  weather     weather hint
  date        current local date
  status      system overview
  neofetch    system banner`;

export default function TerminalApp(_props: AppProps) {
  const battery = useBattery();
  const network = useNetwork();
  const clock = useClock();
  const [lines, setLines] = useState<Line[]>([
    { id: 0, text: "Ayush World Terminal — type 'help' to begin.", kind: "out" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const idRef = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const push = (text: string, kind: Line["kind"] = "out") =>
    setLines((l) => [...l, { id: idRef.current++, text, kind }]);

  const run = async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    push(`$ ${cmd}`, "in");
    setHistory((h) => [cmd, ...h]);
    const [name, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ").toLowerCase();

    switch (name) {
      case "help":
        push(HELP);
        break;
      case "clear":
        setLines([]);
        break;
      case "whoami":
        push(`${profile.name}\n${profile.role}`);
        break;
      case "about":
        push(profile.summary);
        break;
      case "skills":
        push(skills.map((s) => s.name).join("\n"));
        break;
      case "experience":
        push(experience.map((e) => `${e.period}  ${e.role} @ ${e.company}`).join("\n"));
        break;
      case "projects":
        push(projects.map((p) => `${p.id.padEnd(20)} ${p.name}`).join("\n"));
        break;
      case "project": {
        const p = projects.find((x) => x.id === arg || x.name.toLowerCase() === arg);
        push(
          p
            ? `${p.name}\n${p.description}\nTech: ${p.tech.join(", ")}\nGitHub: ${p.github}\nLive: ${p.live}`
            : `project: '${arg}' not found. Try: ${projects.map((x) => x.id).join(", ")}`,
        );
        break;
      }
      case "resume":
        push(`${profile.name} — ${profile.role}\n${profile.summary}\nOpen Preview for the full resume.`);
        break;
      case "github":
        push(profile.github);
        break;
      case "linkedin":
        push(profile.linkedin);
        break;
      case "contact":
        push(`${profile.email}\n${profile.github}\n${profile.linkedin}`);
        break;
      case "battery":
        push(
          battery.support === "supported" && battery.level !== null
            ? `${battery.level}% — ${battery.charging ? "Charging" : "On battery"}`
            : "Battery: unavailable in this browser",
        );
        break;
      case "network":
        push(
          `${network.online ? "Online" : "Offline"}${
            network.effectiveType ? ` — ${network.effectiveType}, ~${network.downlink ?? "?"} Mb/s` : ""
          }`,
        );
        break;
      case "bluetooth": {
        const s = BluetoothService.support();
        if (s === "unsupported") push("Bluetooth: unavailable in this browser");
        else push(`Bluetooth: available — open the Bluetooth app and click Connect to grant access.`);
        break;
      }
      case "weather":
        push("Weather requires your location permission. Open the Weather app to enable it.");
        break;
      case "date":
        push(formatDate(clock.now, clock.locale));
        break;
      case "status": {
        const d = DeviceService.snapshot();
        push(
          [
            `Time      ${clock.now.toLocaleTimeString(clock.locale)}`,
            `Timezone  ${clock.timeZone}`,
            `Network   ${network.online ? "Online" : "Offline"}`,
            `Battery   ${battery.level !== null ? `${battery.level}%` : "unavailable"}`,
            `Browser   ${d.browser?.name ?? "—"}`,
            `Screen    ${d.screen ? `${d.screen.width} × ${d.screen.height}` : "—"}`,
          ].join("\n"),
        );
        break;
      }
      case "neofetch": {
        const d = DeviceService.snapshot();
        push(
          [
            "   ▄▄▄▄     ayush@ayush-world",
            "  █    █    -----------------",
            "  █▄▄▄▄█    OS       Ayush World 1.0",
            "  █    █    Shell    aysh",
            "  █    █    Browser  " + (d.browser?.name ?? "—"),
            `             Screen   ${d.screen ? `${d.screen.width}x${d.screen.height}` : "—"}`,
            `             Uptime   ${clock.now.toLocaleTimeString(clock.locale)}`,
            `             Skills   ${skills.length}`,
          ].join("\n"),
        );
        break;
      }
      default:
        push(`aysh: command not found: ${name}. Type 'help'.`);
    }
  };

  return (
    <div
      className="h-full overflow-auto bg-[#0b0f14] p-4 font-mono text-[13px] leading-relaxed text-emerald-200"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l) => (
        <pre key={l.id} className={`whitespace-pre-wrap ${l.kind === "in" ? "text-sky-300" : ""}`}>
          {l.text}
        </pre>
      ))}
      <div className="flex items-center gap-2">
        <span className="text-sky-300">$</span>
        <input
          ref={inputRef}
          value={input}
          autoFocus
          spellCheck={false}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void run(input);
              setInput("");
              setHistIdx(-1);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              const next = Math.min(histIdx + 1, history.length - 1);
              if (next >= 0) {
                setHistIdx(next);
                setInput(history[next] ?? "");
              }
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const next = histIdx - 1;
              setHistIdx(next);
              setInput(next >= 0 ? (history[next] ?? "") : "");
            }
          }}
          className="flex-1 bg-transparent outline-none"
          aria-label="Terminal input"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}
