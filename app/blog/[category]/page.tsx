import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogPosts from "@/components/blog-posts";
import ContactStrip from "@/components/contact-strip";
import ShinyText from "@/components/shiny-text";
import {
  getCategories,
  getCategoryBySlug,
  getCategorySlugs,
  getPostsPage,
} from "@/lib/blog-page";
import { getPosts, postsToCards } from "@/lib/posts";
import {
  WEBSITE_ID,
  absoluteUrl,
  breadcrumbSchema,
  buildMetadata,
  graph,
  jsonLdString,
  personRef,
} from "@/lib/seo";

// ISR: prebuild every category at build time, revalidate at most every 60s,
// and render categories created after the build on first request.
export const revalidate = 60;
export const dynamicParams = true;

type CategoryParams = { category: string };

export async function generateStaticParams() {
  const slugs = await getCategorySlugs();
  return slugs.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CategoryParams>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return buildMetadata({
    title: `${category.title} Articles`,
    description:
      category.description ??
      `Articles on ${category.title} by Hamza Elmouddane: practical backend engineering, architecture, and lessons from production.`,
    path: `/blog/${category.slug}`,
    image: category.image?.asset?.url,
    keywords: [category.title, `${category.title} Tutorials`, `${category.title} Articles`],
    // An empty category is a thin page; keep it out of the index until it has posts.
    noIndex: category.postCount === 0,
  });
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<CategoryParams>;
}) {
  const { category: slug } = await params;

  const [category, postsPage, categories, sanityPosts] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsPage(),
    getCategories(),
    getPosts(),
  ]);
  if (!category) notFound();

  const pinnedSlugs = (postsPage?.pinnedPosts ?? [])
    .map((p) => p.slug)
    .filter((s): s is string => Boolean(s));
  const posts = postsToCards(
    sanityPosts.filter((p) => p.category?.slug === category.slug),
    pinnedSlugs,
  );

  const pageUrl = absoluteUrl(`/blog/${category.slug}`);
  const jsonLd = graph(
      {
        "@type": "CollectionPage",
        "@id": pageUrl,
        url: pageUrl,
        name: `${category.title} Articles`,
        description: category.description ?? undefined,
        isPartOf: { "@id": WEBSITE_ID },
        author: personRef,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: posts.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${pageUrl}/${p.slug}`,
            name: p.title,
          })),
        },
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: category.title, path: `/blog/${category.slug}` },
      ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      {/* ── CATEGORY HERO ─────────────────────────── */}
      <section className="relative overflow-hidden border-b border-edge py-[72px]">
        <div className="bg-grid-faint pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative">
          <nav
            aria-label="Breadcrumb"
            className="hero-reveal mb-[18px] font-mono text-[13px] text-muted"
          >
            <Link href="/blog" className="text-amber transition-colors hover:text-cream">
              ~/blog
            </Link>
            <span className="text-terminal"> / {category.slug}</span>
          </nav>
          <h1 className="hero-reveal reveal-d1 mb-[18px] font-display text-[clamp(36px,4vw,56px)] font-bold leading-[1.08] tracking-tight">
            <ShinyText text={`${category.title.toUpperCase()}.`} color="#FF6B00" speed={2} />
          </h1>
          <p className="hero-reveal reveal-d2 mb-8 max-w-[560px] text-[17px] leading-[1.7] text-muted">
            {category.description ??
              `Everything I've written about ${category.title}: what I built, what broke, and what I'd do differently.`}
          </p>
          <div className="hero-reveal reveal-d3 flex flex-wrap items-center gap-5 font-mono text-xs text-muted">
            <span className="text-terminal">
              ● {posts.length} {posts.length === 1 ? "article" : "articles"}
            </span>
          </div>
        </div>
      </section>

      {/* ── FILTERS + POSTS GRID ──────────────────── */}
      <BlogPosts
        posts={posts}
        categories={categories.map((c) => ({ id: c.slug, label: c.title }))}
        showFilter={postsPage?.showCategoryFilter ?? true}
        activeCategory={category.slug}
      />

      <ContactStrip
        label="init contact"
        title="Have a system that needs building?"
        description="APIs, AI pipelines, real-time infrastructure — if it's backend-shaped and it has to work, I want to hear about it."
      />
    </>
  );
}
