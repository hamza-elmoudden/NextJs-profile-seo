import { sanityClient } from "@/lib/sanity";
import type { SanityImage } from "@/lib/site-settings";

export interface PostsPage {
  heading: string;
  subheading: string | null;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string | null;
  noIndex: boolean | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: SanityImage | null;
  twitterCard: "summary_large_image" | "summary" | null;
  structuredDataName: string | null;
  structuredDataDescription: string | null;
  jsonLd: string | null;
  postsPerPage: number | null;
  showCategoryFilter: boolean | null;
  showTagFilter: boolean | null;
  newsletterCtaLabel: string | null;
  newsletterCtaSubtext: string | null;
  pinnedPosts: { slug: string | null }[] | null;
  featuredPost: { slug: string | null } | null;
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
  description: string | null;
  image: SanityImage | null;
  postCount: number;
}

export const GET_POSTS_PAGE = `*[_type == "postsPage"][0] {
  heading,
  subheading,
  metaTitle,
  metaDescription,
  canonicalUrl,
  noIndex,
  ogTitle,
  ogDescription,
  ogImage {
    asset-> { url },
    alt
  },
  twitterCard,
  structuredDataName,
  structuredDataDescription,
  jsonLd,
  postsPerPage,
  showCategoryFilter,
  showTagFilter,
  newsletterCtaLabel,
  newsletterCtaSubtext,
  pinnedPosts[]->{"slug": slug.current},
  featuredPost->{"slug": slug.current}
}`;

export const GET_CATEGORIES = `*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  image {
    asset-> { url },
    alt,
    "caption": coalesce(caption, null)
  },
  "postCount": count(*[_type == "post" && references(^._id)])
}`;

export const GET_CATEGORY_BY_SLUG = `*[_type == "category" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  image {
    asset-> { url },
    alt,
    "caption": coalesce(caption, null)
  },
  "postCount": count(*[_type == "post" && references(^._id)])
}`;

// Category pages are ISR; the "posts" tag matches app/api/revalidate/route.ts.
const CATEGORY_FETCH_OPTIONS = {
  cache: "force-cache" as const,
  next: { revalidate: 60, tags: ["posts"] as string[] },
};

export async function getPostsPage(): Promise<PostsPage | null> {
  return sanityClient.fetch<PostsPage | null>(GET_POSTS_PAGE);
}

export async function getCategories(): Promise<Category[]> {
  return sanityClient.fetch<Category[]>(GET_CATEGORIES);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return sanityClient.fetch<Category | null>(
    GET_CATEGORY_BY_SLUG,
    { slug },
    CATEGORY_FETCH_OPTIONS,
  );
}

export async function getCategorySlugs(): Promise<string[]> {
  return sanityClient.fetch<string[]>(
    `*[_type == "category" && defined(slug.current)].slug.current`,
    {},
    CATEGORY_FETCH_OPTIONS,
  );
}
