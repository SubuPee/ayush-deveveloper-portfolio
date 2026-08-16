import { ayushProfile } from "@/data/ayushProfile";

export type AssistantIntent =
  | "ABOUT_IDENTITY"
  | "ABOUT_INTRO"
  | "ABOUT_WHAT_DOES"
  | "ABOUT_DEVELOPER_TYPE"
  | "ABOUT_LOCATION"
  | "ABOUT_EXPERTISE"
  | "EXPERIENCE_CURRENT_COMPANY"
  | "EXPERIENCE_CURRENT_ROLE"
  | "EXPERIENCE_YEARS"
  | "EXPERIENCE_PREVIOUS"
  | "EXPERIENCE_JOURNEY"
  | "EXPERIENCE_RESPONSIBILITIES"
  | "EXPERIENCE_COMPANIES"
  | "EXPERIENCE_TECHNOLOGIES"
  | "SKILLS_TECH_STACK"
  | "SKILLS_REACT"
  | "SKILLS_JAVASCRIPT"
  | "SKILLS_NODEJS"
  | "SKILLS_FRONTEND"
  | "SKILLS_BACKEND"
  | "SKILLS_REST_API"
  | "SKILLS_DATABASE"
  | "SKILLS_TOOLS"
  | "SKILLS_TYPESCRIPT"
  | "SKILLS_NEXTJS"
  | "SKILLS_STRONGEST"
  | "PROJECTS_LIST"
  | "PROJECTS_BEST"
  | "PROJECTS_IMPRESSIVE"
  | "PROJECTS_REACT"
  | "PROJECTS_FRONTEND_DEMO"
  | "PROJECTS_FULLSTACK"
  | "PROJECTS_ROLE"
  | "PROJECTS_TECH"
  | "PROJECTS_WHICH_FIRST"
  | "RECRUITER_WHY_HIRE"
  | "RECRUITER_REACT_FIT"
  | "RECRUITER_FRONTEND_FIT"
  | "RECRUITER_EXPERIENCE_LEVEL"
  | "RECRUITER_STRENGTHS"
  | "RECRUITER_ROLE_TYPE"
  | "RECRUITER_OPEN_TO"
  | "RECRUITER_COMPANY_FIT"
  | "RECRUITER_CONTRIBUTE"
  | "RECRUITER_INTERVIEW"
  | "RECRUITER_CONTACT"
  | "CAREER_CTC"
  | "CAREER_SALARY"
  | "CAREER_NEGOTIATION"
  | "CAREER_ROLE_TYPE"
  | "CAREER_FRONTEND_VS_FULLSTACK"
  | "CAREER_RELOCATION"
  | "CAREER_GOALS"
  | "PERSONAL_LIKES"
  | "PERSONAL_HOBBIES"
  | "PERSONAL_ENJOY"
  | "PERSONAL_TECH_INTERESTS"
  | "PERSONAL_PROJECT_INTERESTS"
  | "PERSONAL_DISLIKES"
  | "NAV_RESUME"
  | "NAV_GITHUB"
  | "NAV_LINKEDIN"
  | "NAV_EXPERIENCE"
  | "NAV_PROJECTS"
  | "NAV_SKILLS"
  | "NAV_CONTACT"
  | "UNKNOWN";

export type AssistantAction =
  | "experience"
  | "projects"
  | "resume"
  | "github"
  | "linkedin"
  | "mail"
  | "finder"
  | "preview";

export type AssistantResponse = {
  text: string;
  intent: AssistantIntent;
  source?: string;
  action?: AssistantAction;
};

