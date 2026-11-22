import type { Metadata } from "next";

// Single source of truth for site identity, keywords, and structured data.
// Next merges metadata *shallowly*: a page that sets `openGraph` or `twitter`
// replaces the layout's object wholesale. `buildMetadata` re-applies the site
// defaults (siteName, locale, url, fallback image) so every page keeps them.

export const SITE_NAME = "Hamza Elmouddane";
export const SITE_TAGLINE = "Backend & AI Engineer";
export const SITE_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const SITE_DESCRIPTION =
  "Hamza Elmouddane is a remote Backend & AI Engineer building scalable APIs, event-driven " +
  "systems, and LLM-powered products with NestJS, FastAPI, Go, and TypeScript for teams and " +
  "clients worldwide. Available for remote, freelance, and contract work.";
export const SITE_LOCALE = "en_US";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
  /\/+$/,
  "",
);

/** Turn a site-relative path into an absolute URL (absolute URLs pass through). */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const PERSON_SKILLS = [
  "Backend Development",
  "AI Engineering",
  "Large Language Models",
  "Retrieval-Augmented Generation",
  "System Design",
  "Distributed Systems",
  "Event-Driven Architecture",
  "CQRS",
  "Microservices",
  "REST API Design",
  "WebSockets",
  "NestJS",
  "FastAPI",
  "Node.js",
  "Go",
  "Python",
  "TypeScript",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
];

/** Site-wide keywords; pages append their own via `buildMetadata({ keywords })`. */
export const SITE_KEYWORDS = [
  "Hamza Elmouddane",
  "Backend Engineer",
  "AI Engineer",
  "Remote Backend Engineer",
  "Remote AI Engineer",
  "Freelance Backend Developer",
  "Freelance AI Engineer",
  "Contract Backend Developer",
  "Hire Remote Backend Developer",
  "Hire AI Engineer",
  "NestJS Developer",
  "FastAPI Developer",
  "Go Developer",
  "TypeScript Developer",
  "Node.js Developer",
  "Python Backend Developer",
  "LLM Engineer",
  "AI Integration",
  "RAG",
  "System Design",
  "Scalable APIs",
  "Microservices",
  "Event-Driven Architecture",
  "CQRS",
];

function uniqueKeywords(...lists: (readonly (string | null | undefined)[] | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const list of lists) {
    for (const k of list ?? []) {
      const v = k?.trim();
      if (!v || seen.has(v.toLowerCase())) continue;
      seen.add(v.toLowerCase());
      out.push(v);
    }
  }
  return out;
}

/**
 * Page title that cooperates with the root `%s — Hamza Elmouddane` template.
 * Titles that already carry the site name (e.g. from Sanity SEO fields) are
 * emitted as-is so the name is never doubled.
 */
// Matches "Hamza Elmouddane", "Hamza El Mouddane", "hamza elmouddane", …
function hasSiteName(title: string): boolean {
  return title.replace(/\s+/g, "").toLowerCase().includes(SITE_NAME.replace(/\s+/g, "").toLowerCase());
}

export function pageTitle(title: string): Metadata["title"] {
  return hasSiteName(title) ? { absolute: title } : title;
}

function fullTitle(title: string): string {
  return hasSiteName(title) ? title : `${title} — ${SITE_NAME}`;
}

type BuildMetadataInput = {
  title: string;
  description?: string | null;
  /** Site-relative path or absolute URL; used for canonical and og:url. */
  path: string;
  keywords?: readonly (string | null | undefined)[];
  image?: string | null;
  imageAlt?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  twitterCard?: "summary_large_image" | "summary";
  noIndex?: boolean | null;
  /** Article-specific Open Graph fields. */
  article?: {
    publishedTime?: string | null;
    modifiedTime?: string | null;
    authors?: string[];
    section?: string | null;
    tags?: string[];
  };
  defaultImage?: string | null;
};

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const description = input.description ?? SITE_DESCRIPTION;
  const ogTitle = input.ogTitle ?? fullTitle(input.title);
  const ogDescription = input.ogDescription ?? description;
  const image = input.image ?? input.defaultImage ?? undefined;
  const images = image ? [{ url: image, alt: input.imageAlt ?? ogTitle }] : undefined;
  const url = absoluteUrl(input.path);

  const base = {
    title: ogTitle,
    description: ogDescription,
    url,
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    images,
  };

  return {
    title: pageTitle(input.title),
    description,
    keywords: uniqueKeywords(input.keywords, SITE_KEYWORDS),
    // English content for a worldwide audience: no country variant, x-default = same URL.
    alternates: { canonical: input.path, languages: { en: input.path, "x-default": input.path } },
    // Always set robots: a page's `robots` replaces the layout's, even when undefined.
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
        },
    openGraph: input.article
      ? {
          ...base,
          type: "article",
          publishedTime: input.article.publishedTime ?? undefined,
          modifiedTime: input.article.modifiedTime ?? undefined,
          authors: input.article.authors,
          section: input.article.section ?? undefined,
          tags: input.article.tags,
        }
      : { ...base, type: "website" },
    twitter: {
      card: input.twitterCard ?? "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: image ? [image] : undefined,
    },
  };
}

// ── Structured data ─────────────────────────────────────────────────────────

/** Serialize JSON-LD for inline <script>; escapes `<` so content can't close the tag. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Validate a Sanity-provided JSON-LD string; returns it re-serialized or null. */
export function parseJsonLd(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    return jsonLdString(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** Reference to the site-wide Person entity declared in the root layout. */
export const personRef = { "@id": PERSON_ID } as const;

export function personSchema(opts: { sameAs?: string[]; image?: string | null; email?: string | null }) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    image: opts.image ?? undefined,
    email: opts.email ? `mailto:${opts.email}` : undefined,
    knowsLanguage: "en",
    knowsAbout: PERSON_SKILLS,
    sameAs: opts.sameAs?.length ? opts.sameAs : undefined,
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_TITLE,
    alternateName: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    author: personRef,
    publisher: personRef,
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function graph(...nodes: unknown[]) {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}
