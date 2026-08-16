import { Mail, MapPin, Github, Linkedin } from "lucide-react";
import type { AppProps } from "../registry";
import { profile } from "../data";

export default function ContactsApp(_props: AppProps) {
  return (
    <div className="flex h-full bg-card">
      <aside className="w-48 shrink-0 border-r border-border/60 bg-muted/40 p-2">
        <p className="px-2 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">All Contacts</p>
        <div className="flex items-center gap-2 rounded-md bg-primary/15 px-2 py-1.5">
          <img src={profile.avatar} alt={profile.name} className="h-7 w-7 rounded-full object-cover" />
          <span className="truncate text-sm">{profile.name}</span>
        </div>
      </aside>
      <div className="flex-1 overflow-auto p-8">
        <div className="flex items-center gap-5">
          <img
            src={profile.avatar}
            alt={`${profile.name} profile picture`}
            className="h-24 w-24 rounded-full object-cover shadow-lg ring-2 ring-border"
          />
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.role}</p>
          </div>
        </div>
        <div className="mt-6 space-y-3 text-sm">
          <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:underline">
            <Mail className="h-4 w-4 text-primary" /> {profile.email}
          </a>
          <p className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {profile.location}
          </p>
          <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
            <Github className="h-4 w-4" /> {profile.github}
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
            <Linkedin className="h-4 w-4" /> {profile.linkedin}
          </a>
        </div>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">{profile.summary}</p>
      </div>
    </div>
  );
}