// Synonym groups for intent detection
const synonymGroups = {
  "who-is": ["who is", "who's", "tell me about", "introduce", "give me an intro", "quick intro"],
  "what-does": ["what does", "what do they do", "what does he do", "what's he do"],
  "developer-type": ["what kind of developer", "what type of developer", "developer type", "what kind of dev"],
  "location": ["where", "based", "from", "location", "city", "country"],
  "expertise": ["expertise", "specialties", "areas of expertise", "main areas", "strengths", "good at"],
  "current-company": ["current company", "where work", "employer", "current employer", "where do you work", "where does he work"],
  "current-role": ["current role", "job title", "title", "what role", "what position"],
  "years-experience": ["how much experience", "years exp", "how long", "experience level", "professional experience"],
  "previous-company": ["previous company", "before current", "past company", "earlier work"],
  "professional-journey": ["professional journey", "career journey", "career path", "career background"],
  "responsibilities": ["responsibilities", "what do you do", "what does he do", "tasks"],
  "tech-stack": ["tech stack", "technology", "technologies", "stack", "frameworks", "tech"],
  "react": ["react", "reactjs", "react.js"],
  "javascript": ["javascript", "js"],
  "nodejs": ["node.js", "nodejs", "node"],
  "frontend": ["frontend", "front end", "front-end", "ui"],
  "backend": ["backend", "back end", "back-end", "server side", "api", "rest api"],
  "database": ["database", "sql", "mysql", "db", "database"],
  "tools": ["tools", "dev tools", "development tools"],
  "typescript": ["typescript", "ts"],
  "nextjs": ["next.js", "nextjs", "next"],
  "projects": ["projects", "project", "applications", "built", "developed", "portfolio"],
  "best-project": ["best project", "strongest project", "featured project", "top project"],
  "impressive-project": ["impressive project", "technically impressive", "complex project"],
  "fullstack": ["full-stack", "fullstack", "full stack"],
  "why-hire": ["why hire", "why should i hire", "reason to hire", "hire him"],
  "react-fit": ["react developer role", "react role", "suitable for react"],
  "frontend-fit": ["frontend role", "frontend developer", "suitable for frontend"],
  "strengths": ["strengths", "strong points", "qualities", "best skills"],
  "open-to": ["open to", "available", "opportunities"],
  "company-fit": ["company fit", "kind of company", "type of company"],
  "can-contribute": ["can contribute", "what can contribute", "expertise"],
  "interview": ["interview", "can interview", "interested", "want to interview"],
  "ctc": ["ctc", "salary", "compensation", "package", "expected ctc"],
  "relocation": ["relocation", "willing to relocate", "relocate"],
  "career-goals": ["career goals", "goals", "career objectives"],
  "likes": ["like", "enjoys", "interested in", "passion"],
  "hobbies": ["hobbies", "hobby", "interests", "do in free time"],
  "tech-interests": ["technology interests", "tech interests", "enjoy working with"],
  "project-interests": ["project interests", "kind of projects", "enjoys"],
  "resume": ["resume", "cv", "resume.pdf", "download resume", "view resume"],
  "github": ["github", "repository", "repositories", "source code"],
  "linkedin": ["linkedin", "professional profile"],
  "contact": ["contact", "reach", "email", "how to contact", "get in touch"],
};

const getCurrentCompany = () => {
  const current = ayushProfile.experience.find((e) => e.current);
  return current?.company || "Provab Technosoft";
};

const getCurrentRole = () => {
  const current = ayushProfile.experience.find((e) => e.current);
  return current?.role || "Software Developer";
};

const getPreviousExperience = () => {
  const sorted = [...ayushProfile.experience].sort((a, b) => {
    const aStart = parseInt(a.startYear || "0");
    const bStart = parseInt(b.startYear || "0");
    return bStart - aStart;
  });
  return sorted.find((e) => !e.current) || sorted[0];
};

const formatSkillsList = (items: string[]) => items.join(", ");

const fuzzyMatch = (input: string, token: string) => {
  const cleanInput = input.toLowerCase();
  const cleanToken = token.toLowerCase();
  if (cleanInput.includes(cleanToken)) return true;
  if (cleanToken.length <= 3) {
    return cleanInput.split(/\s+/).some((p) => p === cleanToken || p.startsWith(cleanToken));
  }
  const words = cleanInput.split(/\s+/);
  return words.some((word) => {
    if (word.length < 3) return false;
    let dist = 0;
    const minLen = Math.min(word.length, cleanToken.length);
    for (let i = 0; i < minLen; i += 1) {
      if (word[i] !== cleanToken[i]) dist += 1;
    }
    dist += Math.abs(word.length - cleanToken.length);
    return dist <= 2;
  });
};

const matchesSynonymGroup = (input: string, group: string[]) =>
  group.some((syn) => fuzzyMatch(input, syn) || input.toLowerCase().includes(syn.toLowerCase()));

