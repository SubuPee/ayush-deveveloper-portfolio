// Portfolio content for Ayush World.
import streetAsset from "@/assets/ayush-street.jpg.asset.json";
import avatar from "@/assets/gallery/ayush-2.png";
import galleryCafe from "@/assets/gallery/ayush-2.png";
import gallerySea from "@/assets/gallery/p1.jpg";
import galleryPalace from "@/assets/gallery/p2.jpg";
import galleryHills from "@/assets/gallery/p3.jpg";
import galleryLights from "@/assets/gallery/p4.jpg";

export const profile = {
  avatar: avatar,
  name: "Ayush Srivastava",
  role: "Software Developer",
  tagline: "An interactive developer portfolio experience",
  location: "Bengaluru, India",
  email: "ayushkrsrivastava12@gmail.com",
  github: "https://github.com/AyushDEvElopEr-200119?tab=repositories",
  linkedin: "https://www.linkedin.com/in/ayush-srivastava-6995a9301/",
  summary:
    "Software developer focused on building fast, accessible and delightful web products. I work across React, TypeScript and Node.js, and I care deeply about interaction design, performance and engineering rigour.",
  highlights: [
    "3.5+ years building production web applications",
    "Design systems, dashboards and real-time interfaces",
    "Performance budgets, accessibility and testing culture",
  ],
};

export const skills = [
  { name: "React.js", level: 95, group: "Frontend" },
  { name: "TypeScript", level: 92, group: "Language" },
  { name: "JavaScript", level: 94, group: "Language" },
  { name: "Next.js", level: 88, group: "Framework" },
  { name: "Node.js", level: 85, group: "Backend" },
  { name: "REST APIs", level: 90, group: "Backend" },
  { name: "Tailwind CSS", level: 90, group: "Frontend" },
  { name: "PostgreSQL", level: 78, group: "Data" },
  { name: "Testing (Vitest/Playwright)", level: 80, group: "Quality" },
  { name: "System Design", level: 76, group: "Engineering" },
];

export const experience = [
  {
    company: "BlackBuck",
    role: "Software Developer",
    period: "May 2023 — May 2025",
    location: "Bengaluru",
    points: [
      "Developed and maintained responsive web applications for a logistics and transportation technology platform.",
      "Built reusable frontend components and user interfaces using React.js, JavaScript, HTML5, CSS3, and Bootstrap.",
      "Integrated REST APIs and implemented dynamic, data-driven features for internal and customer-facing applications.",
      "Collaborated with cross-functional teams to improve application performance, usability, and responsive design.",
    ],
  },
  {
    company: "Provab Technosoft",
    role: "Software Developer",
    period: "May 2025 — Present",
    location: "Bengaluru",
    points: [
      "Develop and maintain responsive web applications using HTML5, CSS3, JavaScript, Bootstrap, and React.js.",
      "Convert Figma/UI designs into pixel-accurate, responsive web interfaces across desktop, tablet, and mobile devices.",
      "Integrate REST APIs and develop dynamic frontend features based on business requirements.",
      "Collaborate with designers, developers, and stakeholders to deliver scalable and user-friendly web solutions.",
    ],
  },
];

export const certifications = [
  { name: "Meta Front-End Developer", issuer: "Coursera", year: "2023" },
  { name: "AWS Cloud Practitioner", issuer: "Amazon", year: "2022" },
  { name: "JavaScript Algorithms & Data Structures", issuer: "freeCodeCamp", year: "2021" },
];

export type Project = {
  id: string;
  name: string;
  url: string;
  description: string;
  tech: string[];
  features: string[];
  responsibilities: string[];
  challenges: string[];
  results: string[];
  github: string;
  live: string;
  accent: string;
};

export const projects: Project[] = [
  {
    id: "admin-dashboard",
    name: "Admin Dashboard",
    url: "https://ayush.dev/projects/admin-dashboard",
    description:
      "A real-time operations dashboard with role-based access, live charts and granular audit logging.",
    tech: ["React", "TypeScript", "Recharts", "Node.js", "PostgreSQL"],
    features: ["Live metric streaming", "Role-based access control", "Saved views & filters", "CSV export"],
    responsibilities: ["Frontend architecture", "Charting layer", "Auth & permissions UI"],
    challenges: ["Keeping 60fps while streaming 2k events/min", "Complex permission matrix"],
    results: ["Support tickets down 31%", "Time-to-insight down from 4 min to 20 s"],
    github: "https://github.com/ayush/admin-dashboard",
    live: "https://example.com/admin-dashboard",
    accent: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
  },
  {
    id: "ecommerce-platform",
    name: "E-commerce Platform",
    url: "https://ayush.dev/projects/ecommerce-platform",
    description:
      "Storefront and checkout with server-rendered catalog pages, cart persistence and payment integration.",
    tech: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
    features: ["SSR catalog", "Persistent cart", "Checkout & payments", "Order tracking"],
    responsibilities: ["Checkout flow", "Performance work", "Design system"],
    challenges: ["Cart consistency across devices", "Core Web Vitals on long catalogs"],
    results: ["Conversion +18%", "LCP under 1.4 s on mobile"],
    github: "https://github.com/ayush/ecommerce-platform",
    live: "https://example.com/shop",
    accent: "linear-gradient(135deg,#f59e0b,#ef4444)",
  },
  {
    id: "devnotes",
    name: "DevNotes",
    url: "https://ayush.dev/projects/devnotes",
    description:
      "Offline-first markdown notebook with IndexedDB storage, full-text search and keyboard-first navigation.",
    tech: ["React", "IndexedDB", "Web Workers", "Vite"],
    features: ["Offline sync", "Full-text search", "Command palette", "Export to Markdown"],
    responsibilities: ["Entire product", "Search worker", "Sync engine"],
    challenges: ["Conflict resolution offline", "Search over 10k notes without jank"],
    results: ["Search results in <30 ms", "Works fully offline"],
    github: "https://github.com/ayush/devnotes",
    live: "https://example.com/devnotes",
    accent: "linear-gradient(135deg,#10b981,#0ea5e9)",
  },
];

