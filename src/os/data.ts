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
  tagline:
    "Software Developer focused on building responsive, scalable and user-friendly web applications. Experienced in frontend development, API integration and modern web technologies.",
  location: "Bengaluru, India",
  email: "ayushkrsrivastava12@gmail.com",
  github: "https://github.com/AyushDEvElopEr-200119?tab=repositories",
  linkedin: "https://www.linkedin.com/in/ayush-srivastava-6995a9301/",
  summary:
    "Software Developer focused on building responsive, scalable and user-friendly web applications. Experienced in frontend development, API integration and modern web technologies.",
  highlights: [
    "Frontend development across responsive web applications",
    "API integration and dynamic user experiences",
    "React.js, JavaScript, HTML5, CSS3 and Bootstrap workflows",
  ],
};

export type Skill = {
  name: string;
  group: string;
  proficiency: "Strong" | "Working Knowledge" | "Familiar";
};

export const skills: Skill[] = [
  { name: "HTML5", group: "Frontend", proficiency: "Strong" },
  { name: "CSS3", group: "Frontend", proficiency: "Strong" },
  { name: "JavaScript", group: "Frontend", proficiency: "Strong" },
  { name: "TypeScript", group: "Frontend", proficiency: "Working Knowledge" },
  { name: "React.js", group: "Frontend", proficiency: "Strong" },
  { name: "Next.js", group: "Frontend", proficiency: "Working Knowledge" },
  { name: "Bootstrap", group: "Frontend", proficiency: "Strong" },
  { name: "Tailwind CSS", group: "Frontend", proficiency: "Working Knowledge" },
  { name: "Redux Toolkit", group: "State & Libraries", proficiency: "Working Knowledge" },
  { name: "Context API", group: "State & Libraries", proficiency: "Strong" },
  { name: "React Router", group: "State & Libraries", proficiency: "Strong" },
  { name: "React Hook Form", group: "State & Libraries", proficiency: "Working Knowledge" },
  { name: "Zod", group: "State & Libraries", proficiency: "Working Knowledge" },
  { name: "Node.js", group: "Backend", proficiency: "Working Knowledge" },
  { name: "Express.js", group: "Backend", proficiency: "Working Knowledge" },
  { name: "REST APIs", group: "Backend", proficiency: "Strong" },
  { name: "JWT", group: "Backend", proficiency: "Working Knowledge" },
  { name: "OAuth", group: "Backend", proficiency: "Familiar" },
  { name: "MySQL", group: "Database", proficiency: "Working Knowledge" },
  { name: "SQL", group: "Database", proficiency: "Strong" },
  { name: "Java", group: "Languages", proficiency: "Strong" },
  { name: "Core Java", group: "Languages", proficiency: "Strong" },
  { name: "Git", group: "Tools", proficiency: "Strong" },
  { name: "GitHub", group: "Tools", proficiency: "Strong" },
  { name: "Figma", group: "Tools", proficiency: "Working Knowledge" },
  { name: "Chrome DevTools", group: "Tools", proficiency: "Strong" },
  { name: "VS Code", group: "Tools", proficiency: "Strong" },
];

export const experience = [
  {
    company: "Provab Technosoft",
    role: "Software Developer",
    period: "May 2025 — Present",
    location: "Bengaluru, India",
    points: [
      "Develop and maintain responsive web applications.",
      "Build interfaces using HTML5, CSS3, JavaScript, Bootstrap and React.js.",
      "Convert Figma designs into responsive web interfaces.",
      "Integrate REST APIs and dynamic frontend functionality.",
      "Work with developers, designers and stakeholders to deliver production-ready web solutions.",
    ],
  },
  {
    company: "BlackBuck",
    role: "Software Developer",
    period: "May 2023 — May 2025",
    location: "Bengaluru, India",
    points: [
      "Developed and maintained responsive web applications for a logistics technology platform.",
      "Built reusable frontend components and responsive interfaces.",
      "Worked with HTML5, CSS3, JavaScript, React.js and Bootstrap.",
      "Integrated REST APIs and implemented dynamic, data-driven frontend features.",
      "Collaborated with cross-functional teams to improve usability and application performance.",
    ],
  },
];

