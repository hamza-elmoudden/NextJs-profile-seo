import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostPage, { postMetadata } from "@/components/blog-post-page";
import { getAllPostSlugs, getPostFullBySlug } from "@/lib/posts";

// ISR: statically generate all posts at build time, then revalidate each
// page in the background at most every 60 seconds. dynamicParams (default
// true, exported for clarity) lets slugs published after the build render
// on first request and then be statically cached.
export const revalidate = 60;
export const dynamicParams = true;

type PostParams = { category: string; slug: string };

// Canonical post URL: /blog/<category-slug>/<post-slug>. The category
// segment must match the post's category (falls back to "post" when the
// post has no category); a mismatched category 404s.
export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((p) => ({ category: p.category ?? "post", slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PostParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  return postMetadata(await getPostFullBySlug(slug));
}

export default async function BlogPostRoute({
  params,
}: {
  params: Promise<PostParams>;
}) {
  const { category, slug } = await params;
  const post = await getPostFullBySlug(slug);
  if (!post || (post.category?.slug ?? "post") !== category) notFound();

  return <BlogPostPage post={post} />;
}
