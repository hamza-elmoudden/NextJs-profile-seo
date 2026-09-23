import type { ReactNode } from "react";

export type Service = {
  title: string;
  stack: string;
  description: string;
  icon: ReactNode;
};

export type Skill = {
  name: string;
  tag: string;
  icon: ReactNode;
  secondary?: boolean;
};

export type Post = {
  slug: string;
  tag: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
};

const skillIcon = (glyph: string) => (
  <div className="grid h-12 w-12 place-items-center rounded-md border border-edge bg-surface">
    <span className="font-mono text-[13px] font-bold">{glyph}</span>
  </div>
);

export const SERVICES: Service[] = [
  {
    title: "Backend Architecture",
    stack: "NestJS · FastAPI · Go",
    description:
      "Scalable, production-ready APIs designed for the long haul — not the demo.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="7" rx="1.5" />
        <rect x="2" y="14" width="20" height="7" rx="1.5" />
        <path d="M6 6.5h.01M6 17.5h.01M12 6.5h4M12 17.5h4" />
      </svg>
    ),
  },
  {
    title: "AI Integration",
    stack: "LLM pipelines · embeddings · RAG",
    description:
      "LLM pipelines, embeddings, RAG systems, and agents that behave in production.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a4 4 0 0 1 4 4c2.5.5 4 2.5 4 5a5 5 0 0 1-2 4c.5 2-1 4-3 4-.5 1.5-2 2.5-3.5 2.5S9 20.5 8.5 19c-2 0-3.5-2-3-4a5 5 0 0 1-2-4c0-2.5 1.5-4.5 4-5a4 4 0 0 1 4.5-4Z" />
        <path d="M12 8v8M9 11h6" />
      </svg>
    ),
  },
  {
    title: "Real-time Systems",
    stack: "WebSockets · event-driven · pub/sub",
    description:
      "WebSockets, event-driven architectures, pub/sub, and message queues that don't drop.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
      </svg>
    ),
  },
  {
    title: "Open Source / Library Design",
    stack: "zero-dep libs · framework internals",
    description:
      "Zero-dependency libraries and DX-first APIs built like framework internals.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
      </svg>
    ),
  },
];

export const SKILLS: Skill[] = [
  { name: "TypeScript", tag: "daily driver", icon: skillIcon("TS") },
  { name: "Node.js", tag: "runtime", icon: skillIcon("N") },
  { name: "NestJS", tag: "framework", icon: skillIcon("N") },
  { name: "Express", tag: "minimal", icon: skillIcon("Ex") },
  { name: "Python", tag: "ai / scripts", icon: skillIcon("Py") },
  { name: "FastAPI", tag: "async apis", icon: skillIcon("FA") },
  { name: "Go", tag: "systems", icon: skillIcon("Go") },
  { name: "PostgreSQL", tag: "primary db", icon: skillIcon("Pg") },
  { name: "Redis", tag: "cache / queue", icon: skillIcon("R") },
  { name: "MongoDB", tag: "documents", icon: skillIcon("Mo") },
  { name: "Docker", tag: "ship it", icon: skillIcon("D") },
  { name: "Git", tag: "versioning", icon: skillIcon("Gt") },
  { name: "Linux", tag: "home turf", icon: skillIcon("L") },
  { name: "React", tag: "secondary", icon: skillIcon("R"), secondary: true },
];

export const POSTS: Post[] = [
  {
    slug: "zero-dependency-route-broker-typescript",
    tag: "typescript",
    date: "2026-08-29",
    readTime: "12 min",
    title: "Building a Zero-Dependency Route Broker in TypeScript",
    excerpt:
      "No framework. No magic. Just a 400-line router that outperformed the one we were importing.",
  },
  {
    slug: "cqrs-in-nestjs-beyond-the-tutorial",
    tag: "nestjs",
    date: "2026-07-14",
    readTime: "9 min",
    title: "CQRS in NestJS: Beyond the Tutorial",
    excerpt:
      "The tutorial stops at commands and queries. Production adds sagas, idempotency, and regret.",
  },
  {
    slug: "why-i-rewrote-my-framework-in-go",
    tag: "go",
    date: "2026-05-30",
    readTime: "15 min",
    title: "Why I Rewrote My Framework in Go",
    excerpt:
      "Node got me to product-market fit. Go got me to a memory profile I could put on a slide.",
  },
];