export type Project = {
  id: string;
  name: string;
  url: string;
  description: string;
  role: string;
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
    id: "subupee",
    name: "Subupee",
    url: "Source not publicly available",
    description: "Responsive web experience focused on presenting services and creating a polished user-facing digital presence.",
    role: "Frontend / Software Development",
    tech: ["React", "JavaScript", "HTML5", "CSS3", "Responsive Design"],
    features: ["Responsive interface", "Modern UI", "Service presentation", "Contact experience"],
    responsibilities: ["Frontend implementation", "UI composition", "Responsive page development"],
    challenges: ["Keeping layout consistent across screen sizes", "Maintaining a clean presentation for service content"],
    results: ["Clean, responsive interface for customer-facing browsing"],
    github: "Source not publicly available",
    live: "Source not publicly available",
    accent: "linear-gradient(135deg,#14b8a6,#0f172a)",
  },
  {
    id: "kirtigold",
    name: "Kirtigold",
    url: "Source not publicly available",
    description: "User-focused web application built to present brand content and business offerings in a refined digital format.",
    role: "Frontend / Software Development",
    tech: ["React", "JavaScript", "HTML5", "CSS3", "Bootstrap"],
    features: ["Marketing-focused pages", "Responsive layout", "Brand presentation", "Clean UX"],
    responsibilities: ["UI development", "Responsive frontend work", "Component implementation"],
    challenges: ["Balancing visual polish with maintainable structure", "Responsive behavior across page layouts"],
    results: ["Consistent responsive experience for web visitors"],
    github: "Source not publicly available",
    live: "Source not publicly available",
    accent: "linear-gradient(135deg,#f59e0b,#f97316)",
  },
  {
    id: "kubesimplify",
    name: "Kubesimplify",
    url: "Source not publicly available",
    description: "Portfolio-style product website designed to communicate technical offerings and digital services clearly.",
    role: "Frontend / Software Development",
    tech: ["React", "JavaScript", "HTML5", "CSS3", "Responsive Design"],
    features: ["Product presentation", "Responsive interface", "Structured content sections", "Modern styling"],
    responsibilities: ["Frontend development", "Responsive design implementation", "UI refinement"],
    challenges: ["Creating a clear narrative for product information", "Maintaining responsiveness across content blocks"],
    results: ["Structured and visually clear digital presentation"],
    github: "Source not publicly available",
    live: "Source not publicly available",
    accent: "linear-gradient(135deg,#60a5fa,#2563eb)",
  },
  {
    id: "ecommerce-website",
    name: "E-commerce Website",
    url: "Source not publicly available",
    description: "E-commerce storefront experience focused on product presentation, layout clarity and responsive shopping experience.",
    role: "Frontend / Software Development",
    tech: ["React", "JavaScript", "HTML5", "CSS3", "Bootstrap"],
    features: ["Responsive storefront", "Product layout", "Navigation flow", "Customer-facing UI"],
    responsibilities: ["Frontend development", "UI structure", "Responsive layout implementation"],
    challenges: ["Design consistency across page types", "Responsive behavior for product browsing"],
    results: ["Clear customer-facing storefront experience"],
    github: "Source not publicly available",
    live: "Source not publicly available",
    accent: "linear-gradient(135deg,#f472b6,#ec4899)",
  },
  {
    id: "chat-application",
    name: "Chat Application",
    url: "Source not publicly available",
    description: "Interactive messaging interface designed for streamlined communication and modern usability patterns.",
    role: "Frontend / Software Development",
    tech: ["React", "JavaScript", "HTML5", "CSS3", "Responsive Design"],
    features: ["Message interface", "Modern layout", "Responsive communication UI", "User interaction flows"],
    responsibilities: ["Frontend interface design", "Component development", "Responsive interactions"],
    challenges: ["Designing a clear message flow", "Maintaining usability across devices"],
    results: ["Responsive chat experience with improved interface clarity"],
    github: "Source not publicly available",
    live: "Source not publicly available",
    accent: "linear-gradient(135deg,#22c55e,#15803d)",
  },
  {
    id: "billing-software",
    name: "Billing Software",
    url: "Source not publicly available",
    description: "Business-oriented interface focused on transaction handling, form usability and organized data display.",
    role: "Frontend / Software Development",
    tech: ["React", "JavaScript", "HTML5", "CSS3", "Bootstrap"],
    features: ["Transaction-oriented UI", "Structured forms", "Data presentation", "Business workflow support"],
    responsibilities: ["Frontend UI development", "Workflow layout", "Form and data presentation"],
    challenges: ["Organizing billing workflows clearly", "Maintaining a clean and intuitive user flow"],
    results: ["Structured interface for business operations"],
    github: "Source not publicly available",
    live: "Source not publicly available",
    accent: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
  },
  {
    id: "dynamic-perfume-website",
    name: "Dynamic Perfume Website",
    url: "Source not publicly available",
    description: "Brand-focused storefront experience with product-driven sections and a polished visual identity.",
    role: "Frontend / Software Development",
    tech: ["React", "JavaScript", "HTML5", "CSS3", "Responsive Design"],
    features: ["Product storytelling", "Responsive landing pages", "Modern UI", "Brand presentation"],
    responsibilities: ["Frontend development", "Responsive interface work", "Creative UI implementation"],
    challenges: ["Balancing product storytelling with usability", "Responsive layouts for varied content types"],
    results: ["Visually polished customer-facing product presentation"],
    github: "Source not publicly available",
    live: "Source not publicly available",
    accent: "linear-gradient(135deg,#f97316,#ea580c)",
  },
];

