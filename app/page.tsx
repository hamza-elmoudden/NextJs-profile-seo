import ContactStrip from "@/components/contact-strip";
import Hero from "@/components/hero";
import { PostCard, ServiceCard, SkillCard } from "@/components/cards";
import SectionHeader from "@/components/section-header";
import ServicesSlider from "@/components/services-slider";
import Link from "next/link";
import { POSTS, SERVICES, SKILLS } from "@/lib/content";
import { getHomePage } from "@/lib/home-page";
import { getFeaturedPosts } from "@/lib/posts";
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
        }))
      : POSTS;

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
            <ServicesSlider services={services} />
          ) : (
            <div className="grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 xl:grid-cols-4">
              {SERVICES.map((service) => (
                <ServiceCard key={service.title} {...service} />
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
            {SKILLS.map((skill) => (
              <SkillCard key={skill.name} {...skill} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG PREVIEW ─────────────────────────── */}
      <section id="blog" className="section-pad border-y border-edge bg-base">
        <div className="container-x">
          <SectionHeader
            label="tail -3 writing.log"
            title="Latest from the Blog"
            sub="Notes from the internals — what I built, what broke, and what I'd never do again."
          />
          <div className="mb-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <PostCard key={post.slug} {...post} />
            ))}
          </div>
          <div>
            <Link href="/blog" className="btn btn-ghost">
              View All Posts →
            </Link>
          </div>
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
