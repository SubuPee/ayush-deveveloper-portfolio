export type Visibility = "public" | "private";

export type ExperienceEntry = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  visibility?: Visibility;
};

export type ProjectEntry = {
  name: string;
  description: string;
  role: string;
  technologies: string[];
  features: string[];
  challenges: string[];
  results: string[];
  githubUrl: string;
  liveUrl: string;
  caseStudyUrl: string;
  image: string;
  visibility?: Visibility;
};

export type AyushProfile = {
  identity: {
    name: string;
    professionalTitle: string;
    location: string;
    introduction: string;
    visibility: Visibility;
  };
  professionalSummary: string;
  experience: ExperienceEntry[];
  skills: {
    frontend: string[];
    backend: string[];
    database: string[];
    frameworks: string[];
    tools: string[];
  };
  projects: ProjectEntry[];
  education: Record<string, unknown>;
  careerPreferences: {
    preferredRoles: string[];
    preferredLocations: string[];
    workPreference: string;
    availability: string;
  };
  professionalInterests: string[];
  publicPersonalPreferences: string[];
  contact: {
    email: string;
    location: string;
    visibility: Visibility;
  };
  socialLinks: {
    github: string;
    linkedin: string;
    visibility: Visibility;
  };
  resume: {
    viewUrl: string;
    downloadUrl: string;
    visibility: Visibility;
  };
  compensation: {
    public: boolean;
    expectedCTC: string | null;
    visibility: Visibility;
  };
};

