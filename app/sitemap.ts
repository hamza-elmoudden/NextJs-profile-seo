import type { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity";

// sitemap.ts is a special Route Handler: it does NOT honor route segment
// config like `export const revalidate`, so ISR must be set on the fetch
// itself. The Sanity client sends an Authorization header, which makes
// Next.js skip caching unless cache: "force-cache" is set (same pattern as
// the *_FETCH_OPTIONS in lib/posts.ts, lib/projects.ts, lib/services.ts).
// The tags match the future /api/revalidate route for on-demand
// revalidation via revalidateTag("posts" | "projects" | "services").
const SITEMAP_REVALIDATE = 3600;

const POSTS_FETCH_OPTIONS = {
  cache: "force-cache" as const,
  next: { revalidate: SITEMAP_REVALIDATE, tags: ["posts"] as string[] },
};

const PROJECTS_FETCH_OPTIONS = {
  cache: "force-cache" as const,
  next: { revalidate: SITEMAP_REVALIDATE, tags: ["projects"] as string[] },
};

const SERVICES_FETCH_OPTIONS = {
  cache: "force-cache" as const,
  next: { revalidate: SITEMAP_REVALIDATE, tags: ["services"] as string[] },
};

const GET_SITEMAP_POSTS = `
  *[_type == "post" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) {
    "slug": slug.current,
    publishedAt,
    updatedAt
  }
`;

// The project and service schemas have no publishedAt/updatedAt fields
// (only posts do), so use Sanity's system timestamps for lastModified.
const GET_SITEMAP_PROJECTS = `
  *[_type == "project" && defined(slug.current)] | order(_updatedAt desc) {
    "slug": slug.current,
    "_createdAt": _createdAt,
    "_updatedAt": _updatedAt
  }
`;

const GET_SITEMAP_SERVICES = `
  *[_type == "service" && defined(slug.current)] | order(_updatedAt desc) {
    "slug": slug.current,
    "_createdAt": _createdAt,
    "_updatedAt": _updatedAt
  }
`;

type SitemapPost = {
  slug: string;
  publishedAt: string | null;
  updatedAt: string | null;
};

type SitemapDated = {
  slug: string;
  _createdAt: string;
  _updatedAt: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [posts, projects, services] = await Promise.all([
    sanityClient.fetch<SitemapPost[]>(GET_SITEMAP_POSTS, {}, POSTS_FETCH_OPTIONS),
    sanityClient.fetch<SitemapDated[]>(
      GET_SITEMAP_PROJECTS,
      {},
      PROJECTS_FETCH_OPTIONS,
    ),
    sanityClient.fetch<SitemapDated[]>(
      GET_SITEMAP_SERVICES,
      {},
      SERVICES_FETCH_OPTIONS,
    ),
  ]);

  // /blog, /projects, /services, /about, /contact all have real index pages.
  // No lastModified for static pages: the sitemap is ISR-cached, so a
  // new Date() here would only reflect generation time and make pages look
  // "modified" on every revalidation.
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt ?? undefined,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project._updatedAt ?? project._createdAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: service._updatedAt ?? service._createdAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...postPages, ...projectPages, ...servicePages];
}
