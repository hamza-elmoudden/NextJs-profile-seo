import type { Metadata } from "next";
import Link from "next/link";
import PortableBody from "@/components/portable-body";
import type { PostFull } from "@/lib/posts";

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

export function postMetadata(post: PostFull | null): Metadata {
  if (!post) return { title: "Post not found — Hamza Elmouddane" };

  const title = post.seo?.metaTitle ?? post.title;
  const description = post.seo?.metaDescription ?? post.excerpt ?? undefined;
  const ogImageUrl = post.seo?.ogImage?.asset?.url ?? post.coverImage?.asset?.url;

  return {
    title: `${title} — Hamza Elmouddane`,
    description,
    alternates: post.seo?.canonicalUrl ? { canonical: post.seo.canonicalUrl } : undefined,
    robots: post.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: post.seo?.ogTitle ?? title,
      description: post.seo?.ogDescription ?? description,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? undefined,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: post.seo?.twitterCard ?? "summary_large_image",
      title: post.seo?.ogTitle ?? title,
      description: post.seo?.ogDescription ?? description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

export default function BlogPostPage({ post }: { post: PostFull }) {
  const published = formatDate(post.publishedAt);
  const updated = formatDate(post.updatedAt);
  const readTime = estimateReadTime(post);
  const taxonomy = [...(post.category ? [post.category] : []), ...(post.tags ?? [])];
  const related = (post.relatedPosts ?? []).filter((p): p is typeof p & { slug: string } =>
    Boolean(p.slug),
  );
  const coverUrl = post.coverImage?.asset?.url;

  let jsonLdScript: string | null = null;
  if (post.jsonLd) {
    try {
      JSON.parse(post.jsonLd);
      jsonLdScript = post.jsonLd;
    } catch {
      jsonLdScript = null;
    }
  }
  if (!jsonLdScript) {
    jsonLdScript = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt ?? undefined,
      datePublished: post.publishedAt ?? undefined,
      dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
      image: coverUrl,
      author: post.author
        ? {
            "@type": "Person",
            name: post.author.name,
          }
        : undefined,
    });
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript }} />

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
            {post.author ? (
              <div className="hero-reveal reveal-d3 mt-8 flex items-center gap-3">
                {post.author.image?.asset?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.author.image.asset.url}
                    alt={post.author.image.alt ?? post.author.name}
                    className="h-10 w-10 rounded-full border border-edge object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-edge bg-card font-mono text-xs text-terminal">
                    {post.author.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <div>
                  <p className="font-mono text-[13px] text-cream">{post.author.name}</p>
                  {post.author.role ? (
                    <p className="font-mono text-[11px] text-terminal">{post.author.role}</p>
                  ) : null}
                </div>
              </div>
            ) : null}
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
            <PortableBody body={post.body} />
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
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-amber"
              >
                x
              </a>
              {" / "}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  `https://hamza.dev/blog/${post.category?.slug ?? "post"}/${post.slug}`,
                )}`}
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

      {/* ── UP NEXT ─────────────────────────────── */}
      {related.length > 0 ? (
        <section className="border-b border-edge py-[48px]">
          <div className="container-x">
            <Link
              href={`/blog/${related[0].category?.slug ?? "post"}/${related[0].slug}`}
              className="card group flex items-center justify-between gap-6 px-6 py-5 transition-colors duration-150 hover:border-amber"
            >
              <div>
                <p className="mb-1.5 font-mono text-[11px] tracking-wide text-terminal">UP NEXT</p>
                <p className="font-display text-[clamp(17px,2vw,22px)] font-semibold text-cream transition-colors group-hover:text-amber-gold">
                  {related[0].title}
                </p>
              </div>
              <span className="font-display text-[28px] text-amber transition-transform duration-150 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
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