export type BlogPost = {
  slug: string;
  tag: string;
  tags: string[];
  cover: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  pinned?: boolean;
};

export type BlogCategory = { id: string; label: string };

export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: "all", label: "all" },
  { id: "nestjs", label: "nestjs" },
  { id: "go", label: "go" },
  { id: "typescript", label: "typescript" },
  { id: "fastapi", label: "fastapi" },
  { id: "system-design", label: "system design" },
];

export type ProjectStatus = "live" | "wip" | "concept" | "paused" | "archived";

export type Project = {
  name: string;
  slug: string;
  initials: string;
  types: string[];
  filters: string[];
  status: ProjectStatus;
  statusLabel: string;
  pinned?: boolean;
  featured?: boolean;
  description: string;
  stack: string[];
  imageUrl?: string;
  imageAlt?: string;
  liveUrl?: string;
  githubUrl?: string;
};

export type ProjectFilter = { id: string; label: string };

export const PROJECT_FILTERS: ProjectFilter[] = [
  { id: "all", label: "All" },
  { id: "personal", label: "Personal" },
  { id: "saas", label: "SaaS" },
  { id: "opensource", label: "Open Source" },
  { id: "client", label: "Client Work" },
  { id: "side", label: "Side Project" },
];

const GITHUB = "https://github.com/hamza-elmoudden";

