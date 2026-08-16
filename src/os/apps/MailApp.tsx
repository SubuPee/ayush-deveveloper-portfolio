import { useState } from "react";
import { Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import type { AppProps } from "../registry";
import { profile } from "../data";

export default function MailApp(_props: AppProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <div className="flex h-full flex-col overflow-auto bg-card sm:flex-row">
      <aside className="border-b border-border/60 p-5 sm:w-64 sm:border-b-0 sm:border-r">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Contact</p>
        <div className="mt-4 space-y-3 text-sm">
          <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:underline">
            <Mail className="h-4 w-4 text-primary" /> {profile.email}
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
            <Linkedin className="h-4 w-4 text-primary" /> LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
            <Github className="h-4 w-4 text-primary" /> GitHub
          </a>
          <p className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {profile.location}
          </p>
        </div>
      </aside>

      <form
        className="flex-1 space-y-3 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const subject = encodeURIComponent(`Ayush World — message from ${form.name || "a visitor"}`);
          const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`);
          window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
          toast.success("Opening your mail client with the message drafted.");
        }}
      >
        <p className="text-sm font-semibold">New Message</p>
        <input
          required
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          required
          type="email"
          placeholder="Your email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <textarea
          required
          rows={7}
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Send className="h-4 w-4" /> Send
        </button>
      </form>
    </div>
  );
}
