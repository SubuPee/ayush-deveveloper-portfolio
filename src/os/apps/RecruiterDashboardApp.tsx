import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Send,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import type { AppProps } from "../registry";
import { experience, profile, projects, skills } from "../data";
import { useOS } from "../store";

const quickActions = [
  { label: "View Resume", app: "preview" as const },
  { label: "View Projects", app: "safari" as const },
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Contact Me", app: "mail" as const },
];

const skillGroups = [
  {
    title: "Frontend",
    items: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Next.js", "Bootstrap", "Tailwind CSS"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    title: "Database",
    items: ["MySQL", "SQL"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "Figma", "Chrome DevTools"],
  },
];

const featuredProjects = projects.slice(0, 4);

export default function RecruiterDashboardApp(_props: AppProps) {
  const { openApp, settings, updateSettings } = useOS();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleResumeDownload = () => {
    const resumeText = [
      `${profile.name}`,
      `${profile.role}`,
      profile.location,
      profile.email,
      "",
      `Summary: ${profile.summary}`,
      "",
      "Experience:",
      ...experience.flatMap((item) => [
        `${item.role} @ ${item.company} (${item.period})`,
        ...item.points.map((point) => `- ${point}`),
        "",
      ]),
      "Skills:",
      ...skills.map((skill) => `- ${skill.name} (${skill.group})`),
      "",
      "Projects:",
      ...projects.map((project) => `- ${project.name}: ${project.description}`),
    ].join("\n");

    const blob = new Blob([resumeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Ayush-Srivastava-Resume.txt";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Resume download started.");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setError("Please complete all fields before sending your message.");
      return;
    }

    setStatus("submitting");
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const subject = encodeURIComponent(`Ayush World — message from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      toast.success("Your mail app is ready with the message drafted.");
    } catch {
      setStatus("error");
      setError("Something went wrong while preparing the message. Please try again.");
    }
  };

  const toggleRecruiterMode = () => {
    const next = !settings.reduceMotion;
    updateSettings({ reduceMotion: next });
    if (next) {
      openApp("recruiter");
    }
  };

  return (
    <div className="h-full overflow-auto bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_35%),linear-gradient(180deg,#f3f5f9_0%,#e9edf4_100%)] text-slate-900">
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <header className="rounded-[24px] border border-slate-200/80 bg-white/60 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/15">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Recruiter Dashboard</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Ayush Srivastava</h1>
                <p className="text-sm text-slate-600">Software Developer / Frontend Developer</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) =>
                action.app ? (
                  <button
                    key={action.label}
                    onClick={() => openApp(action.app)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 transition-transform hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
                  >
                    {action.label}
                  </button>
                ) : (
                  <a
                    key={action.label}
                    href={action.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 transition-transform hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
                  >
                    {action.label}
                  </a>
                ),
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleRecruiterMode}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-900/15 transition-transform hover:-translate-y-0.5"
            >
              {settings.reduceMotion ? "Exit Recruiter Mode" : "Enter Recruiter Mode"}
            </button>
            <button
              onClick={() => openApp("preview")}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-transform hover:-translate-y-0.5"
            >
              <FileText className="h-3.5 w-3.5" /> View Resume
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-950 text-white p-4 shadow-inner shadow-slate-900/15">
            <p className="text-sm leading-6 text-slate-200">
              Software Developer focused on building modern, scalable and high-performance web applications.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              "3.5+ Years Experience",
              "Software Developer",
              "React / JavaScript / Node.js",
              "Bengaluru, India",
              "Open to Opportunities",
            ].map((stat) => (
              <div key={stat} className="rounded-2xl border border-slate-200/80 bg-white/70 p-3 text-center shadow-sm">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Profile</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{stat}</p>
              </div>
            ))}
          </div>
        </header>

        <main className="mt-6 space-y-6">
          <section className="rounded-[24px] border border-slate-200/80 bg-white/60 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">Executive Summary</h2>
            </div>
            <p className="max-w-4xl text-sm leading-7 text-slate-700 md:text-base">
              I am Ayush Srivastava, a software developer focused on building responsive, scalable, and user-friendly web applications. I specialize in frontend development, API integration, and translating product requirements into polished digital experiences. My strongest technologies include React.js, JavaScript, HTML5, CSS3, Bootstrap, Node.js, Express.js, REST APIs, MySQL, and GitHub-driven collaboration workflows. I am looking for software developer and frontend developer opportunities where I can contribute to product quality, performance, and maintainable UI architecture.
            </p>
          </section>

          <section className="rounded-[24px] border border-slate-200/80 bg-white/60 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">Experience</h2>
            </div>

            <div className="relative space-y-5 before:absolute before:left-[10px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-slate-200">
              {experience.map((job) => (
                <div key={`${job.company}-${job.period}`} className="relative pl-8">
                  <span className="absolute left-0 top-1.5 h-5 w-5 rounded-full border-4 border-white bg-slate-900 shadow-sm" />
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{job.role}</p>
                        <p className="text-sm text-slate-700">{job.company}</p>
                      </div>
                      <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{job.period}</div>
                    </div>
                    <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5" /> {job.location}
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {job.points.map((point) => (
                        <li key={point} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200/80 bg-white/60 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">Technical Skills</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {skillGroups.map((group) => (
                <div key={group.title} className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{group.title}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200/80 bg-white/60 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">Featured Projects</h2>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {featuredProjects.map((project) => {
                const hasGitHub = !!project.github && !project.github.toLowerCase().includes("source not publicly available");
                const hasLive = !!project.live && !project.live.toLowerCase().includes("source not publicly available");

                return (
                  <article key={project.id} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/80 shadow-sm transition-transform hover:-translate-y-1">
                    <div className="h-28 w-full" style={{ background: project.accent }} />
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                        {project.role ? <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-slate-500">{project.role}</span> : null}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{project.description}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span key={tech} className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-600">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Key Features</p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-700">
                          {project.features.slice(0, 3).map((feature) => (
                            <li key={feature} className="flex gap-2">
                              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {hasGitHub ? (
                          <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100">
                            <Github className="h-3.5 w-3.5" /> GitHub
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-500">
                            <Github className="h-3.5 w-3.5" /> GitHub unavailable
                          </span>
                        )}
                        {hasLive ? (
                          <a href={project.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white hover:opacity-90">
                            <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-900/60 px-2.5 py-1.5 text-xs font-medium text-white opacity-80">
                            <ExternalLink className="h-3.5 w-3.5" /> Live Demo unavailable
                          </span>
                        )}
                        <button onClick={() => openApp("safari", { project: project.id })} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100">
                          View Case Study
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200/80 bg-white/60 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">Why Hire Me</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                "Strong frontend development",
                "Responsive UI development",
                "API integration",
                "Component-based architecture",
                "Problem solving",
                "Performance-focused development",
                "Clean and maintainable code",
                "Ability to work across frontend and backend",
              ].map((strength) => (
                <div key={strength} className="flex items-start gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-800" />
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[24px] border border-slate-200/80 bg-white/60 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4 text-slate-700" />
                <h2 className="text-lg font-semibold text-slate-900">Availability</h2>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">Currently Open to Opportunities</p>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p><span className="font-medium text-slate-900">Preferred Role:</span> Software Developer / Frontend Developer</p>
                  <p><span className="font-medium text-slate-900">Experience:</span> 3.5+ Years</p>
                  <p><span className="font-medium text-slate-900">Location:</span> Bengaluru, India</p>
                  <p><span className="font-medium text-slate-900">Work Preference:</span> Based on the profile and current role availability</p>
                  <p><span className="font-medium text-slate-900">Availability:</span> Open for opportunities</p>
                </div>
                <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-transform hover:-translate-y-0.5">
                  Let&apos;s Work Together <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200/80 bg-white/60 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-700" />
                <h2 className="text-lg font-semibold text-slate-900">Resume</h2>
              </div>
              <div className="space-y-3">
                <button onClick={() => openApp("preview")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
                  <FileText className="h-4 w-4" /> View Resume
                </button>
                <button onClick={handleResumeDownload} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-transform hover:-translate-y-0.5 hover:bg-slate-50">
                  <Download className="h-4 w-4" /> Download Resume
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200/80 bg-white/60 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">Contact Recruiter</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-3 text-sm text-slate-700">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 hover:bg-slate-100">
                  <Mail className="h-4 w-4 text-slate-700" /> {profile.email}
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 hover:bg-slate-100">
                  <Linkedin className="h-4 w-4 text-slate-700" /> LinkedIn
                </a>
                <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 hover:bg-slate-100">
                  <Github className="h-4 w-4 text-slate-700" /> GitHub
                </a>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="space-y-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Name
                    <input
                      name="name"
                      value={form.name}
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="space-y-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Email
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      placeholder="Your email"
                    />
                  </label>
                </div>

                <label className="block space-y-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Message
                  <textarea
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="Tell me about the role and team."
                  />
                </label>

                {status === "error" && error ? (
                  <p className="text-sm text-red-600">{error}</p>
                ) : null}

                {status === "success" ? (
                  <p className="text-sm text-emerald-600">Message prepared successfully. Your email client is ready.</p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "submitting" ? "Preparing message..." : "Start a Conversation"}
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