export const resume = {
  headline: `${profile.name} — ${profile.role}`,
  sections: [
    { title: "Profile", body: [profile.summary] },
    {
      title: "Experience",
      body: experience.map((e) => `${e.role}, ${e.company} (${e.period}) — ${e.points[0]}`),
    },
    { title: "Skills", body: [skills.map((s) => s.name).join(" · ")] },
    { title: "Certifications", body: certifications.map((c) => `${c.name} — ${c.issuer}, ${c.year}`) },
  ],
};

export type Photo = { id: string; title: string; gradient: string; src?: string };

export const photos: Photo[] = [
  { id: "p1", title: "Ayush — portrait", gradient: "linear-gradient(135deg,#1f2937,#0f172a)", src: avatar },
  { id: "p2", title: "Evening in Bengaluru", gradient: "linear-gradient(135deg,#334155,#64748b)", src: streetAsset.url },
  { id: "p3", title: "Café portrait", gradient: "linear-gradient(135deg,#1e3a8a,#0ea5e9)", src: galleryCafe },
  { id: "p4", title: "Sunrise by the sea", gradient: "linear-gradient(135deg,#7c3aed,#ec4899)", src: gallerySea },
  { id: "p5", title: "Mysore Palace", gradient: "linear-gradient(135deg,#0f172a,#475569)", src: galleryPalace },
  { id: "p6", title: "Nandi Hills viewpoint", gradient: "linear-gradient(135deg,#be123c,#f43f5e)", src: galleryHills },
  { id: "p7", title: "Evening lights", gradient: "linear-gradient(135deg,#0f172a,#334155)", src: galleryLights },
];


// Desktop shortcuts using real brand marks (macOS-style icon grid).
export type Shortcut = {
  id: string;
  label: string;
  icon: string; // lucide icon name (fallback)
  brand?: string; // BrandIcon id
  color: string;
  app?: string;
  href?: string;
};

export const shortcuts: Shortcut[] = [
  { id: "youtube", label: "YouTube", icon: "Youtube", brand: "youtube", color: "#fff", href: "https://youtube.com" },
  { id: "projects", label: "Projects", icon: "FolderOpen", brand: "folder", color: "linear-gradient(135deg,#FDBA3B,#F59E0B)", app: "safari" },
  { id: "linkedin", label: "LinkedIn", icon: "Linkedin", brand: "linkedin", color: "#0A66C2", href: profile.linkedin },
  { id: "gemini", label: "Gemini", icon: "Sparkles", brand: "gemini", color: "#fff", href: "https://gemini.google.com" },
  { id: "journal", label: "Journal", icon: "BookOpen", brand: "journal", color: "#111827", app: "preview" },
  { id: "skills", label: "Skills", icon: "FolderOpen", brand: "folder", color: "linear-gradient(135deg,#FDBA3B,#F59E0B)", app: "finder" },
  { id: "netflix", label: "Netflix", icon: "Clapperboard", brand: "netflix", color: "#0b0b0b", href: "https://netflix.com" },
  { id: "instagram", label: "Instagram", icon: "Instagram", brand: "instagram", color: "#d62976", href: "https://instagram.com" },
  { id: "blog", label: "Blog", icon: "Rss", brand: "blogger", color: "#FF5722", href: "https://blogger.com" },
  { id: "experience", label: "Experience", icon: "FolderOpen", brand: "folder", color: "linear-gradient(135deg,#FDBA3B,#F59E0B)", app: "finder" },
  { id: "chatgpt", label: "ChatGPT", icon: "MessageSquare", brand: "chatgpt", color: "#fff", href: "https://chat.openai.com" },
  { id: "vscode", label: "VS Code", icon: "Code2", brand: "vscode", color: "#1f1f1f", href: "https://code.visualstudio.com" },
  { id: "resume", label: "Resume", icon: "FileText", brand: "pdf", color: "#f8fafc", app: "preview" },
  { id: "github", label: "GitHub", icon: "Github", brand: "github", color: "#181717", href: profile.github },
  { id: "codex", label: "Codex", icon: "TerminalSquare", brand: "codex", color: "#111827", href: "https://chatgpt.com/codex" },
  { id: "figma", label: "Figma", icon: "Figma", brand: "figma", color: "#fff", href: "https://figma.com" },
  { id: "about", label: "About Me", icon: "FolderOpen", brand: "folder", color: "linear-gradient(135deg,#FDBA3B,#F59E0B)", app: "finder" },
  { id: "whatsapp", label: "WhatsApp", icon: "MessageCircle", brand: "whatsapp", color: "#25D366", href: "https://web.whatsapp.com" },
  { id: "deepseek", label: "DeepSeek", icon: "Sparkles", brand: "deepseek", color: "#fff", href: "https://chat.deepseek.com" },
  { id: "devlyhub", label: "devlyhub", icon: "Globe", brand: "devlyhub", color: "#0b0b12", href: "https://portfolio.devlyhub.in" },
];
