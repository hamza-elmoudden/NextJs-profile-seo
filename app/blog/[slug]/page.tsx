import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactStrip from "@/components/contact-strip";
import PortableBody from "@/components/portable-body";
import { getAllPostSlugs, getPostFullBySlug, type PostFull } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

function formatDate(iso: string | null) {
  return iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostFullBySlug(slug);
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

function estimateReadTime(post: PostFull): number {
  const text = JSON.stringify(post.body ?? []).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(text / 200));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostFullBySlug(slug);
  if (!post) notFound();

  const published = formatDate(post.publishedAt);
  const updated = formatDate(post.updatedAt);
  const readTime = estimateReadTime(post);
  const taxonomy = [...(post.category ? [post.category] : []), ...(post.tags ?? [])];
  const related = (post.relatedPosts ?? []).filter((p): p is typeof p & { slug: string } =>
    Boolean(p.slug),
  );
  const coverUrl = post.coverImage?.asset?.url;

  const jsonLd = {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── POST HERO ─────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-edge py-[72px]">
        <div className="bg-grid-faint pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative">
          <Link
            href="/blog"
            className="hero-reveal mb-8 inline-flex items-center gap-1.5 font-mono text-[13px] text-muted transition-colors hover:text-amber"
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
                  <p className="font-mono text-[11px] text-muted">{post.author.role}</p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── COVER ─────────────────────────────────── */}
      {coverUrl ? (
        <section className="border-b border-edge bg-base py-12">
          <div className="container-x">
            <figure className="overflow-hidden rounded-md border border-edge">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl} alt={post.coverImage?.alt ?? post.title} className="w-full" />
              {post.coverImage?.caption ? (
                <figcaption className="border-t border-edge bg-card px-4 py-2.5 text-center font-mono text-[11px] text-muted">
                  {post.coverImage.caption}
                </figcaption>
              ) : null}
            </figure>
          </div>
        </section>
      ) : null}

      {/* ── BODY ──────────────────────────────────── */}
      <section className="border-b border-edge py-[64px]">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[1fr_260px]">
          <article className="max-w-[720px]">
            <PortableBody body={post.body} />
            {updated ? (
              <p className="mt-10 border-t border-edge pt-5 font-mono text-[11px] text-muted">
                last updated: <span className="text-terminal">{updated}</span>
              </p>
            ) : null}
          </article>

          {/* ── SIDE META ─────────────────────────── */}
          <aside className="lg:sticky lg:top-[92px] lg:self-start">
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
          </aside>
        </div>
      </section>

      {/* ── RELATED POSTS ─────────────────────────── */}
      {related.length > 0 ? (
        <section className="border-b border-edge bg-base py-[72px]">
          <div className="container-x">
            <p className="section-label hero-reveal">cat related.posts</p>
            <div className="mt-8 grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 xl:grid-cols-4">
              {related.slice(0, 4).map((r) => (
                <Link
                  key={r._id}
                  href={`/blog/${r.slug}`}
                  className="card group flex flex-col p-[22px] transition-colors duration-150 hover:border-amber"
                >
                  <div className="mb-3 flex items-center gap-2.5 font-mono text-[11px] text-muted">
                    {r.category ? (
                      <span className="rounded-[4px] border border-edge px-2 py-0.5 text-terminal">
                        {r.category.title}
                      </span>
                    ) : null}
                    <span>{formatDate(r.publishedAt) ?? "draft"}</span>
                  </div>
                  <h3 className="mb-2.5 font-display text-[16px] font-semibold leading-snug text-cream transition-colors group-hover:text-amber-gold">
                    {r.title}
                  </h3>
                  {r.excerpt ? (
                    <p className="flex-1 text-sm leading-[1.6] text-muted">
                      {r.excerpt.slice(0, 140)}
                      {r.excerpt.length > 140 ? "…" : ""}
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

      {/* ── BACK + CONTACT ────────────────────────── */}
      <section className="border-b border-edge py-14">
        <div className="container-x flex justify-center">
          <Link href="/blog" className="btn btn-primary">
            ← back to blog
          </Link>
        </div>
      </section>

      <ContactStrip
        label="init discussion"
        title="Want to dig deeper into this?"
        description="If this post sparked an idea, a question, or a project — let's talk. APIs, architecture, AI pipelines, and the occasional spicy take."
      />
    </>
  );
}
