import type { Metadata } from "next";

// Single source of truth for site identity, URLs, and structured data.
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

/**
 * Canonical origin, no trailing slash. Every absolute URL (metadataBase,
 * canonical, OG, sitemap, robots, JSON-LD, share links) is built from this.
 * Falls back to Vercel's production domain, then localhost for dev.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");

/** Turn a site-relative path into an absolute URL (absolute URLs pass through). */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** The site has a single author; byline, meta author and JSON-LD all use this. */
export const AUTHOR_NAME = SITE_NAME;
export const PERSON_JOB_TITLE = "Backend Developer";
export const PERSON_COUNTRY = "Morocco";

export const PERSON_SKILLS = ["NestJS", "Go", "Python", "FastAPI", "TypeScript", "AI agents"];

export const PERSON_SAME_AS = [
  "https://www.linkedin.com/in/hamza-elmouddane-08a140296/",
  "https://github.com/hamza-elmoudden",
  "https://www.instagram.com/hamza_elmouddane",
];

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
  // Sanity canonicalUrl values may lack a leading slash; always emit absolute URLs.
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
    // English content for a worldwide audience: no country variant, x-default = same URL.
    alternates: { canonical: url, languages: { en: url, "x-default": url } },
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

export const PROFILE_PAGE_ID = `${SITE_URL}/#profilepage`;

/**
 * Reference to the site Person. The full Person node lives on the home page;
 * other pages carry this self-contained stub (type + name + url) so each
 * page's graph validates on its own.
 */
export const personRef = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: AUTHOR_NAME,
  url: SITE_URL,
} as const;

export function personSchema(opts: { image?: string | null; email?: string | null }) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: PERSON_JOB_TITLE,
    description: SITE_DESCRIPTION,
    image: opts.image ?? undefined,
    email: opts.email ? `mailto:${opts.email}` : undefined,
    address: { "@type": "PostalAddress", addressCountry: PERSON_COUNTRY },
    knowsLanguage: "en",
    knowsAbout: PERSON_SKILLS,
    sameAs: PERSON_SAME_AS,
    mainEntityOfPage: { "@id": PROFILE_PAGE_ID },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}

export function profilePageSchema(opts: { name: string; description: string }) {
  return {
    "@type": "ProfilePage",
    "@id": PROFILE_PAGE_ID,
    url: SITE_URL,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
    about: { "@id": PERSON_ID },
    inLanguage: "en",
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
