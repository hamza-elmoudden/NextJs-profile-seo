import { sanityClient } from "@/lib/sanity";
import { SITE_URL } from "@/lib/seo";

// The MetadataRoute.Sitemap API (app/sitemap.ts) only supports `images` as
// plain URL strings, which emit bare <image:loc> entries. This route handler
// generates the sitemap XML by hand so project/post images also carry
// <image:title> and <image:caption> (populated from the Sanity image `alt`),
// which is what Google reads in place of an alt attribute in image sitemaps.
// Note: route handlers do NOT honor `export const revalidate`, so ISR is set
// on the Sanity fetches themselves (same pattern as the old sitemap.ts).
// Tags match the future /api/revalidate route (revalidateTag("posts") etc.).
const SITEMAP_REVALIDATE = 3600;

const FETCH_OPTIONS = (tag: string) =>
  ({
    cache: "force-cache" as const,
    next: { revalidate: SITEMAP_REVALIDATE, tags: [tag] as string[] },
  }) as const;

const GET_SITEMAP_POSTS = `
  *[_type == "post" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) {
    "slug": slug.current,
    title,
    "category": coalesce(category->slug.current, null),
    "imageUrl": coverImage.asset->url,
    "imageAlt": coverImage.alt,
    publishedAt,
    updatedAt
  }
`;

// The project and service schemas have no publishedAt/updatedAt fields
// (only posts do), so use Sanity's system timestamps for lastModified.
const GET_SITEMAP_PROJECTS = `
  *[_type == "project" && defined(slug.current)] | order(_updatedAt desc) {
    "slug": slug.current,
    title,
    "imageUrl": featuredImage.asset->url,
    "imageAlt": featuredImage.alt,
    "imageCaption": featuredImage.caption,
    "_createdAt": _createdAt,
    "_updatedAt": _updatedAt
  }
`;

// Only categories with at least one post: empty category pages are noindex.
const GET_SITEMAP_CATEGORIES = `
  *[_type == "category" && defined(slug.current) && count(*[_type == "post" && references(^._id)]) > 0] {
    "slug": slug.current,
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

type SitemapImage = {
  url: string;
  title?: string | null;
  caption?: string | null;
};

type SitemapUrl = {
  loc: string;
  lastmod?: string | null;
  changeFrequency?: string;
  priority?: number;
  images?: SitemapImage[];
};

type SitemapPost = {
  slug: string;
  title: string | null;
  category: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
};

type SitemapProject = {
  slug: string;
  title: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  imageCaption: string | null;
  _createdAt: string;
  _updatedAt: string;
};

type SitemapCategory = {
  slug: string;
  _updatedAt: string;
};

type SitemapService = {
  slug: string;
  _createdAt: string;
  _updatedAt: string;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toXml(urls: SitemapUrl[]): string {
  const entries = urls
    .map((url) => {
      const parts = [`<loc>${escapeXml(url.loc)}</loc>`];
      for (const image of url.images ?? []) {
        parts.push(
          "<image:image>",
          `<image:loc>${escapeXml(image.url)}</image:loc>`,
          ...(image.title ? [`<image:title>${escapeXml(image.title)}</image:title>`] : []),
          ...(image.caption ? [`<image:caption>${escapeXml(image.caption)}</image:caption>`] : []),
          "</image:image>",
        );
      }
      if (url.lastmod) parts.push(`<lastmod>${escapeXml(url.lastmod)}</lastmod>`);
      if (url.changeFrequency)
        parts.push(`<changefreq>${url.changeFrequency}</changefreq>`);
      if (url.priority !== undefined) parts.push(`<priority>${url.priority}</priority>`);
      return `<url>\n${parts.map((p) => `  ${p}`).join("\n")}\n</url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${entries}
</urlset>
`;
}

export async function GET() {
  // SITE_URL has no trailing slash, so `${baseUrl}/x` never doubles up.
  const baseUrl = SITE_URL;

  const [posts, categories, projects, services] = await Promise.all([
    sanityClient.fetch<SitemapPost[]>(GET_SITEMAP_POSTS, {}, FETCH_OPTIONS("posts")),
    sanityClient.fetch<SitemapCategory[]>(
      GET_SITEMAP_CATEGORIES,
      {},
      FETCH_OPTIONS("posts"),
    ),
    sanityClient.fetch<SitemapProject[]>(
      GET_SITEMAP_PROJECTS,
      {},
      FETCH_OPTIONS("projects"),
    ),
    sanityClient.fetch<SitemapService[]>(
      GET_SITEMAP_SERVICES,
      {},
      FETCH_OPTIONS("services"),
    ),
  ]);

  // /blog, /projects, /services, /about, /contact all have real index pages.
  // No lastModified for static pages: the sitemap is ISR-cached, so a
  // new Date() here would only reflect generation time and make pages look
  // "modified" on every revalidation.
  const urls: SitemapUrl[] = [
    { loc: baseUrl, changeFrequency: "weekly", priority: 1 },
    { loc: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { loc: `${baseUrl}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { loc: `${baseUrl}/services`, changeFrequency: "monthly", priority: 0.7 },
    { loc: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { loc: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
    ...categories.map((category): SitemapUrl => ({
      loc: `${baseUrl}/blog/${category.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
    ...posts.map((post): SitemapUrl => ({
      loc: `${baseUrl}/blog/${post.category ?? "post"}/${post.slug}`,
      lastmod: post.updatedAt ?? post.publishedAt,
      changeFrequency: "weekly",
      priority: 0.6,
      images: post.imageUrl
        ? [{ url: post.imageUrl, title: post.title, caption: post.imageAlt }]
        : [],
    })),
    ...projects.map((project): SitemapUrl => ({
      loc: `${baseUrl}/projects/${project.slug}`,
      lastmod: project._updatedAt ?? project._createdAt,
      changeFrequency: "monthly",
      priority: 0.7,
      images: project.imageUrl
        ? [
            {
              url: project.imageUrl,
              title: project.title,
              // Google has no <image:alt>; the caption field is where alt
              // text belongs in an image sitemap.
              caption: project.imageCaption ?? project.imageAlt,
            },
          ]
        : [],
    })),
    ...services.map((service): SitemapUrl => ({
      loc: `${baseUrl}/services/${service.slug}`,
      lastmod: service._updatedAt ?? service._createdAt,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];

  return new Response(toXml(urls), {
    headers: { "Content-Type": "application/xml" },
  });
}
