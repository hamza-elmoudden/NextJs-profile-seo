import ContactStrip from "@/components/contact-strip";
import Hero from "@/components/hero";
import { PostCard, ServiceCard, SkillCard } from "@/components/cards";
import SectionHeader from "@/components/section-header";
import Link from "next/link";
import { POSTS, SERVICES, SKILLS } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Hero />

      {/* ── SERVICES ─────────────────────────────── */}
      <section id="services" className="section-pad border-y border-edge bg-base">
        <div className="container-x">
          <SectionHeader
            label="what-i-do --list"
            title="Services I Offer"
            sub="Not features. Not buzzwords. Capabilities I've shipped under real load, with real users, real failures, and real on-call nights."
          />
          <div className="grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 xl:grid-cols-4">
            {SERVICES.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
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
            {POSTS.map((post) => (
              <PostCard key={post.title} {...post} />
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
