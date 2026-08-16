import { useState } from "react";
import {
  Briefcase,
  Award,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import { useOS } from "../store";
import type { AppProps } from "../registry";
import { certifications, experience, profile, projects, skills } from "../data";
import { Section } from "./ui";

type Item = { id: string; label: string; icon: typeof User; open: () => void };

export default function FinderApp(_props: AppProps) {
  const { openApp } = useOS();
  const [selected, setSelected] = useState("about");

  const items: Item[] = [
    { id: "about", label: "About Me", icon: User, open: () => setSelected("about") },
    { id: "experience", label: "Experience", icon: Briefcase, open: () => setSelected("experience") },
    { id: "skills", label: "Skills", icon: Sparkles, open: () => setSelected("skills") },
    { id: "projects", label: "Projects", icon: FolderOpen, open: () => openApp("safari") },
    { id: "resume", label: "Resume.pdf", icon: FileText, open: () => openApp("preview") },
    { id: "certifications", label: "Certifications", icon: Award, open: () => setSelected("certifications") },
    { id: "photos", label: "Photos", icon: ImageIcon, open: () => openApp("photos") },
    { id: "contact", label: "Contact", icon: Mail, open: () => openApp("mail") },
  ];

  return (
    <div className="flex h-full">
      <aside className="hidden w-48 shrink-0 border-r border-border/60 bg-muted/40 p-3 sm:block">
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Ayush World
        </p>
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setSelected(it.id)}
            onDoubleClick={it.open}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
              selected === it.id ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <it.icon className="h-4 w-4" />
            {it.label}
          </button>
        ))}
      </aside>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-3 gap-3 border-b border-border/60 p-4 sm:grid-cols-4">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => setSelected(it.id)}
              onDoubleClick={it.open}
              className={`flex flex-col items-center gap-1.5 rounded-lg p-3 text-center transition-colors ${
                selected === it.id ? "bg-primary/15" : "hover:bg-muted"
              }`}
              title="Double-click to open"
            >
              <it.icon className="h-8 w-8 text-primary" />
              <span className="text-[11px] leading-tight">{it.label}</span>
            </button>
          ))}
        </div>

        <div className="p-5 text-sm">
          <FinderDetail id={selected} />
        </div>
      </div>
    </div>
  );
}

function FinderDetail({ id }: { id: string }) {
  if (id === "experience")
    return (
      <Section title="Experience">
        {experience.map((e) => (
          <div key={e.company} className="mb-4 rounded-lg border border-border/60 p-4">
            <p className="font-semibold">
              {e.role} · {e.company}
            </p>
            <p className="text-xs text-muted-foreground">
              {e.period} — {e.location}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              {e.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>
    );

  if (id === "skills")
    return (
      <Section title="Skills">
        <div className="grid gap-3 sm:grid-cols-2">
          {skills.map((s) => (
            <div key={s.name}>
              <div className="flex justify-between text-xs">
                <span>{s.name}</span>
                <span className="text-muted-foreground">{s.group}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${s.level}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Section>
    );

  if (id === "certifications")
    return (
      <Section title="Certifications">
        {certifications.map((c) => (
          <div key={c.name} className="flex justify-between border-b border-border/60 py-2">
            <span>{c.name}</span>
            <span className="text-muted-foreground">
              {c.issuer} · {c.year}
            </span>
          </div>
        ))}
      </Section>
    );

  if (id === "projects")
    return (
      <Section title="Projects">
        <p className="text-muted-foreground">Double-click Projects to browse them in Safari.</p>
        <ul className="mt-2 list-disc pl-5">
          {projects.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      </Section>
    );

  return (
    <Section title="About Me">
      <img
        src={profile.avatar}
        alt={`${profile.name} profile picture`}
        className="mb-4 h-24 w-24 rounded-full object-cover shadow-lg ring-2 ring-border"
      />
      <p className="text-base font-semibold">{profile.name}</p>
      <p className="text-muted-foreground">
        {profile.role} · {profile.location}
      </p>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{profile.summary}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
        {profile.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </Section>
  );
}