export const PROJECTS: Project[] = [
  {
    name: "SecureZone",
    slug: "securezone",
    initials: "SZ",
    types: ["SaaS", "Personal"],
    filters: ["personal", "saas"],
    status: "wip",
    statusLabel: "in progress",
    pinned: true,
    featured: true,
    description:
      "Zero-knowledge, zone-based secure file management and collaboration platform. End-to-end encryption with user-owned keys, multi-tenant architecture, and a self-hosted option. The file layer nobody wants to build but everybody needs.",
    stack: ["NestJS", "CQRS", "TypeScript", "PostgreSQL", "Redis", "E2E Encryption", "React"],
    liveUrl: "#",
    githubUrl: GITHUB,
  },
  {
    name: "Safa IA",
    slug: "safa-ia",
    initials: "Safa",
    types: ["SaaS", "AI"],
    filters: ["personal", "saas"],
    status: "wip",
    statusLabel: "in progress",
    pinned: true,
    description:
      "AI-powered skincare treatment platform. NestJS/CQRS backend with LLM integration and personalised recommendation engine.",
    stack: ["NestJS", "FastAPI", "LLM", "React"],
    liveUrl: "#",
    githubUrl: GITHUB,
  },
  {
    name: "PilotIQ",
    slug: "pilotiq",
    initials: "PIQ",
    types: ["Open Source"],
    filters: ["opensource", "personal"],
    status: "live",
    statusLabel: "live",
    description:
      "Zero-dependency TypeScript smart route broker library. A 400-line router that outperforms what you'd normally import.",
    stack: ["TypeScript", "zero-dep", "Node.js"],
    liveUrl: "#",
    githubUrl: GITHUB,
  },
  {
    name: "FastNest",
    slug: "fastnest",
    initials: "FN",
    types: ["Open Source"],
    filters: ["opensource", "personal"],
    status: "wip",
    statusLabel: "in progress",
    description:
      "NestJS-inspired Python framework built on FastAPI. Brings DI, modules, and decorators to the Python async ecosystem.",
    stack: ["Python", "FastAPI", "DI"],
    liveUrl: "#",
    githubUrl: GITHUB,
  },
  {
    name: "Zomra",
    slug: "zomra",
    initials: "Zmr",
    types: ["Personal", "Real-time"],
    filters: ["personal", "side"],
    status: "live",
    statusLabel: "live",
    description:
      "Real-time social events platform. NestJS/CQRS backend with WebSocket-powered live updates and React frontend.",
    stack: ["NestJS", "WebSockets", "CQRS", "React"],
    liveUrl: "#",
    githubUrl: GITHUB,
  },
  {
    name: "IPTV + Audiobooks Platform",
    slug: "iptv-audiobooks",
    initials: "IPTV",
    types: ["Client Work"],
    filters: ["client", "side"],
    status: "live",
    statusLabel: "live",
    description:
      "Two-site web platform — static IPTV reseller site and a React audiobooks storefront with streaming integration.",
    stack: ["React", "Node.js", "Static"],
    liveUrl: "#",
  },
  {
    name: "Anonymous Social Platform",
    slug: "anonymous-social",
    initials: "Anon",
    types: ["Personal", "SaaS"],
    filters: ["personal", "side"],
    status: "concept",
    statusLabel: "concept",
    description:
      "Privacy/anonymity-focused social media platform targeting Morocco and Arab countries. Twitter-like, zero identity required.",
    stack: ["NestJS", "React", "Privacy"],
    liveUrl: "#",
  },
  {
    name: "Go Backend Curriculum",
    slug: "go-backend-curriculum",
    initials: "Go",
    types: ["Personal"],
    filters: ["personal", "side"],
    status: "wip",
    statusLabel: "in progress",
    description:
      "Self-built multi-stage Go learning path from zero to distributed systems engineer. Currently at Stage 3 — Web layer & middleware.",
    stack: ["Go", "net/http", "chi"],
    githubUrl: GITHUB,
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "zero-dependency-route-broker",
    tag: "typescript",
    tags: ["typescript"],
    cover: "TS",
    date: "2026-09-10",
    readTime: "12 min",
    title: "Building a Zero-Dependency Route Broker in TypeScript",
    excerpt:
      "No framework. No magic. Just a 400-line router that outperformed the one we were importing.",
    pinned: true,
  },
  {
    slug: "nestjs-guards-vs-interceptors",
    tag: "nestjs",
    tags: ["nestjs"],
    cover: "Nest",
    date: "2026-08-14",
    readTime: "9 min",
    title: "NestJS Guards vs Interceptors: When to Use Which",
    excerpt:
      "I've seen guards used as interceptors and interceptors used as guards. Here's the actual mental model.",
  },
  {
    slug: "rewrote-framework-in-go",
    tag: "go",
    tags: ["go"],
    cover: "Go",
    date: "2026-07-30",
    readTime: "15 min",
    title: "Why I Rewrote My Framework in Go",
    excerpt:
      "Node got me to product-market fit. Go got me to a memory profile I could put on a slide.",
  },
  {
    slug: "multi-tenant-saas-backend",
    tag: "system-design",
    tags: ["system-design"],
    cover: "SYS",
    date: "2026-07-12",
    readTime: "18 min",
    title: "Designing a Multi-Tenant SaaS Backend from Scratch",
    excerpt:
      "Schema-per-tenant vs row-level security vs separate databases. The trade-offs nobody quantifies.",
  },
  {
    slug: "fastapi-dependency-injection",
    tag: "fastapi",
    tags: ["fastapi"],
    cover: "API",
    date: "2026-06-22",
    readTime: "11 min",
    title: "FastAPI Dependency Injection: The Parts That Actually Matter",
    excerpt:
      "Everyone shows the basics. Nobody shows what happens when you nest five dependencies and one of them is async.",
  },
  {
    slug: "go-channels-not-a-queue",
    tag: "go",
    tags: ["go"],
    cover: "Go",
    date: "2026-06-05",
    readTime: "8 min",
    title: "Go Channels Are Not a Queue",
    excerpt:
      "I used Go channels as a work queue in production. I was wrong about what that means. Here's what I learned.",
  },
  {
    slug: "event-sourcing-without-ceremony",
    tag: "nestjs",
    tags: ["nestjs"],
    cover: "Nest",
    date: "2026-05-18",
    readTime: "13 min",
    title: "Event Sourcing Without the Ceremony",
    excerpt:
      "A minimal event-sourcing implementation in NestJS that doesn't require three new libraries and a PhD.",
  },
  {
    slug: "typescript-decorators-weird",
    tag: "typescript",
    tags: ["typescript"],
    cover: "TS",
    date: "2026-04-30",
    readTime: "7 min",
    title: "TypeScript Decorators Are Weird. Here's How They Work.",
    excerpt:
      "Under the hood of the metadata that makes NestJS, TypeORM, and every DI system in TS tick.",
  },
  {
    slug: "real-cost-of-websockets",
    tag: "system-design",
    tags: ["system-design"],
    cover: "WS",
    date: "2026-04-10",
    readTime: "16 min",
    title: "The Real Cost of WebSockets at Scale",
    excerpt:
      "Connection count, memory pressure, sticky sessions, and how we handled 50k concurrent WS connections on two nodes.",
  },
];