export function detectIntent(question: string): AssistantIntent {
  const q = question.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

  // ABOUT SECTION
  if (
    matchesSynonymGroup(q, synonymGroups["who-is"]) &&
    !matchesSynonymGroup(q, synonymGroups["company-fit"])
  ) {
    return "ABOUT_IDENTITY";
  }
  if (matchesSynonymGroup(q, ["short intro", "quick intro", "intro about", "introduction"])) {
    return "ABOUT_INTRO";
  }
  if (matchesSynonymGroup(q, synonymGroups["what-does"])) {
    return "ABOUT_WHAT_DOES";
  }
  if (matchesSynonymGroup(q, synonymGroups["developer-type"])) {
    return "ABOUT_DEVELOPER_TYPE";
  }
  if (matchesSynonymGroup(q, synonymGroups["location"])) {
    return "ABOUT_LOCATION";
  }
  if (matchesSynonymGroup(q, synonymGroups["expertise"])) {
    return "ABOUT_EXPERTISE";
  }

  // EXPERIENCE SECTION
  if (matchesSynonymGroup(q, synonymGroups["current-company"])) {
    return "EXPERIENCE_CURRENT_COMPANY";
  }
  if (matchesSynonymGroup(q, synonymGroups["current-role"])) {
    return "EXPERIENCE_CURRENT_ROLE";
  }
  if (matchesSynonymGroup(q, synonymGroups["years-experience"])) {
    return "EXPERIENCE_YEARS";
  }
  if (matchesSynonymGroup(q, synonymGroups["previous-company"])) {
    return "EXPERIENCE_PREVIOUS";
  }
  if (matchesSynonymGroup(q, synonymGroups["professional-journey"])) {
    return "EXPERIENCE_JOURNEY";
  }
  if (matchesSynonymGroup(q, synonymGroups["responsibilities"])) {
    return "EXPERIENCE_RESPONSIBILITIES";
  }
  if (q.includes("companies") || q.includes("worked for")) {
    return "EXPERIENCE_COMPANIES";
  }
  if ((matchesSynonymGroup(q, synonymGroups["tech-stack"]) || matchesSynonymGroup(q, ["used professionally", "professional experience"])) && !q.includes("project")) {
    return "EXPERIENCE_TECHNOLOGIES";
  }

  // SKILLS SECTION
  if (matchesSynonymGroup(q, synonymGroups["tech-stack"])) {
    return "SKILLS_TECH_STACK";
  }
  if (matchesSynonymGroup(q, synonymGroups["react"])) {
    return "SKILLS_REACT";
  }
  if (matchesSynonymGroup(q, synonymGroups["javascript"])) {
    return "SKILLS_JAVASCRIPT";
  }
  if (matchesSynonymGroup(q, synonymGroups["nodejs"])) {
    return "SKILLS_NODEJS";
  }
  if (matchesSynonymGroup(q, synonymGroups["frontend"])) {
    return "SKILLS_FRONTEND";
  }
  if (matchesSynonymGroup(q, synonymGroups["backend"])) {
    return "SKILLS_BACKEND";
  }
  if (q.includes("rest api") || q.includes("rest apis")) {
    return "SKILLS_REST_API";
  }
  if (matchesSynonymGroup(q, synonymGroups["database"])) {
    return "SKILLS_DATABASE";
  }
  if (matchesSynonymGroup(q, synonymGroups["tools"])) {
    return "SKILLS_TOOLS";
  }
  if (matchesSynonymGroup(q, synonymGroups["typescript"])) {
    return "SKILLS_TYPESCRIPT";
  }
  if (matchesSynonymGroup(q, synonymGroups["nextjs"])) {
    return "SKILLS_NEXTJS";
  }
  if (matchesSynonymGroup(q, ["strongest skill", "strongest area", "best skill", "specialization"])) {
    return "SKILLS_STRONGEST";
  }

  // PROJECTS SECTION
  if (matchesSynonymGroup(q, synonymGroups["projects"]) && !matchesSynonymGroup(q, ["best", "impressive", "first"])) {
    return "PROJECTS_LIST";
  }
  if (matchesSynonymGroup(q, synonymGroups["best-project"])) {
    return "PROJECTS_BEST";
  }
  if (matchesSynonymGroup(q, synonymGroups["impressive-project"])) {
    return "PROJECTS_IMPRESSIVE";
  }
  if (matchesSynonymGroup(q, synonymGroups["react"]) && matchesSynonymGroup(q, synonymGroups["projects"])) {
    return "PROJECTS_REACT";
  }
  if ((matchesSynonymGroup(q, ["frontend", "front end"]) && matchesSynonymGroup(q, ["skill", "skills", "demonstrate"])) || matchesSynonymGroup(q, ["frontend projects", "frontend examples"])) {
    return "PROJECTS_FRONTEND_DEMO";
  }
  if (matchesSynonymGroup(q, synonymGroups["fullstack"]) && matchesSynonymGroup(q, ["project", "application"])) {
    return "PROJECTS_FULLSTACK";
  }
  if (q.includes("role in") || q.includes("your role")) {
    return "PROJECTS_ROLE";
  }
  if ((q.includes("project") || q.includes("projects")) && (q.includes("technology") || q.includes("tech"))) {
    return "PROJECTS_TECH";
  }
  if (matchesSynonymGroup(q, ["which project first", "which project to look at", "start with"])) {
    return "PROJECTS_WHICH_FIRST";
  }

  // RECRUITER SECTION
  if (matchesSynonymGroup(q, synonymGroups["why-hire"])) {
    return "RECRUITER_WHY_HIRE";
  }
  if (matchesSynonymGroup(q, synonymGroups["react-fit"]) || (matchesSynonymGroup(q, ["suitable for"]) && matchesSynonymGroup(q, ["react"]))) {
    return "RECRUITER_REACT_FIT";
  }
  if (matchesSynonymGroup(q, synonymGroups["frontend-fit"]) || (matchesSynonymGroup(q, ["suitable for"]) && matchesSynonymGroup(q, ["frontend"]))) {
    return "RECRUITER_FRONTEND_FIT";
  }
  if ((q.includes("enough experience") || q.includes("experience for")) && (q.includes("2") || q.includes("3") || q.includes("year"))) {
    return "RECRUITER_EXPERIENCE_LEVEL";
  }
  if (matchesSynonymGroup(q, synonymGroups["strengths"]) || matchesSynonymGroup(q, ["best qualities"])) {
    return "RECRUITER_STRENGTHS";
  }
  if ((q.includes("kind of") || q.includes("type of")) && (q.includes("role") || q.includes("position"))) {
    return "RECRUITER_ROLE_TYPE";
  }
  if (matchesSynonymGroup(q, synonymGroups["open-to"])) {
    return "RECRUITER_OPEN_TO";
  }
  if (matchesSynonymGroup(q, synonymGroups["company-fit"])) {
    return "RECRUITER_COMPANY_FIT";
  }
  if (matchesSynonymGroup(q, synonymGroups["can-contribute"])) {
    return "RECRUITER_CONTRIBUTE";
  }
  if (matchesSynonymGroup(q, synonymGroups["interview"])) {
    return "RECRUITER_INTERVIEW";
  }
  if (matchesSynonymGroup(q, synonymGroups["contact"])) {
    return "RECRUITER_CONTACT";
  }

  // CAREER SECTION
  if ((matchesSynonymGroup(q, synonymGroups["ctc"]) || matchesSynonymGroup(q, ["salary", "compensation"])) && !matchesSynonymGroup(q, ["negotiation"])) {
    return "CAREER_CTC";
  }
  if (matchesSynonymGroup(q, ["salary", "compensation"]) && !matchesSynonymGroup(q, ["ctc"])) {
    return "CAREER_SALARY";
  }
  if (matchesSynonymGroup(q, synonymGroups["relocation"])) {
    return "CAREER_RELOCATION";
  }
  if (matchesSynonymGroup(q, synonymGroups["career-goals"])) {
    return "CAREER_GOALS";
  }
  if ((q.includes("frontend") || q.includes("front end")) && (q.includes("fullstack") || q.includes("full stack"))) {
    return "CAREER_FRONTEND_VS_FULLSTACK";
  }
  if (matchesSynonymGroup(q, ["role type", "kind of role", "role looking for", "looking for role"])) {
    return "CAREER_ROLE_TYPE";
  }
  if (matchesSynonymGroup(q, ["negotiation", "negotiate"])) {
    return "CAREER_NEGOTIATION";
  }

  // PERSONAL SECTION
  if (matchesSynonymGroup(q, synonymGroups["likes"]) && !matchesSynonymGroup(q, ["technology", "tech"])) {
    return "PERSONAL_LIKES";
  }
  if (matchesSynonymGroup(q, synonymGroups["hobbies"])) {
    return "PERSONAL_HOBBIES";
  }
  if (matchesSynonymGroup(q, synonymGroups["enjoy"]) && !matchesSynonymGroup(q, ["technology", "tech", "project"])) {
    return "PERSONAL_ENJOY";
  }
  if ((matchesSynonymGroup(q, ["enjoy", "interests"]) && matchesSynonymGroup(q, ["technology", "tech"])) || matchesSynonymGroup(q, synonymGroups["tech-interests"])) {
    return "PERSONAL_TECH_INTERESTS";
  }
  if (matchesSynonymGroup(q, synonymGroups["project-interests"])) {
    return "PERSONAL_PROJECT_INTERESTS";
  }
  if (matchesSynonymGroup(q, ["dislike", "dislikes"])) {
    return "PERSONAL_DISLIKES";
  }

  // NAVIGATION SECTION
  if (matchesSynonymGroup(q, synonymGroups["resume"])) {
    return "NAV_RESUME";
  }
  if (matchesSynonymGroup(q, synonymGroups["github"])) {
    return "NAV_GITHUB";
  }
  if (matchesSynonymGroup(q, synonymGroups["linkedin"])) {
    return "NAV_LINKEDIN";
  }
  if (q.includes("experience") && (q.includes("show") || q.includes("view") || q.includes("open") || q.includes("see"))) {
    return "NAV_EXPERIENCE";
  }
  if (q.includes("projects") && (q.includes("show") || q.includes("view") || q.includes("open") || q.includes("see"))) {
    return "NAV_PROJECTS";
  }
  if (q.includes("skills") && (q.includes("show") || q.includes("view") || q.includes("open") || q.includes("see"))) {
    return "NAV_SKILLS";
  }

  return "UNKNOWN";
}

