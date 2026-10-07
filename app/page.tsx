import ContactStrip from "@/components/contact-strip";
import Hero from "@/components/hero";
import Reveal from "@/components/reveal";
import { ServiceCard, SkillCard } from "@/components/cards";
import SectionHeader from "@/components/section-header";
import ServicesSlider from "@/components/services-slider";
import Link from "next/link";
import { POSTS, PROJECTS, SERVICES, SKILLS } from "@/lib/content";
import { getHomePage } from "@/lib/home-page";
import { getFeaturedPosts } from "@/lib/posts";
import { getFeaturedProjects, projectToCard } from "@/lib/projects";
import { getServices } from "@/lib/services";

export default async function Home() {
  let sanityServices: Awaited<ReturnType<typeof getServices>> = [];
  let featuredPosts: Awaited<ReturnType<typeof getFeaturedPosts>> = [];
  try {
    sanityServices = await getServices();
  } catch {
    sanityServices = [];
  }
  try {
    featuredPosts = await getFeaturedPosts();
  } catch {
    featuredPosts = [];
  }
  let featuredProjects: Awaited<ReturnType<typeof getFeaturedProjects>> = [];
  try {
    featuredProjects = await getFeaturedProjects();
  } catch {
    featuredProjects = [];
  }
  let homePage: Awaited<ReturnType<typeof getHomePage>> = null;
  try {
    homePage = await getHomePage();
  } catch {
    homePage = null;
  }
  const services = sanityServices.length > 0 ? sanityServices : null;

  let jsonLdScript: string | null = null;
  if (homePage?.jsonLd) {
    try {
      JSON.parse(homePage.jsonLd);
      jsonLdScript = homePage.jsonLd;
    } catch {
      jsonLdScript = null;
    }
  }
  if (!jsonLdScript) {
    jsonLdScript = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Hamza Elmouddane — Backend & AI Engineer",
      description:
        "Portfolio of Hamza Elmouddane, a Backend & AI Engineer based in Morocco. NestJS, FastAPI, Go, TypeScript.",
      author: {
        "@type": "Person",
        name: "Hamza Elmouddane",
        jobTitle: "Backend & AI Engineer",
        address: { "@type": "PostalAddress", addressCountry: "MA" },
      },
    });
  }
  const blogPosts =
    featuredPosts.length > 0
      ? featuredPosts.map((post) => ({
          slug: post.slug,
          tag: post.category?.slug ?? post.tags?.[0]?.slug ?? "post",
          date: post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "draft",
          readTime: "",
          title: post.title,
          excerpt: post.excerpt ?? "",
          cover: post.coverImage?.asset?.url ?? undefined,
        }))
      : POSTS;
  const featuredPost = blogPosts[0] ?? null;

  const projects =
    featuredProjects.length > 0
      ? featuredProjects.map((p) => projectToCard(p))
      : PROJECTS;
  const featuredProject = projects.find((p) => p.featured) ?? projects[0] ?? null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript }} />
      <Hero />

      {/* ── SERVICES ─────────────────────────────── */}
      <section id="services" className="section-pad border-y border-edge bg-base">
        <div className="container-x">
          <SectionHeader
            label="what-i-do --list"
            title="Services I Offer"
            sub="Not features. Not buzzwords. Capabilities I've shipped under real load, with real users, real failures, and real on-call nights."
          />
          {services ? (
            <Reveal>
              <ServicesSlider services={services} />
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 xl:grid-cols-4">
              {SERVICES.map((service, i) => (
                <Reveal key={service.title} delay={Math.min(i * 0.06, 0.36)} className="h-full">
                  <ServiceCard {...service} />
                </Reveal>
              ))}
            </div>
          )}
          <div className="mt-10">
            <Link href="/services" className="btn btn-ghost">
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────────── */}
      <section id="skills" className="section-pad">
        <div className="container-x">
          <SectionHeader
            label="cat stack.txt"
            title="Technologies I Work With"
            sub="Tools I've run in production, debugged at 3 AM, and formed actual opinions about."
          />
          <div className="grid grid-cols-2 gap-4 min-[560px]:grid-cols-3 min-[860px]:grid-cols-4 xl:grid-cols-6">
            {SKILLS.map((skill, i) => (
              <Reveal key={skill.name} delay={Math.min(i * 0.06, 0.36)}>
                <SkillCard {...skill} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG PREVIEW ─────────────────────────── */}
      <section id="blog" className="section-pad border-y border-edge bg-base">
        <div className="container-x">
          <div className="flex items-start justify-between gap-6">
            <div>
              <SectionHeader
                label="tail -1 featured.log"
                title="Latest from the Blog"
                sub="Notes from the internals — what I built, what broke, and what I'd never do again."
              />
            </div>
            <Link href="/blog" className="btn btn-ghost mt-2 shrink-0">
              View All Posts →
            </Link>
          </div>
          {featuredPost ? (
            <Reveal>
              <article className="card overflow-hidden">
                {/* terminal title bar */}
                <div className="relative flex items-center border-b border-edge px-5 py-3.5">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                    <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                    <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                  </div>
                  <span className="absolute left-1/2 hidden -translate-x-1/2 font-mono text-xs text-muted md:block">
                    ~/blog/{featuredPost.slug}.md
                  </span>
                  <span className="ml-auto font-mono text-xs text-muted">zsh — 80×24</span>
                </div>
                <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
                  {/* cover */}
                  <div>
                    <Link
                      href={`/blog/${featuredPost.tag}/${featuredPost.slug}`}
                      className="group relative block overflow-hidden rounded-lg border border-edge bg-surface"
                    >
                      {featuredPost.cover ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={featuredPost.cover}
                          alt={featuredPost.title}
                          className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="aspect-[16/10] w-full" />
                      )}
                      <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-terminal/50 bg-base/80 px-3 py-1 font-mono text-[10px] tracking-widest text-terminal backdrop-blur">
                        <span className="h-1.5 w-1.5 rounded-full bg-terminal" />
                        FEATURED
                      </span>
                    </Link>
                    <div className="mt-4 flex flex-wrap items-center gap-6 font-mono text-xs text-muted">
                      {featuredPost.readTime ? (
                        <span className="inline-flex items-center gap-1.5">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-terminal" aria-hidden>
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 3" />
                          </svg>
                          {featuredPost.readTime}
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-terminal" aria-hidden>
                          <path d="M12 2a1 1 0 0 1 1 1v2.1a8 8 0 0 1 5.9 5.9H21a1 1 0 1 1 0 2h-2.1A8 8 0 0 1 13 18.9V21a1 1 0 1 1-2 0v-2.1A8 8 0 0 1 5.1 13H3a1 1 0 1 1 0-2h2.1A8 8 0 0 1 11 5.1V3a1 1 0 0 1 1-1Zm0 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
                        </svg>
                        pinned by author
                      </span>
                    </div>
                  </div>
                  {/* content */}
                  <div className="flex flex-col">
                    <div className="mb-5 flex flex-wrap items-center gap-4 font-mono text-xs">
                      <span className="rounded-full border border-terminal/50 px-3.5 py-1 text-terminal">
                        {featuredPost.tag}
                      </span>
                      <span className="text-muted">{featuredPost.date}</span>
                    </div>
                    <h3 className="mb-4 font-display text-2xl font-bold leading-tight text-cream md:text-3xl">
                      <Link
                        href={`/blog/${featuredPost.tag}/${featuredPost.slug}`}
                        className="transition-colors hover:text-amber-gold"
                      >
                        {featuredPost.title}
                      </Link>
                    </h3>
                    <p className="mb-8 text-sm leading-relaxed text-muted md:text-[15px]">
                      {featuredPost.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-edge pt-5">
                      <Link
                        href={`/blog/${featuredPost.tag}/${featuredPost.slug}`}
                        className="group inline-flex items-center gap-1.5 font-mono text-sm text-amber"
                      >
                        read post
                        <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
                      </Link>
                      <span className="font-mono text-xs text-muted">{featuredPost.date}</span>
                    </div>
                  </div>
                </div>
              </article>
              <p className="mt-6 font-mono text-xs text-muted">
                # pinned: {blogPosts.length} · rss: /feed.xml
              </p>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* ── PROJECTS PREVIEW ─────────────────────── */}
      <section id="projects" className="section-pad">
        <div className="container-x">
          <div className="flex items-start justify-between gap-6">
            <div>
              <SectionHeader
                label="cat pinned.project"
                title="Featured Project"
                sub="Something I built, shipped, and kept alive — code, trade-offs, and all."
              />
            </div>
            <Link href="/projects" className="btn btn-ghost mt-2 shrink-0">
              View All Projects →
            </Link>
          </div>
          {featuredProject ? (
            <Reveal>
              <article className="card overflow-hidden">
                {/* terminal title bar */}
                <div className="relative flex items-center border-b border-edge px-5 py-3.5">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                    <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                    <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                  </div>
                  <span className="absolute left-1/2 hidden -translate-x-1/2 font-mono text-xs text-muted md:block">
                    ~/projects/{featuredProject.slug}/
                  </span>
                  <span className="ml-auto font-mono text-xs text-muted">zsh — 80×24</span>
                </div>
                <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
                  {/* cover */}
                  <div>
                    <Link
                      href={`/projects/${featuredProject.slug}`}
                      className="group relative block overflow-hidden rounded-lg border border-edge bg-surface"
                    >
                      {featuredProject.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={featuredProject.imageUrl}
                          alt={featuredProject.imageAlt ?? featuredProject.name}
                          className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex aspect-[16/10] w-full items-center justify-center">
                          <span className="font-mono text-2xl font-bold tracking-[0.06em] text-edge">
                            {featuredProject.initials}
                          </span>
                        </div>
                      )}
                      <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-terminal/50 bg-base/80 px-3 py-1 font-mono text-[10px] tracking-widest text-terminal backdrop-blur">
                        <span className="h-1.5 w-1.5 rounded-full bg-terminal" />
                        {featuredProject.statusLabel.toUpperCase()}
                      </span>
                    </Link>
                    <div className="mt-4 flex flex-wrap items-center gap-6 font-mono text-xs text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-terminal" aria-hidden>
                          <path d="M12 2a1 1 0 0 1 1 1v2.1a8 8 0 0 1 5.9 5.9H21a1 1 0 1 1 0 2h-2.1A8 8 0 0 1 13 18.9V21a1 1 0 1 1-2 0v-2.1A8 8 0 0 1 5.1 13H3a1 1 0 1 1 0-2h2.1A8 8 0 0 1 11 5.1V3a1 1 0 0 1 1-1Zm0 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
                        </svg>
                        pinned by author
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-terminal">▸</span>
                        {featuredProject.stack.length} tech
                      </span>
                    </div>
                  </div>
                  {/* content */}
                  <div className="flex flex-col">
                    <div className="mb-5 flex flex-wrap items-center gap-4 font-mono text-xs">
                      {featuredProject.types.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-terminal/50 px-3.5 py-1 text-terminal"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="mb-4 font-display text-2xl font-bold leading-tight text-cream md:text-3xl">
                      <Link
                        href={`/projects/${featuredProject.slug}`}
                        className="transition-colors hover:text-amber-gold"
                      >
                        {featuredProject.name}
                      </Link>
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-muted md:text-[15px]">
                      {featuredProject.description}
                    </p>
                    <div className="mb-8 flex flex-wrap gap-2">
                      {featuredProject.stack.map((tag,ind) => (
                        <span
                          key={ind}
                          className="rounded-[4px] border border-edge bg-surface px-2.5 py-[3px] font-mono text-[11px] text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-edge pt-5">
                      <Link
                        href={`/projects/${featuredProject.slug}`}
                        className="group inline-flex items-center gap-1.5 font-mono text-sm text-amber"
                      >
                        view project
                        <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
                      </Link>
                      <span className="font-mono text-xs text-muted">{featuredProject.statusLabel}</span>
                    </div>
                  </div>
                </div>
              </article>
              <p className="mt-6 font-mono text-xs text-muted">
                # featured: {projects.length} · src: github.com/elmouddane
              </p>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* ── CONTACT STRIP ────────────────────────── */}
      <ContactStrip
        label="init contact"
        title="Have a system that needs building?"
        description="APIs, AI pipelines, real-time infrastructure — if it's backend-shaped and it has to work, I want to hear about it."
      />
    </>
  );
}