export const resume = {
  headline: `${profile.name} — ${profile.role}`,
  sections: [
    { title: "Summary", body: [profile.summary] },
    {
      title: "Experience",
      body: experience.map((e) => `${e.role} — ${e.company} (${e.period})`),
    },
    { title: "Skills", body: [skills.map((s) => s.name).join(" · ")] },
    { title: "Projects", body: projects.map((p) => p.name) },
    { title: "Contact", body: [`Email: ${profile.email}`, `GitHub: ${profile.github}`, `LinkedIn: ${profile.linkedin}`] },
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


// Desktop shortcuts using real portfolio touchpoints.
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
  { id: "about", label: "About Me", icon: "User", brand: "folder", color: "linear-gradient(135deg,#FDBA3B,#F59E0B)", app: "finder" },
  { id: "experience", label: "Experience", icon: "Briefcase", brand: "folder", color: "linear-gradient(135deg,#60a5fa,#2563eb)", app: "finder" },
  { id: "projects", label: "Projects", icon: "FolderOpen", brand: "folder", color: "linear-gradient(135deg,#34d399,#059669)", app: "safari" },
  { id: "skills", label: "Skills", icon: "Sparkles", brand: "folder", color: "linear-gradient(135deg,#c084fc,#8b5cf6)", app: "finder" },
  { id: "resume", label: "Resume", icon: "FileText", brand: "pdf", color: "#f8fafc", app: "preview" },
  { id: "terminal", label: "Terminal", icon: "TerminalSquare", brand: "terminal", color: "#111827", app: "terminal" },
  { id: "github", label: "GitHub", icon: "Github", brand: "github", color: "#181717", href: profile.github },
  { id: "linkedin", label: "LinkedIn", icon: "Linkedin", brand: "linkedin", color: "#0A66C2", href: profile.linkedin },
  { id: "mail", label: "Contact", icon: "Mail", brand: "folder", color: "linear-gradient(135deg,#38bdf8,#6366f1)", app: "mail" },
  { id: "photos", label: "Photos", icon: "Image", brand: "folder", color: "linear-gradient(135deg,#fb7185,#f59e0b)", app: "photos" },
  { id: "system", label: "System Info", icon: "Cpu", brand: "folder", color: "linear-gradient(135deg,#a78bfa,#7c3aed)", app: "sysinfo" },
  { id: "settings", label: "Settings", icon: "Settings", brand: "folder", color: "linear-gradient(135deg,#94a3b8,#475569)", app: "settings" },
];
