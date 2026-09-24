import type { Metadata } from "next";
import Link from "next/link";
import BlogPosts from "@/components/blog-posts";
import ContactStrip from "@/components/contact-strip";
import ShinyText from "@/components/shiny-text";
import { getCategories, getPostsPage } from "@/lib/blog-page";
import { BLOG_POSTS } from "@/lib/content";
import { getPostBySlug, getPosts, postToCard, type Post } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const postsPage = await getPostsPage();
  const title = postsPage?.metaTitle ?? "Blog — Hamza Elmouddane";
  const description =
    postsPage?.metaDescription ??
    "Articles on NestJS, FastAPI, system design, and building scalable products — written by Hamza Elmouddane.";
  const ogImageUrl = postsPage?.ogImage?.asset.url;

  return {
    title,
    description,
    alternates: postsPage?.canonicalUrl ? { canonical: postsPage.canonicalUrl } : undefined,
    robots: postsPage?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: postsPage?.ogTitle ?? title,
      description: postsPage?.ogDescription ?? description,
      url: postsPage?.canonicalUrl ?? "/blog",
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: postsPage?.twitterCard ?? "summary_large_image",
      title: postsPage?.ogTitle ?? title,
      description: postsPage?.ogDescription ?? description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

function FeaturedPost({ post }: { post?: Post | null }) {
  const taxonomy = [
    ...(post?.category ? [post.category] : []),
    ...(post?.tags ?? []),
  ];
  const date = post?.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <article className="card mb-16 grid grid-cols-1 overflow-hidden transition-colors duration-150 hover:border-amber lg:grid-cols-[1fr_0.7fr]">
      <div className="flex flex-col p-8 pb-10 min-[560px]:p-10">
        <span className="mb-5 font-mono text-[11px] text-amber">★ Featured Post</span>
        <div className="mb-[18px] flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted">
          {taxonomy.map((t) => (
            <span
              key={t.slug ?? t.title}
              className="rounded-[4px] border border-edge px-2 py-0.5 text-terminal"
            >
              {t.title}
            </span>
          ))}
          {date ? <span>{date}</span> : null}
        </div>
        <h2 className="mb-[14px] font-display text-[clamp(22px,2.4vw,30px)] font-bold leading-[1.25] text-cream">
          <Link
            href={post?.slug ? `/blog/${post.slug}` : "#"}
            className="transition-colors hover:text-amber-gold"
          >
            {post?.title ?? "CQRS in NestJS: Beyond the Tutorial"}
          </Link>
        </h2>
        <p className="mb-7 flex-1 text-[15px] leading-[1.7] text-muted">
          {post?.excerpt ??
            "The tutorial stops at commands and queries. Production adds sagas, idempotency keys, event replay, and three kinds of regret. Here's everything the docs leave out — from inbox patterns to eventual consistency pitfalls I hit live."}
        </p>
        <Link
          href={post?.slug ? `/blog/${post.slug}` : "#"}
          className="inline-flex items-center gap-1.5 self-start font-mono text-[13px] text-amber transition-[gap] duration-150 hover:gap-2.5"
        >
          read post →
        </Link>
      </div>

      <div className="relative hidden min-h-[280px] items-center justify-center overflow-hidden border-t border-edge bg-surface lg:flex lg:border-l lg:border-t-0">
        {post?.coverImage?.asset?.url ? (
          <img
            src={post.coverImage.asset.url}
            alt={post.coverImage.alt ?? post?.title ?? "Featured post cover"}
            className="h-full w-full object-cover"
          />
        ) : (
        <div className="relative max-w-[280px] overflow-hidden rounded-md border border-edge bg-card p-5 font-mono text-xs leading-[1.8] text-muted">
          <span className="tok-c">{"// saga.ts — the part no one shows you"}</span>
          {"\n"}
          <span className="tok-k">@Saga</span>()
          {"\n"}
          <span className="tok-k">orderSaga</span> = (events$) =&gt;
          {"\n"}
          {"  "}events$.
          <span className="tok-k">pipe</span>({"\n"}
          {"    "}
          <span className="tok-k">ofType</span>(OrderCreatedEvent),
          {"\n"}
          {"    "}
          <span className="tok-k">mergeMap</span>((e) =&gt; [
          {"\n"}
          {"      "}
          <span className="tok-k">new</span> ReserveInventoryCmd(e),
          {"\n"}
          {"      "}
          <span className="tok-k">new</span> ChargePaymentCmd(e),
          {"\n"}
          {"    "}]),
          {"\n"}
          {"  "});
          {"\n\n"}
          <span className="tok-c">{"// idempotency key on every command"}</span>
          {"\n"}
          <span className="tok-k">const</span> cmd = {"{"}
          {"\n"}
          {"  "}id: <span className="tok-n">uuid()</span>,
          {"\n"}
          {"  "}ttl: <span className="tok-n">86_400</span>,
          {"\n"}
          {"};"}
        </div>
        )}
      </div>
    </article>
  );
}

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const [postsPage, categories, sanityPosts] = await Promise.all([
    getPostsPage(),
    getCategories(),
    getPosts(),
  ]);

  const pinnedSlugs = (postsPage?.pinnedPosts ?? [])
    .map((p) => p.slug)
    .filter((s): s is string => Boolean(s));
  const cardPosts =
    sanityPosts.length > 0
      ? [...sanityPosts]
          .sort(
            (a, b) =>
              Number(pinnedSlugs.includes(b.slug) || b.featured) -
              Number(pinnedSlugs.includes(a.slug) || a.featured),
          )
          .map((p) => postToCard(p, pinnedSlugs))
      : BLOG_POSTS;

  const featuredSlug =
    postsPage?.featuredPost?.slug ??
    sanityPosts.find((p) => p.featured)?.slug ??
    null;
  const featuredPost = featuredSlug ? await getPostBySlug(featuredSlug) : null;

  const categoryIds = new Set(
    categories.length > 0
      ? categories.map((c) => c.slug).filter((s): s is string => Boolean(s))
      : BLOG_POSTS.flatMap((p) => p.tags),
  );
  const activeCategory = category && categoryIds.has(category) ? category : "all";
  const filteredPosts =
    activeCategory === "all"
      ? cardPosts
      : cardPosts.filter((p) => p.tags.includes(activeCategory));

  const heading = postsPage?.heading ?? "Blog";
  const subheading =
    postsPage?.subheading ??
    "Thoughts on backend engineering, architecture, and building products. What I built, what broke, and what I'd never do again.";
  const showCategoryFilter = postsPage?.showCategoryFilter ?? true;
  const newsletterLabel = postsPage?.newsletterCtaLabel ?? "Get new articles in your inbox";
  const newsletterSubtext = postsPage?.newsletterCtaSubtext ?? "No spam. Unsubscribe any time.";

  let jsonLdScript: string | null = null;
  if (postsPage?.jsonLd) {
    try {
      JSON.parse(postsPage.jsonLd);
      jsonLdScript = postsPage.jsonLd;
    } catch {
      jsonLdScript = null;
    }
  }
  if (!jsonLdScript && (postsPage?.structuredDataName || postsPage?.structuredDataDescription)) {
    jsonLdScript = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      name: postsPage.structuredDataName ?? "Blog — Hamza Elmouddane",
      description:
        postsPage.structuredDataDescription ??
        "A blog about backend engineering, architecture, and building products.",
    });
  }

  return (
    <>
      {jsonLdScript ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript }}
        />
      ) : null}
      {/* ── BLOG HERO ─────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-edge py-[72px]">
        <div className="bg-grid-faint pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative">
          <p className="hero-reveal mb-[18px] font-mono text-[13px] text-terminal">
            <span className="text-amber">~/hamza $</span> tail -f writing.log
          </p>
          <h1 className="hero-reveal reveal-d1 mb-[18px] font-display text-[clamp(36px,4vw,56px)] font-bold leading-[1.08] tracking-tight">
            THE <ShinyText text={`${heading.toUpperCase()}.`} color="#FF6B00" speed={2} />
          </h1>
          <p className="hero-reveal reveal-d2 mb-8 max-w-[560px] text-[17px] leading-[1.7] text-muted">
            {subheading}
          </p>
          <div className="hero-reveal reveal-d3 flex flex-wrap items-center gap-5 font-mono text-xs text-muted">
            <span className="text-terminal">● 12 articles published</span>
            <span className="text-edge">|</span>
            <span>NestJS · Go · FastAPI · System Design</span>
            <span className="text-edge">|</span>
            <span>avg read: 11 min</span>
          </div>
        </div>
      </section>

      {/* ── FEATURED POST ─────────────────────────── */}
      <section className="border-b border-edge bg-base pt-[72px]">
        <div className="container-x">
          <p className="section-label hero-reveal">cat featured.post</p>
          <FeaturedPost post={featuredPost} />
        </div>
      </section>

      {/* ── FILTERS + POSTS GRID ──────────────────── */}
      <BlogPosts
        key={activeCategory}
        posts={filteredPosts}
        categories={
          categories.length > 0
            ? categories.map((c) => ({ id: c.slug, label: c.title }))
            : undefined
        }
        showFilter={showCategoryFilter}
        activeCategory={activeCategory}
      />

      {/* ── NEWSLETTER ────────────────────────────── */}
      <section className="border-y border-edge bg-base py-[72px]">
        <div className="container-x grid items-center gap-7 lg:grid-cols-[1fr_auto] lg:gap-12">
          <div>
            <p className="section-label">subscribe</p>
            <h2 className="mb-2 font-display text-[clamp(22px,2.6vw,32px)] font-bold text-cream">
              {newsletterLabel}
            </h2>
            <p className="text-sm text-muted">{newsletterSubtext}</p>
          </div>
          <form className="flex flex-wrap gap-2.5">
            <input
              type="email"
              placeholder="your@email.com"
              className="min-w-[240px] rounded-md border border-edge bg-card px-5 py-[13px] font-mono text-[13px] text-cream outline-none transition-colors placeholder:text-muted focus:border-amber"
            />
            <button type="button" className="btn btn-primary">
              Subscribe →
            </button>
          </form>
        </div>
      </section>

      {/* ── CONTACT STRIP ─────────────────────────── */}
      <ContactStrip
        label="init contact"
        title="Have a system that needs building?"
        description="APIs, AI pipelines, real-time infrastructure — if it's backend-shaped and it has to work, I want to hear about it."
      />
    </>
  );
}