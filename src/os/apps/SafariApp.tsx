import { useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Github, Lock, RotateCw } from "lucide-react";
import type { AppProps } from "../registry";
import { projects, type Project } from "../data";

export default function SafariApp({ params }: AppProps) {
  const initial = projects.find((p) => p.id === params?.["project"]) ?? null;
  const [current, setCurrent] = useState<Project | null>(initial);
  const [history, setHistory] = useState<Project[]>(initial ? [initial] : []);

  const openProject = (p: Project) => {
    setCurrent(p);
    setHistory((h) => [...h.filter((x) => x.id !== p.id), p]);
  };

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/50 px-3 py-2">
        <button
          className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-40"
          disabled={!current}
          onClick={() => setCurrent(null)}
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-40"
          disabled={!history.length || !!current}
          onClick={() => setCurrent(history[history.length - 1] ?? null)}
          aria-label="Forward"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <div className="flex flex-1 items-center gap-2 rounded-md bg-background/80 px-3 py-1 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span className="truncate">{current ? current.url : "Portfolio Projects"}</span>
        </div>
        <button
          className="rounded p-1 text-muted-foreground hover:bg-muted"
          onClick={() => setCurrent((c) => c)}
          aria-label="Reload"
        >
          <RotateCw className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {current ? <ProjectPage project={current} /> : <ProjectIndex onOpen={openProject} />}
      </div>
    </div>
  );
}

function ProjectIndex({ onOpen }: { onOpen: (p: Project) => void }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
      <p className="mt-1 text-sm text-muted-foreground">Selected work — click a project to open it.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => onOpen(p)}
            className="group overflow-hidden rounded-xl border border-border/60 text-left transition-transform hover:-translate-y-0.5"
          >
            <div className="h-28 w-full" style={{ background: p.accent }} />
            <div className="p-4">
              <p className="font-semibold">{p.name}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {p.tech.slice(0, 4).map((t) => (
                  <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function ProjectPage({ project }: { project: Project }) {
  const hasGitHub = !!project.github && !project.github.toLowerCase().includes("source not publicly available");
  const hasLive = !!project.live && !project.live.toLowerCase().includes("source not publicly available");

  return (
    <article className="pb-8">
      <div className="h-40 w-full" style={{ background: project.accent }} />
      <div className="p-6">
        <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {hasGitHub ? (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
            >
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground">
              <Github className="h-3.5 w-3.5" /> Source not publicly available
            </span>
          )}

          {hasLive ? (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Live project
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground">
              <ExternalLink className="h-3.5 w-3.5" /> Source not publicly available
            </span>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex h-24 items-end rounded-lg p-2 text-[10px] text-white/80"
              style={{ background: project.accent, opacity: 0.85 - i * 0.15 }}
            >
              Screenshot {i + 1}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-[11px]">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <List title="Features" items={project.features} />
          <List title="Responsibilities" items={project.responsibilities} />
          <List title="Challenges" items={project.challenges} />
          <List title="Results" items={project.results} />
        </div>
      </div>
    </article>
  );
}