export function answerQuestion(question: string, _previousTopic?: string): AssistantResponse {
  const intent = detectIntent(question);

  // ABOUT SECTION
  if (intent === "ABOUT_IDENTITY") {
    return {
      intent,
      text: "Ayush Srivastava is a Software Developer / Frontend Developer with professional experience in building modern web applications. His primary focus is frontend development, responsive UI development, API integration, and modern JavaScript-based applications. He has worked with technologies including React.js, JavaScript, HTML5, CSS3, Bootstrap, Tailwind CSS, Node.js, REST APIs, Git and GitHub.",
      source: "About Ayush",
      action: "finder",
    };
  }

  if (intent === "ABOUT_INTRO") {
    return {
      intent,
      text: "Ayush Srivastava is a Software Developer focused primarily on frontend and web application development. He specializes in building responsive, interactive and maintainable web interfaces using modern JavaScript technologies, particularly React.js and related frontend tools. He also has experience with backend technologies and REST API integration.",
      source: "About Ayush",
      action: "finder",
    };
  }

  if (intent === "ABOUT_WHAT_DOES") {
    return {
      intent,
      text: "Ayush works as a Software Developer with a strong focus on frontend development. His work includes building responsive user interfaces, integrating APIs, developing reusable components, working with JavaScript and React, and contributing to modern web applications.",
      source: "About Ayush",
      action: "finder",
    };
  }

  if (intent === "ABOUT_DEVELOPER_TYPE") {
    return {
      intent,
      text: "Ayush is primarily a frontend-focused Software Developer. His strengths include React.js, JavaScript, responsive UI development, API integration, reusable component development and modern web application development. He also has backend knowledge with technologies such as Node.js and Express.js.",
      source: "About Ayush",
      action: "finder",
    };
  }

  if (intent === "ABOUT_LOCATION") {
    return {
      intent,
      text: "Ayush is based in Bengaluru, India.",
      source: "About Ayush",
      action: "finder",
    };
  }

  if (intent === "ABOUT_EXPERTISE") {
    return {
      intent,
      text: "Ayush's main areas of expertise include: Frontend development, React.js, JavaScript, Responsive web design, HTML5 and CSS3, API integration, REST APIs, UI development, Reusable component development, Git and GitHub, and Backend integration with Node.js and Express.js.",
      source: "About Ayush",
      action: "finder",
    };
  }

  // EXPERIENCE SECTION
  if (intent === "EXPERIENCE_CURRENT_COMPANY") {
    return {
      intent,
      text: `Ayush currently works at **${getCurrentCompany()}** as a Software Developer.`,
      source: "Professional Experience",
      action: "experience",
    };
  }

  if (intent === "EXPERIENCE_CURRENT_ROLE") {
    return {
      intent,
      text: `Ayush currently works as a ${getCurrentRole()}, with a strong focus on frontend and web application development.`,
      source: "Professional Experience",
      action: "experience",
    };
  }

  if (intent === "EXPERIENCE_YEARS") {
    return {
      intent,
      text: "Ayush has more than two years of professional Software Development experience.",
      source: "Professional Experience",
      action: "experience",
    };
  }

  if (intent === "EXPERIENCE_PREVIOUS") {
    const prev = getPreviousExperience();
    const text = prev
      ? `Before joining ${getCurrentCompany()}, Ayush worked at **${prev.company}** as a ${prev.role}.`
      : "I don't have verified information about Ayush's previous experience.";
    return {
      intent,
      text,
      source: "Professional Experience",
      action: "experience",
    };
  }

  if (intent === "EXPERIENCE_JOURNEY") {
    return {
      intent,
      text: `Ayush began his professional software development journey with experience at BlackBuck and later joined Provab Technosoft as a Software Developer. His career has focused primarily on web development, frontend technologies, responsive interfaces, API integration and modern application development.`,
      source: "Professional Experience",
      action: "experience",
    };
  }

  if (intent === "EXPERIENCE_RESPONSIBILITIES") {
    return {
      intent,
      text: "Ayush's responsibilities include: Frontend development, Building responsive user interfaces, Developing reusable UI components, JavaScript development, React development, API integration, REST API consumption, UI implementation, Debugging and troubleshooting, Working with Git and GitHub, and Contributing to web application development.",
      source: "Professional Experience",
      action: "experience",
    };
  }

  if (intent === "EXPERIENCE_COMPANIES") {
    return {
      intent,
      text: "Ayush has professional experience with: (1) BlackBuck, (2) Provab Technosoft. Provab Technosoft is his current company.",
      source: "Professional Experience",
      action: "experience",
    };
  }

  if (intent === "EXPERIENCE_TECHNOLOGIES") {
    return {
      intent,
      text: "Ayush's professional technology experience includes: HTML5, CSS3, JavaScript, React.js, Bootstrap, Tailwind CSS, Node.js, Express.js, REST APIs, MySQL / SQL, Git, GitHub, Figma, and Chrome DevTools.",
      source: "Professional Experience",
      action: "experience",
    };
  }

  // SKILLS SECTION
  if (intent === "SKILLS_TECH_STACK") {
    return {
      intent,
      text: `**Frontend:** ${formatSkillsList(ayushProfile.skills.frontend)}\n\n**Backend:** ${formatSkillsList(ayushProfile.skills.backend)}\n\n**Database:** ${formatSkillsList(ayushProfile.skills.database)}\n\n**Tools:** ${formatSkillsList(ayushProfile.skills.tools)}`,
      source: "Technical Skills",
      action: "finder",
    };
  }

  if (intent === "SKILLS_REACT") {
    return {
      intent,
      text: "Yes. React.js is one of Ayush's core frontend technologies.",
      source: "Technical Skills",
      action: "finder",
    };
  }

  if (intent === "SKILLS_JAVASCRIPT") {
    return {
      intent,
      text: "JavaScript is one of Ayush's primary frontend technologies. He uses JavaScript for interactive interfaces, frontend application development, API integration and web application functionality.",
      source: "Technical Skills",
      action: "finder",
    };
  }

  if (intent === "SKILLS_NODEJS") {
    return {
      intent,
      text: "Yes. Node.js is part of Ayush's backend technology experience.",
      source: "Technical Skills",
      action: "finder",
    };
  }

  if (intent === "SKILLS_FRONTEND") {
    return {
      intent,
      text: `Ayush's frontend technologies include: ${formatSkillsList(ayushProfile.skills.frontend)}.`,
      source: "Technical Skills",
      action: "finder",
    };
  }

  if (intent === "SKILLS_BACKEND") {
    return {
      intent,
      text: `Ayush has experience with ${formatSkillsList(ayushProfile.skills.backend)}.`,
      source: "Technical Skills",
      action: "finder",
    };
  }

  if (intent === "SKILLS_REST_API") {
    return {
      intent,
      text: "Yes. REST API integration is part of Ayush's professional development experience.",
      source: "Technical Skills",
      action: "finder",
    };
  }

  if (intent === "SKILLS_DATABASE") {
    return {
      intent,
      text: `Ayush has experience with ${formatSkillsList(ayushProfile.skills.database)}.`,
      source: "Technical Skills",
      action: "finder",
    };
  }

  if (intent === "SKILLS_TOOLS") {
    return {
      intent,
      text: `His development tools include ${formatSkillsList(ayushProfile.skills.tools)}.`,
      source: "Technical Skills",
      action: "finder",
    };
  }

  if (intent === "SKILLS_TYPESCRIPT") {
    return {
      intent,
      text: ayushProfile.skills.frontend.includes("TypeScript") || ayushProfile.skills.backend.includes("TypeScript")
        ? "Yes, TypeScript is included in Ayush's verified technical skills."
        : "TypeScript isn't currently listed in Ayush's verified public skill profile.",
      source: "Technical Skills",
      action: "finder",
    };
  }

  if (intent === "SKILLS_NEXTJS") {
    return {
      intent,
      text: ayushProfile.skills.frontend.includes("Next.js") ? "Yes, Next.js is included in Ayush's verified technical skills." : "Next.js isn't currently listed in Ayush's verified public skill profile.",
      source: "Technical Skills",
      action: "finder",
    };
  }

  if (intent === "SKILLS_STRONGEST") {
    return {
      intent,
      text: "Ayush's strongest area is frontend web development, particularly JavaScript, React.js, responsive UI development and API-integrated web applications.",
      source: "Technical Skills",
      action: "finder",
    };
  }

  // PROJECTS SECTION
  if (intent === "PROJECTS_LIST") {
    const projects = ayushProfile.projects.map((p) => p.name).join(", ");
    return {
      intent,
      text: `Ayush has worked on multiple web development projects, including: ${projects}.`,
      source: "Projects",
      action: "projects",
    };
  }

  if (intent === "PROJECTS_BEST") {
    const best = ayushProfile.projects.find((p) => p.featured) || ayushProfile.projects[0];
    return {
      intent,
      text: best ? `Ayush's featured project is **${best.name}**. You can explore his featured projects to evaluate his work.` : "Ayush's profile does not currently designate a single project as his 'best' project. You can explore his featured projects to evaluate his work.",
      source: "Projects",
      action: "projects",
    };
  }

  if (intent === "PROJECTS_IMPRESSIVE") {
    return {
      intent,
      text: "Ayush's projects showcase strong technical scope. You can explore them to evaluate his most technically impressive work.",
      source: "Projects",
      action: "projects",
    };
  }

  if (intent === "PROJECTS_REACT") {
    const reactProjects = ayushProfile.projects.filter((p) => p.tech && p.tech.some((t) => t.toLowerCase().includes("react")));
    const names = reactProjects.map((p) => p.name).join(", ");
    return {
      intent,
      text: reactProjects.length > 0 ? `Projects using React: ${names}.` : "Ayush has developed projects with React.js.",
      source: "Projects",
      action: "projects",
    };
  }

  if (intent === "PROJECTS_FRONTEND_DEMO") {
    return {
      intent,
      text: "Projects involving React.js, JavaScript, HTML, CSS, responsive design, UI development and API integration are the strongest examples of Ayush's frontend capabilities.",
      source: "Projects",
      action: "projects",
    };
  }

  if (intent === "PROJECTS_FULLSTACK") {
    const fullstack = ayushProfile.projects.some((p) => p.tech && p.tech.some((t) => ["Node.js", "Express.js", "Backend"].some((b) => t.includes(b))));
    return {
      intent,
      text: fullstack
        ? "Yes. Ayush has worked on full-stack applications involving frontend development together with backend/API technologies."
        : "The current public project profile does not explicitly identify a project as full-stack.",
      source: "Projects",
      action: "projects",
    };
  }

  if (intent === "PROJECTS_ROLE") {
    return {
      intent,
      text: "Ayush has contributed to areas including frontend development, UI implementation, responsive design, API integration and application functionality.",
      source: "Projects",
      action: "projects",
    };
  }

  if (intent === "PROJECTS_TECH") {
    return {
      intent,
      text: "Each project in Ayush's portfolio uses specific technologies. Explore the projects to see the technology stack for each.",
      source: "Projects",
      action: "projects",
    };
  }

  if (intent === "PROJECTS_WHICH_FIRST") {
    const featured = ayushProfile.projects.find((p) => p.featured);
    return {
      intent,
      text: featured ? `Start with **${featured.name}**, which demonstrates his skills best. You can also explore his other featured projects.` : "Start with Ayush's featured projects and choose the one most relevant to your role.",
      source: "Projects",
      action: "projects",
    };
  }

  // RECRUITER SECTION
  if (intent === "RECRUITER_WHY_HIRE") {
    return {
      intent,
      text: "Ayush brings professional experience in frontend and web application development, with practical experience using React.js, JavaScript, responsive UI development, API integration and modern web technologies. He also has backend experience with Node.js and REST APIs, allowing him to contribute beyond purely visual frontend implementation.",
      source: "Recruiter",
      action: "mail",
    };
  }

  if (intent === "RECRUITER_REACT_FIT") {
    return {
      intent,
      text: "Based on his verified profile, yes. React.js is one of Ayush's core frontend technologies, and his experience includes frontend development, responsive UI development and API integration.",
      source: "Recruiter",
      action: "mail",
    };
  }

  if (intent === "RECRUITER_FRONTEND_FIT") {
    return {
      intent,
      text: "Ayush's profile is strongly aligned with frontend development. His experience includes React.js, JavaScript, HTML5, CSS3, responsive UI development, API integration and reusable web interfaces.",
      source: "Recruiter",
      action: "mail",
    };
  }

  if (intent === "RECRUITER_EXPERIENCE_LEVEL") {
    return {
      intent,
      text: "Ayush has more than two years of professional Software Development experience. His experience level can be relevant to roles targeting approximately 2–3 years, depending on the specific technical and business requirements of the position.",
      source: "Recruiter",
      action: "mail",
    };
  }

  if (intent === "RECRUITER_STRENGTHS") {
    return {
      intent,
      text: "Based on his verified profile, Ayush's strengths include: Frontend development, React.js, JavaScript, Responsive UI development, API integration, Reusable component development, Practical web application development, and Learning and working across frontend and backend technologies.",
      source: "Recruiter",
      action: "mail",
    };
  }

  if (intent === "RECRUITER_ROLE_TYPE") {
    return {
      intent,
      text: "Ayush is primarily interested in Software Developer and Frontend Developer opportunities, particularly roles involving modern web technologies and frontend application development.",
      source: "Recruiter",
      action: "mail",
    };
  }

  if (intent === "RECRUITER_OPEN_TO") {
    return {
      intent,
      text: "Yes, Ayush is currently open to relevant Software Developer and Frontend Developer opportunities.",
      source: "Recruiter",
      action: "mail",
    };
  }

  if (intent === "RECRUITER_COMPANY_FIT") {
    return {
      intent,
      text: "A company where Ayush can work on modern web applications, frontend engineering, React-based development, API integration and meaningful software products would align well with his technical profile.",
      source: "Recruiter",
      action: "mail",
    };
  }

  if (intent === "RECRUITER_CONTRIBUTE") {
    return {
      intent,
      text: "Based on his verified profile, Ayush can contribute in areas involving: React.js, JavaScript, HTML5, CSS3, Responsive UI development, Bootstrap, Tailwind CSS, REST API integration, Node.js, Express.js, and Git and GitHub.",
      source: "Recruiter",
      action: "mail",
    };
  }

  if (intent === "RECRUITER_INTERVIEW") {
    return {
      intent,
      text: "Yes. If you are interested in discussing an opportunity with Ayush, you can contact him through the available contact options.",
      source: "Recruiter",
      action: "mail",
    };
  }

  if (intent === "RECRUITER_CONTACT") {
    return {
      intent,
      text: `You can reach Ayush via email at **${ayushProfile.contact.email}**. For professional context, his LinkedIn and GitHub are also available.`,
      source: "Recruiter",
      action: "mail",
    };
  }

  // CAREER SECTION
  if (intent === "CAREER_CTC") {
    if (!ayushProfile.compensation.public || !ayushProfile.compensation.expectedCTC) {
      return {
        intent,
        text: "Ayush's compensation expectations are not publicly disclosed. They can be discussed based on the role and responsibilities.",
        source: "Career",
        action: "resume",
      };
    }
    return {
      intent,
      text: `Ayush's expected CTC is ${ayushProfile.compensation.expectedCTC}.`,
      source: "Career",
      action: "resume",
    };
  }

  if (intent === "CAREER_SALARY") {
    if (!ayushProfile.compensation.public) {
      return {
        intent,
        text: "Ayush's compensation expectations are not publicly disclosed and can be discussed based on the role and responsibilities.",
        source: "Career",
        action: "resume",
      };
    }
    return {
      intent,
      text: `Ayush's expected salary / CTC is ${ayushProfile.compensation.expectedCTC}.`,
      source: "Career",
      action: "resume",
    };
  }

  if (intent === "CAREER_NEGOTIATION") {
    return {
      intent,
      text: "Ayush's negotiation preferences are not publicly specified.",
      source: "Career",
      action: "resume",
    };
  }

  if (intent === "CAREER_ROLE_TYPE") {
    return {
      intent,
      text: "Ayush is primarily interested in Software Developer and Frontend Developer opportunities involving modern web technologies and application development.",
      source: "Career",
      action: "finder",
    };
  }

  if (intent === "CAREER_FRONTEND_VS_FULLSTACK") {
    return {
      intent,
      text: "Ayush is primarily focused on Software Developer and Frontend Developer opportunities. He also has backend knowledge and experience with Node.js, Express.js and REST APIs.",
      source: "Career",
      action: "finder",
    };
  }

  if (intent === "CAREER_RELOCATION") {
    return {
      intent,
      text: "Ayush's relocation preference isn't currently specified in his public profile.",
      source: "Career",
      action: "finder",
    };
  }

  if (intent === "CAREER_GOALS") {
    return {
      intent,
      text: "Ayush's professional goal is to continue growing as a Software Developer, strengthen his frontend and full-stack capabilities, work on meaningful software products, and take on increasingly challenging development responsibilities.",
      source: "Career",
      action: "finder",
    };
  }

  // PERSONAL SECTION
  if (intent === "PERSONAL_LIKES") {
    const likes = ayushProfile.publicPersonalPreferences && ayushProfile.publicPersonalPreferences.length > 0;
    return {
      intent,
      text: likes ? `Ayush's public preferences include: ${ayushProfile.publicPersonalPreferences.join("; ")}.` : "I don't have verified public information about Ayush's personal preferences.",
      source: "Personal",
      action: "finder",
    };
  }

  if (intent === "PERSONAL_HOBBIES") {
    return {
      intent,
      text: "I don't have verified public information about Ayush's hobbies.",
      source: "Personal",
      action: "finder",
    };
  }

  if (intent === "PERSONAL_ENJOY") {
    return {
      intent,
      text: "I don't have verified public information about Ayush's personal interests.",
      source: "Personal",
      action: "finder",
    };
  }

  if (intent === "PERSONAL_TECH_INTERESTS") {
    return {
      intent,
      text: `Ayush's primary professional interests include: ${formatSkillsList(ayushProfile.professionalInterests)}.`,
      source: "Personal",
      action: "finder",
    };
  }

  if (intent === "PERSONAL_PROJECT_INTERESTS") {
    return {
      intent,
      text: "Ayush is particularly interested in modern web applications, interactive frontend experiences, dashboards, responsive interfaces and projects involving practical software development.",
      source: "Personal",
      action: "finder",
    };
  }

  if (intent === "PERSONAL_DISLIKES") {
    return {
      intent,
      text: "I don't have verified public information about Ayush's dislikes.",
      source: "Personal",
      action: "finder",
    };
  }

  // NAVIGATION SECTION
  if (intent === "NAV_RESUME") {
    return {
      intent,
      text: "Here is Ayush's resume.",
      source: "Navigation",
      action: "preview",
    };
  }

  if (intent === "NAV_GITHUB") {
    return {
      intent,
      text: "You can explore Ayush's GitHub profile and repositories here.",
      source: "Navigation",
      action: "github",
    };
  }

  if (intent === "NAV_LINKEDIN") {
    return {
      intent,
      text: "You can connect with Ayush on LinkedIn here.",
      source: "Navigation",
      action: "linkedin",
    };
  }

  if (intent === "NAV_EXPERIENCE") {
    return {
      intent,
      text: "Here's Ayush's professional experience.",
      source: "Navigation",
      action: "experience",
    };
  }

  if (intent === "NAV_PROJECTS") {
    return {
      intent,
      text: "Here are Ayush's featured projects.",
      source: "Navigation",
      action: "projects",
    };
  }

  if (intent === "NAV_SKILLS") {
    return {
      intent,
      text: "Here's Ayush's technical skill set.",
      source: "Navigation",
      action: "finder",
    };
  }

  // DEFAULT UNKNOWN
  return {
    intent: "UNKNOWN",
    text: "Sorry, I don't have information about that.",
    source: "Profile Knowledge",
  };
}

export function getSuggestedQuestions() {
  return [
    // About
    "Who is Ayush?",
    "Give me a quick introduction.",
    "What kind of developer is he?",
    // Experience
    "Where does Ayush currently work?",
    "What is his current role?",
    "How much experience does he have?",
    // Skills
    "What is Ayush's tech stack?",
    "Does he know React?",
    "What are his frontend skills?",
    "Does he know Node.js?",
    // Projects
    "What projects has he built?",
    "Which is his best project?",
    // Recruiter
    "Why should I hire Ayush?",
    "Is he suitable for a React role?",
    "What are his strengths?",
    "Is Ayush open to opportunities?",
    // Career & Contact
    "What type of role is he looking for?",
    "How can I contact Ayush?",
  ];
}
