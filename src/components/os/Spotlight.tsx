import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { appList, type AppId } from "@/os/registry";
import { useOS } from "@/os/store";
import { certifications, experience, profile, projects, skills } from "@/os/data";

type Result = {
  id: string;
  group: string;
  label: string;
  detail?: string;
  run: () => void;
};

export function Spotlight() {
  const { spotlightOpen, setSpotlightOpen, openApp, addRecentSearch, recentSearches } = useOS();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault();
        setSpotlightOpen(true);
      }
      if (e.key === "Escape") setSpotlightOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSpotlightOpen]);

  const all: Result[] = useMemo(() => {
    const open = (id: AppId, params?: Record<string, string>) => () => {
      openApp(id, params);
      setSpotlightOpen(false);
    };
    return [
      ...appList.map((a) => ({
        id: `app-${a.id}`,
        group: "Applications",
        label: a.name,
        detail: a.category,
        run: open(a.id),
      })),
      { id: "me", group: "Profile", label: profile.name, detail: profile.role, run: open("finder") },
      { id: "about", group: "Profile", label: "About Me", detail: profile.tagline, run: open("finder") },
      { id: "resume", group: "Profile", label: "Resume.pdf", detail: "Open in Preview", run: open("preview") },
      { id: "github", group: "Links", label: "GitHub", detail: profile.github, run: open("mail") },
      { id: "linkedin", group: "Links", label: "LinkedIn", detail: profile.linkedin, run: open("mail") },
      { id: "contact", group: "Links", label: "Contact", detail: profile.email, run: open("mail") },
      ...skills.map((s) => ({
        id: `skill-${s.name}`,
        group: "Skills",
        label: s.name,
        detail: s.group,
        run: open("finder"),
      })),
      ...projects.map((p) => ({
        id: `proj-${p.id}`,
        group: "Projects",
        label: p.name,
        detail: p.tech.join(", "),
        run: open("safari", { project: p.id }),
      })),
      ...experience.map((e) => ({
        id: `exp-${e.company}`,
        group: "Experience",
        label: `${e.role} · ${e.company}`,
        detail: e.period,
        run: open("finder"),
      })),
      ...certifications.map((c) => ({
        id: `cert-${c.name}`,
        group: "Certifications",
        label: c.name,
        detail: `${c.issuer} ${c.year}`,
        run: open("finder"),
      })),
      { id: "sys-battery", group: "System", label: "Battery", detail: "Live status", run: open("sysinfo") },
      { id: "sys-network", group: "System", label: "Network", detail: "Wi-Fi & internet", run: open("network") },
      { id: "sys-bt", group: "System", label: "Bluetooth", detail: "Devices", run: open("bluetooth") },
      { id: "sys-weather", group: "System", label: "Weather", detail: "Live forecast", run: open("weather") },
      { id: "sys-cal", group: "System", label: "Calendar", detail: "Dates", run: open("calendar") },
      { id: "sys-settings", group: "System", label: "Settings", detail: "Preferences", run: open("settings") },
      {
        id: "sys-info",
        group: "System",
        label: "System Information",
        detail: "Device & capabilities",
        run: open("sysinfo"),
      },
      { id: "sys-activity", group: "System", label: "Activity Monitor", detail: "Processes", run: open("activity") },
    ];
  }, [openApp, setSpotlightOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all.filter((r) => r.group === "Applications").slice(0, 8);
    return all
      .filter((r) => `${r.label} ${r.detail ?? ""} ${r.group}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query, all]);

  useEffect(() => setIndex(0), [query]);

  if (!spotlightOpen) return null;

  const grouped = results.reduce<Record<string, Result[]>>((acc, r) => {
    (acc[r.group] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-black/30 pt-[14vh] backdrop-blur-sm"
      onClick={() => setSpotlightOpen(false)}
    >
      <div
        className="w-[min(92vw,620px)] overflow-hidden rounded-2xl border border-white/20 bg-black/55 text-white backdrop-blur-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search className="h-4 w-4 text-white/60" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") setIndex((i) => Math.min(i + 1, results.length - 1));
              if (e.key === "ArrowUp") setIndex((i) => Math.max(i - 1, 0));
              if (e.key === "Enter") {
                const r = results[index];
                if (r) {
                  addRecentSearch(query);
                  r.run();
                }
              }
            }}
            placeholder="Search Ayush World"
            className="flex-1 bg-transparent text-base outline-none placeholder:text-white/40"
          />
        </div>

        <div className="max-h-[52vh] overflow-auto p-2">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-white/60">No results for “{query}”.</p>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="mb-2">
                <p className="px-3 py-1 text-[10px] uppercase tracking-widest text-white/40">{group}</p>
                {items.map((r) => {
                  const i = results.indexOf(r);
                  return (
                    <button
                      key={r.id}
                      onMouseEnter={() => setIndex(i)}
                      onClick={() => {
                        addRecentSearch(query);
                        r.run();
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                        i === index ? "bg-white/15" : "hover:bg-white/10"
                      }`}
                    >
                      <span>{r.label}</span>
                      <span className="truncate pl-4 text-xs text-white/50">{r.detail}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
          {!query && recentSearches.length ? (
            <div className="border-t border-white/10 px-3 py-2 text-[11px] text-white/40">
              Recent: {recentSearches.join(" · ")}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