export const ayushProfile: AyushProfile = {
  identity: {
    name: "Ayush Srivastava",
    professionalTitle: "Software Developer / Frontend Developer",
    location: "Bengaluru, India",
    introduction:
      "Software Developer focused on building modern, scalable and high-performance web applications.",
    visibility: "public",
  },
  professionalSummary:
    "Software Developer focused on building responsive, scalable and user-friendly web applications. Experienced in frontend development, API integration and modern web technologies.",
  experience: [
    {
      company: "P Technosoft",
      role: "Software Developer",
      startDate: "2025-05",
      endDate: "Present",
      current: true,
      location: "Bengaluru, India",
      description: "Develop and maintain responsive web applications with a focus on product quality and frontend delivery.",
      responsibilities: [
        "Develop and maintain responsive web applications.",
        "Build interfaces using HTML5, CSS3, JavaScript, Bootstrap and React.js.",
        "Convert Figma designs into responsive web interfaces.",
        "Integrate REST APIs and dynamic frontend functionality.",
        "Work with developers, designers and stakeholders to deliver production-ready web solutions.",
      ],
      technologies: ["React.js", "JavaScript", "HTML5", "CSS3", "Bootstrap", "REST APIs"],
      achievements: [],
      visibility: "public",
    },
    {
      company: "BlackBuck",
      role: "Software Developer",
      startDate: "2023-05",
      endDate: "2025-05",
      current: false,
      location: "Bengaluru, India",
      description: "Built responsive frontend experiences for logistics and product workflows.",
      responsibilities: [
        "Developed and maintained responsive web applications for a logistics technology platform.",
        "Built reusable frontend components and responsive interfaces.",
        "Worked with HTML5, CSS3, JavaScript, React.js and Bootstrap.",
        "Integrated REST APIs and implemented dynamic, data-driven frontend features.",
        "Collaborated with cross-functional teams to improve usability and application performance.",
      ],
      technologies: ["React.js", "JavaScript", "HTML5", "CSS3", "Bootstrap", "REST APIs"],
      achievements: [],
      visibility: "public",
    },
  ],
  skills: {
    frontend: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Next.js", "Bootstrap", "Tailwind CSS"],
    backend: ["Node.js", "Express.js", "REST APIs"],
    database: ["MySQL", "SQL"],
    frameworks: ["React.js", "Next.js", "Express.js"],
    tools: ["Git", "GitHub", "Figma", "Chrome DevTools"],
  },
  projects: [
    {
      name: "Subupee",
      description: "Responsive web experience focused on presenting services and creating a polished user-facing digital presence.",
      role: "Frontend / Software Development",
      technologies: ["React", "JavaScript", "HTML5", "CSS3", "Responsive Design"],
      features: ["Responsive interface", "Modern UI", "Service presentation", "Contact experience"],
      challenges: ["Keeping layout consistent across screen sizes", "Maintaining a clean presentation for service content"],
      results: ["Clean, responsive interface for customer-facing browsing"],
      githubUrl: "Source not publicly available",
      liveUrl: "Source not publicly available",
      caseStudyUrl: "Source not publicly available",
      image: "",
      visibility: "public",
    },
    {
      name: "Kirtigold",
      description: "User-focused web application built to present brand content and business offerings in a refined digital format.",
      role: "Frontend / Software Development",
      technologies: ["React", "JavaScript", "HTML5", "CSS3", "Bootstrap"],
      features: ["Marketing-focused pages", "Responsive layout", "Brand presentation", "Clean UX"],
      challenges: ["Balancing visual polish with maintainable structure", "Responsive behavior across page layouts"],
      results: ["Consistent responsive experience for web visitors"],
      githubUrl: "Source not publicly available",
      liveUrl: "Source not publicly available",
      caseStudyUrl: "Source not publicly available",
      image: "",
      visibility: "public",
    },
    {
      name: "Kubesimplify",
      description: "Portfolio-style product website designed to communicate technical offerings and digital services clearly.",
      role: "Frontend / Software Development",
      technologies: ["React", "JavaScript", "HTML5", "CSS3", "Responsive Design"],
      features: ["Product presentation", "Responsive interface", "Structured content sections", "Modern styling"],
      challenges: ["Creating a clear narrative for product information", "Maintaining responsiveness across content blocks"],
      results: ["Structured and visually clear digital presentation"],
      githubUrl: "Source not publicly available",
      liveUrl: "Source not publicly available",
      caseStudyUrl: "Source not publicly available",
      image: "",
      visibility: "public",
    },
    {
      name: "E-commerce Website",
      description: "E-commerce storefront experience focused on product presentation, layout clarity and responsive shopping experience.",
      role: "Frontend / Software Development",
      technologies: ["React", "JavaScript", "HTML5", "CSS3", "Bootstrap"],
      features: ["Responsive storefront", "Product layout", "Navigation flow", "Customer-facing UI"],
      challenges: ["Design consistency across page types", "Responsive behavior for product browsing"],
      results: ["Clear customer-facing storefront experience"],
      githubUrl: "Source not publicly available",
      liveUrl: "Source not publicly available",
      caseStudyUrl: "Source not publicly available",
      image: "",
      visibility: "public",
    },
  ],
  education: {},
  careerPreferences: {
    preferredRoles: ["Software Developer", "Frontend Developer"],
    preferredLocations: ["Bengaluru, India"],
    workPreference: "Open to opportunities based on role fit and responsibilities.",
    availability: "Open to opportunities.",
  },
  professionalInterests: [
    "Frontend development",
    "Responsive UI development",
    "API integration",
    "Component-based architecture",
    "Performance-focused development",
    "Clean and maintainable code",
    "Working across frontend and backend",
  ],
  publicPersonalPreferences: [
    "Building user-focused web experiences",
    "Responsive interface design",
    "Scalable frontend architecture",
    "Product-driven development",
  ],
  contact: {
    email: "ayushkrsrivastava12@gmail.com",
    location: "Bengaluru, India",
    visibility: "public",
  },
  socialLinks: {
    github: "https://github.com/AyushDEvElopEr-200119?tab=repositories",
    linkedin: "https://www.linkedin.com/in/ayush-srivastava-6995a9301/",
    visibility: "public",
  },
  resume: {
    viewUrl: "preview",
    downloadUrl: "",
    visibility: "public",
  },
  compensation: {
    public: false,
    expectedCTC: null,
    visibility: "private",
  },
};
