import { sanityClient } from "@/lib/sanity";
import type { SanityImage } from "@/lib/site-settings";

export type Service = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  icon: string | null;
  featured: boolean;
  order: number;
};

export type ServiceFull = Service & {
  description: unknown[] | null;
  /** From an optional `relatedProjects` reference field (not in the Studio schema yet). */
  relatedProjectSlugs: string[] | null;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: SanityImage;
    twitterCard?: "summary_large_image" | "summary";
  } | null;
};

export const GET_SERVICES = `
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    icon,
    featured,
    order
  }
`;

const SERVICES_FETCH_OPTIONS = {
  cache: "force-cache" as const,
  next: { revalidate: 1500, tags: ["services"] as string[] },
};

export async function getServices(): Promise<Service[]> {
  return sanityClient.fetch<Service[]>(GET_SERVICES, {}, SERVICES_FETCH_OPTIONS);
}

export const GET_SERVICE_BY_SLUG = `
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    description,
    icon,
    featured,
    order,
    seo{..., ogImage{asset->{url}, alt}},
    "relatedProjectSlugs": relatedProjects[]->slug.current
  }
`;

export async function getServiceBySlug(slug: string): Promise<ServiceFull | null> {
  return sanityClient.fetch<ServiceFull | null>(GET_SERVICE_BY_SLUG, { slug }, SERVICES_FETCH_OPTIONS);
}

export const GET_ALL_SERVICE_SLUGS = `
  *[_type == "service" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export async function getAllServiceSlugs(): Promise<{ slug: string }[]> {
  return sanityClient.fetch<{ slug: string }[]>(GET_ALL_SERVICE_SLUGS, {}, SERVICES_FETCH_OPTIONS);
}

/**
 * Service → project links used until the Studio `service` schema gets a
 * `relatedProjects` reference array (which takes precedence when set).
 */
const SERVICE_RELATED_PROJECTS: Record<string, string[]> = {
  "backend-api-development": [
    "fastnest-modular-python-framework-for-fastapi",
    "pilotiq-linkedin-post-version-2",
    "safa-ai-powered-skincare-assistant",
  ],
  "ai-agent-and-chatbot-development": [
    "safa-ai-powered-skincare-assistant",
    "pilotiq-linkedin-post-version-2",
  ],
  "full-stack-applications": ["safa-ai-powered-skincare-assistant", "store-nexus"],
  "website-development": ["store-nexus"],
  "database-design": ["safa-ai-powered-skincare-assistant"],
};

export function relatedProjectSlugs(service: ServiceFull): string[] {
  const fromSanity = (service.relatedProjectSlugs ?? []).filter(Boolean);
  return fromSanity.length > 0 ? fromSanity : (SERVICE_RELATED_PROJECTS[service.slug] ?? []);
}
