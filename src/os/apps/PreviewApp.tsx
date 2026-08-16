import type { AppProps } from "../registry";
import { profile, resume } from "../data";

export default function PreviewApp(_props: AppProps) {
  return (
    <div className="h-full overflow-auto bg-muted/60 p-6">
      <div className="mx-auto max-w-2xl rounded-md bg-background p-8 shadow-xl">
        <header className="border-b border-border pb-4">
          <h1 className="text-2xl font-semibold tracking-tight">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">{resume.headline}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {profile.location} · {profile.email}
          </p>
        </header>
        {resume.sections.map((s) => (
          <section key={s.title} className="mt-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{s.title}</h2>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed">
              {s.body.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        ))}
        <footer className="mt-8 border-t border-border pt-3 text-[11px] text-muted-foreground">
          Resume.pdf — 1 of 1 — Preview
        </footer>
      </div>
    </div>
  );
}
