import type { Metadata } from "next";
import Link from "next/link";
import PortableBody from "@/components/portable-body";
import JsonLd from "@/components/json-ld";
import type { PostFull, RelatedPost } from "@/lib/posts";
import {
  AUTHOR_NAME,
  absoluteUrl,
  breadcrumbSchema,
  buildMetadata,
  graph,
  personRef,
} from "@/lib/seo";

function formatDate(iso: string | null) {
  return iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;
}

function estimateReadTime(post: PostFull): number {
  const text = JSON.stringify(post.body ?? []).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(text / 200));
}

function postPath(post: PostFull): string {
  return `/blog/${post.category?.slug ?? "post"}/${post.slug}`;
}

/**
 * Up to 3 related posts: hand-picked ones first, then same-category posts,
 * then the newest posts if the category has fewer than 2 others.
 */
function relatedPosts(post: PostFull): (RelatedPost & { slug: string })[] {
  const seen = new Set<string>();
  const out: (RelatedPost & { slug: string })[] = [];
  const add = (list: RelatedPost[] | null) => {
    for (const p of list ?? []) {
      if (out.length >= 3 || !p.slug || seen.has(p._id) || p._id === post._id) continue;
      seen.add(p._id);
      out.push(p as RelatedPost & { slug: string });
    }
  };
  add(post.relatedPosts);
  add(post.sameCategoryPosts);
  if (out.length < 2) add(post.latestPosts);
  return out;
}

function postKeywords(post: PostFull): string[] {
  return [
    ...(post.category ? [post.category.title] : []),
    ...(post.tags ?? []).map((t) => t.title),
  ].filter(Boolean);
}

export function postMetadata(post: PostFull | null): Metadata {
  if (!post) return { title: "Post not found", robots: { index: false } };

  const keywords = postKeywords(post);
  const ogImage = post.seo?.ogImage?.asset?.url ? post.seo.ogImage : post.coverImage;
  return buildMetadata({
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    path: post.seo?.canonicalUrl ?? postPath(post),
    noIndex: post.seo?.noIndex,
    ogTitle: post.seo?.ogTitle,
    ogDescription: post.seo?.ogDescription,
    image: ogImage?.asset?.url,
    imageAlt: ogImage?.alt?.trim() || post.title,
    twitterCard: post.seo?.twitterCard,
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [AUTHOR_NAME],
      section: post.category?.title,
      tags: keywords,
    },
  });
}

