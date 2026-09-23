import { sanityClient } from "@/lib/sanity";
import type { SanityImage } from "@/lib/site-settings";
import type { Project, ProjectStatus } from "@/lib/content";

export type ProjectType = "personal" | "client" | "opensource" | "saas" | "side";
export type ProjectStatusValue = "idea" | "inProgress" | "completed" | "archived";

export type SanityTechnology = {
  name: string;
  slug: string | null;
};

export type SanityProject = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  featuredImage: SanityImage | null;
  projectType: ProjectType | null;
  status: ProjectStatusValue | null;
  featured: boolean | null;
  startDate: string | null;
  endDate: string | null;
  technologies: SanityTechnology[] | null;
  githubUrl: string | null;
  liveUrl: string | null;
};

export type SanityProjectFull = SanityProject & {
  description: unknown[] | null;
  gallery: SanityImage[] | null;
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

const IMAGE_FRAGMENT = `asset->{url, metadata}, alt, "caption": coalesce(caption, null)`;

// Shared fetch options for ISR: the Sanity client sends an Authorization
// header, so Next.js will not cache these fetches unless force-cache is set.
// The "projects" tag enables future on-demand revalidation via
// revalidateTag("projects").
const PROJECTS_FETCH_OPTIONS = {
  cache: "force-cache" as const,
  next: { revalidate: 60, tags: ["projects"] as string[] },
};

export const GET_PROJECTS = `
  *[_type == "project"] | order(featured desc, order asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    featuredImage{${IMAGE_FRAGMENT}},
    projectType,
    status,
    featured,
    startDate,
    endDate,
    technologies[]->{name, "slug": slug.current},
    githubUrl,
    liveUrl
  }
`;

export async function getProjects(): Promise<SanityProject[]> {
  return sanityClient.fetch<SanityProject[]>(GET_PROJECTS, {}, PROJECTS_FETCH_OPTIONS);
}

export const GET_FEATURED_PROJECTS = `
  *[_type == "project" && featured == true] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    featuredImage{${IMAGE_FRAGMENT}},
    projectType,
    featured,
    technologies[]->{name, "slug": slug.current},
    githubUrl,
    liveUrl
  }
`;

export async function getFeaturedProjects(): Promise<SanityProject[]> {
  return sanityClient.fetch<SanityProject[]>(
    GET_FEATURED_PROJECTS,
    {},
    PROJECTS_FETCH_OPTIONS,
  );
}

export const GET_PROJECT_BY_SLUG = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    featuredImage{${IMAGE_FRAGMENT}},
    projectType,
    status,
    featured,
    startDate,
    endDate,
    technologies[]->{name, "slug": slug.current},
    githubUrl,
    liveUrl,
    description,
    gallery[]{${IMAGE_FRAGMENT}},
    seo
  }
`;

export async function getProjectBySlug(slug: string): Promise<SanityProjectFull | null> {
  return sanityClient.fetch<SanityProjectFull | null>(
    GET_PROJECT_BY_SLUG,
    { slug },
    PROJECTS_FETCH_OPTIONS,
  );
}

export const GET_ALL_PROJECT_SLUGS = `
  *[_type == "project" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export async function getAllProjectSlugs(): Promise<{ slug: string }[]> {
  return sanityClient.fetch<{ slug: string }[]>(
    GET_ALL_PROJECT_SLUGS,
    {},
    PROJECTS_FETCH_OPTIONS,
  );
}

const TYPE_LABELS: Record<ProjectType, string> = {
  personal: "Personal",
  client: "Client Work",
  opensource: "Open Source",
  saas: "SaaS",
  side: "Side Project",
};

const STATUS_MAP: Record<ProjectStatusValue, { status: ProjectStatus; label: string }> = {
  idea: { status: "concept", label: "concept" },
  inProgress: { status: "wip", label: "in progress" },
  completed: { status: "live", label: "live" },
  archived: { status: "archived", label: "archived" },
};

export function projectToCard(sanityProject: SanityProject, pinnedSlugs?: string[]): Project {
  const type = sanityProject.projectType ?? "personal";
  const status = STATUS_MAP[sanityProject.status ?? "inProgress"] ?? STATUS_MAP.inProgress;
  const words = sanityProject.title.trim().split(/\s+/);

  return {
    name: sanityProject.title,
    slug: sanityProject.slug,
    initials: words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2),
    types: [TYPE_LABELS[type] ?? type],
    filters: [type],
    status: status.status,
    statusLabel: status.label,
    pinned: pinnedSlugs ? pinnedSlugs.includes(sanityProject.slug) : sanityProject.featured ?? false,
    featured: sanityProject.featured ?? false,
    description: sanityProject.shortDescription,
    stack: (sanityProject.technologies ?? []).map((t) => t.name),
    imageUrl: sanityProject.featuredImage?.asset?.url ?? undefined,
    imageAlt: sanityProject.featuredImage?.alt ?? undefined,
    liveUrl: sanityProject.liveUrl ?? undefined,
    githubUrl: sanityProject.githubUrl ?? undefined,
  };
}
