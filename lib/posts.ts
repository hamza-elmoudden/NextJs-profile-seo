import { sanityClient } from "@/lib/sanity";
import type { SanityImage } from "@/lib/site-settings";
import type { BlogPost } from "@/lib/content";

export type PostAuthor = {
  name: string;
  slug: string | null;
  image: SanityImage | null;
};

export type PostTaxonomy = {
  title: string;
  slug: string | null;
};

export type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: (SanityImage & { caption?: string | null }) | null;
  publishedAt: string | null;
  featured: boolean;
  author: PostAuthor | null;
  category: PostTaxonomy | null;
  tags: PostTaxonomy[];
};

// Shared fetch options for ISR: the Sanity client sends an Authorization
// header, so Next.js will not cache these fetches unless force-cache is set.
// The "posts" tag matches app/api/revalidate/route.ts for future on-demand
// revalidation via revalidateTag("posts").
const POSTS_FETCH_OPTIONS = {
  cache: "force-cache" as const,
  next: { revalidate: 60, tags: ["posts"] as string[] },
};

const IMAGE_FRAGMENT = `
  asset->{url, metadata},
  alt,
  "caption": coalesce(caption, null)
`;

export const GET_POSTS = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage{${IMAGE_FRAGMENT}},
    publishedAt,
    featured,
    author->{name, "slug": slug.current, image},
    category->{title, "slug": slug.current},
    tags[]->{title, "slug": slug.current}
  }
`;

export const GET_FEATURED_POSTS = `
  *[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage{${IMAGE_FRAGMENT}},
    publishedAt,
    category->{title, "slug": slug.current},
    tags[]->{title, "slug": slug.current}
  }
`;

export async function getFeaturedPosts(): Promise<Post[]> {
  return sanityClient.fetch<Post[]>(GET_FEATURED_POSTS, {}, POSTS_FETCH_OPTIONS);
}

export async function getFeaturedPostCards(): Promise<BlogPost[]> {
  const posts = await getFeaturedPosts();
  return posts.map((post) => postToCard(post));
}

export async function getPosts(): Promise<Post[]> {
  return sanityClient.fetch<Post[]>(GET_POSTS, {}, POSTS_FETCH_OPTIONS);
}

export function postToCard(post: Post, pinnedSlugs: string[] = []): BlogPost {
  const categorySlug = post.category?.slug ?? "";
  const tagSlugs = (post.tags ?? [])
    .map((t) => t.slug)
    .filter((s): s is string => Boolean(s));
  const cover =
    post.coverImage?.asset?.url ??
    (post.category?.title ?? post.title).slice(0, 2).toUpperCase();
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "draft";

  return {
    slug: post.slug,
    tag: categorySlug || tagSlugs[0] || "post",
    tags: [categorySlug, ...tagSlugs].filter(Boolean),
    cover,
    date,
    readTime: "",
    title: post.title,
    excerpt: post.excerpt ?? "",
    pinned: post.featured || pinnedSlugs.includes(post.slug),
  };
}

export const GET_POST_BY_SLUG = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage{${IMAGE_FRAGMENT}},
    publishedAt,
    updatedAt,
    featured,
    author->{name, "slug": slug.current, image},
    category->{title, "slug": slug.current},
    tags[]->{title, "slug": slug.current}
  }
`;

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return sanityClient.fetch<Post | null>(GET_POST_BY_SLUG, { slug }, POSTS_FETCH_OPTIONS);
}

export type PostFull = Post & {
  updatedAt: string | null;
  body: unknown[] | null;
  author: (PostAuthor & {
    role: string | null;
    bio: unknown[] | null;
    socialLinks: { label?: string; url?: string }[] | null;
  }) | null;
  relatedPosts: {
    _id: string;
    title: string;
    slug: string | null;
    excerpt: string | null;
    publishedAt: string | null;
    category: PostTaxonomy | null;
  }[] | null;
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

export const GET_POST_FULL_BY_SLUG = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage{${IMAGE_FRAGMENT}},
    publishedAt,
    updatedAt,
    featured,
    body,
    author->{
      name,
      "slug": slug.current,
      image,
      role,
      bio,
      socialLinks
    },
    category->{title, "slug": slug.current},
    tags[]->{title, "slug": slug.current},
    relatedPosts[]->{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      category->{title, "slug": slug.current}
    },
    seo
  }
`;

export async function getPostFullBySlug(slug: string): Promise<PostFull | null> {
  return sanityClient.fetch<PostFull | null>(
    GET_POST_FULL_BY_SLUG,
    { slug },
    POSTS_FETCH_OPTIONS,
  );
}

export const GET_ALL_POST_SLUGS = `
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  return sanityClient.fetch<{ slug: string }[]>(
    GET_ALL_POST_SLUGS,
    {},
    POSTS_FETCH_OPTIONS,
  );
}