export default function BlogPostPage({ post }: { post: PostFull }) {
  const published = formatDate(post.publishedAt);
  const updated = formatDate(post.updatedAt);
  const readTime = estimateReadTime(post);
  const taxonomy = [...(post.category ? [post.category] : []), ...(post.tags ?? [])];
  const related = relatedPosts(post);
  const coverUrl = post.coverImage?.asset?.url;

  const path = postPath(post);
  const postUrl = absoluteUrl(path);
  // Generated from the post's Sanity fields. The post.jsonLd text field is
  // intentionally not used: existing values pointed at an old domain.
  const jsonLd = graph(
    {
      "@type": "BlogPosting",
      "@id": `${postUrl}#article`,
      url: postUrl,
      mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
      headline: post.title,
      description: post.seo?.metaDescription ?? post.excerpt ?? undefined,
      datePublished: post.publishedAt ?? undefined,
      dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
      image: coverUrl,
      author: personRef,
      publisher: personRef,
      isPartOf: { "@id": `${absoluteUrl("/blog")}#blog` },
      articleSection: post.category?.title,
      keywords: postKeywords(post).join(", ") || undefined,
      timeRequired: `PT${readTime}M`,
      inLanguage: "en",
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      ...(post.category?.slug
        ? [{ name: post.category.title, path: `/blog/${post.category.slug}` }]
        : []),
      { name: post.title, path },
    ]),
      );

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── POST HERO (split) ─────────────────────── */}
      <section className="relative overflow-hidden border-b border-edge py-[72px]">
        <div className="bg-grid-faint pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_580px]">
          <div>
            <Link
              href="/blog"
              className="hero-reveal mb-8 inline-flex items-center gap-1.5 font-mono text-[13px] text-terminal transition-colors hover:text-amber"
            >
              ← cd ~/blog
            </Link>
            <div className="hero-reveal mb-[18px] flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted">
              {taxonomy.map((t) => (
                <span
                  key={t.slug ?? t.title}
                  className="rounded-[4px] border border-edge px-2 py-0.5 text-terminal"
                >
                  {t.title}
                </span>
              ))}
              {published ? <span>{published}</span> : <span>draft</span>}
              <span>· {readTime} min read</span>
            </div>
            <h1 className="hero-reveal reveal-d1 mb-[18px] max-w-[860px] font-display text-[clamp(30px,4vw,52px)] font-bold leading-[1.15] tracking-tight">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="hero-reveal reveal-d2 max-w-[640px] text-[17px] leading-[1.7] text-muted">
                {post.excerpt}
              </p>
            ) : null}
            {/* Byline name always comes from AUTHOR_NAME; image/role from the Sanity author doc. */}
            <div className="hero-reveal reveal-d3 mt-8 flex items-center gap-3">
              {post.author?.image?.asset?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.author.image.asset.url}
                  alt={post.author.image.alt ?? AUTHOR_NAME}
                  className="h-10 w-10 rounded-full border border-edge object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-edge bg-card font-mono text-xs text-terminal">
                  {AUTHOR_NAME.split(" ").map((w) => w[0]).join("").toUpperCase()}
                </span>
              )}
              <div>
                <p className="font-mono text-[13px] text-cream">{AUTHOR_NAME}</p>
                {post.author?.role ? (
                  <p className="font-mono text-[11px] text-terminal">{post.author.role}</p>
                ) : null}
              </div>
            </div>
            <div className="hero-reveal reveal-d3 mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px] text-muted">
              <span className="text-terminal">● published</span>
              <span>·</span>
              <span>{published ?? "draft"}</span>
              <span>·</span>
              <span>{readTime} min read</span>
            </div>
          </div>

          {coverUrl ? (
            <figure className="hero-reveal reveal-d2 overflow-hidden rounded-md border border-edge">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl} alt={post.coverImage?.alt ?? post.title} className="w-full" />
              <figcaption className="border-t border-edge bg-card px-4 py-2.5 text-center font-mono text-[11px] text-muted">
                {post.coverImage?.caption ?? `cover — ${post.title}`}
              </figcaption>
            </figure>
          ) : null}
        </div>
      </section>

      {/* ── BODY ──────────────────────────────────── */}
      <section className="border-b border-edge py-[64px]">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
          <article className="max-w-[720px]">
            <PortableBody body={post.body} fallbackAlt={post.title} />
            {updated ? (
              <p className="mt-10 border-t border-edge pt-5 font-mono text-[11px] text-muted">
                last updated: <span className="text-terminal">{updated}</span>
              </p>
            ) : null}
          </article>

          {/* ── SIDE META ─────────────────────────── */}
          <aside className="space-y-5 lg:sticky lg:top-[92px] lg:self-start">
            <div className="card p-5">
              <p className="section-label mb-4">meta</p>
              <dl className="space-y-3 font-mono text-[12px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">status</dt>
                  <dd className="text-terminal">● published</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">date</dt>
                  <dd className="text-cream">{published ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">read time</dt>
                  <dd className="text-cream">{readTime} min</dd>
                </div>
                {post.category ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">category</dt>
                    <dd className="text-amber">{post.category.title}</dd>
                  </div>
                ) : null}
              </dl>
              {post.tags?.length ? (
                <div className="mt-5 border-t border-edge pt-4">
                  <p className="mb-3 font-mono text-[11px] text-muted">tags</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <span
                        key={t.slug ?? t.title}
                        className="rounded-[4px] border border-edge px-2 py-0.5 font-mono text-[11px] text-terminal"
                      >
                        {t.title}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="card p-5">
              <p className="section-label mb-3">init discussion</p>
              <h3 className="mb-2 font-display text-[16px] font-semibold leading-snug text-cream">
                Want to dig deeper into this?
              </h3>
              <p className="mb-4 text-sm leading-[1.6] text-muted">
                If this post sparked an idea, a question, or a project — let&apos;s talk.
              </p>
              <Link href="/contact" className="btn btn-primary">
                Let&apos;s Talk →
              </Link>
            </div>

            <p className="font-mono text-[11px] text-muted">
              share →{" "}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-amber"
              >
                x
              </a>
              {" / "}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-amber"
              >
                linkedin
              </a>
            </p>
          </aside>
        </div>
      </section>

      {/* ── RELATED POSTS ───────────────────────── */}
      {related.length > 0 ? (
        <section className="border-b border-edge bg-base py-[72px]">
          <div className="container-x">
            <p className="section-label">cat related.posts</p>
            <h2 className="mt-3 font-display text-[clamp(22px,2.4vw,28px)] font-bold text-cream">
              Related posts
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 xl:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p._id}
                  href={`/blog/${p.category?.slug ?? "post"}/${p.slug}`}
                  className="card group flex flex-col p-[22px] transition-colors duration-150 hover:border-amber"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted">
                    {p.category ? (
                      <span className="rounded-[4px] border border-edge px-2 py-0.5 text-terminal">
                        {p.category.title}
                      </span>
                    ) : null}
                    {formatDate(p.publishedAt) ? <span>{formatDate(p.publishedAt)}</span> : null}
                  </div>
                  <h3 className="mb-3 font-display text-[17px] font-semibold leading-snug text-cream transition-colors group-hover:text-amber-gold">
                    {p.title}
                  </h3>
                  {p.excerpt ? (
                    <p className="flex-1 text-sm leading-[1.6] text-muted">
                      {p.excerpt.slice(0, 140)}
                      {p.excerpt.length > 140 ? "…" : ""}
                    </p>
                  ) : null}
                  <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-amber transition-[gap] duration-150 group-hover:gap-2.5">
                    read post →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── BACK ────────────────────────────────── */}
      <section className="py-14">
        <div className="container-x flex justify-center">
          <Link href="/blog" className="btn btn-primary">
            ← back to blog
          </Link>
        </div>
      </section>
    </>
  );
}
