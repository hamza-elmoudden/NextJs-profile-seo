import type { Metadata } from "next";
import Link from "next/link";
import ContactStrip from "@/components/contact-strip";
import ShinyText from "@/components/shiny-text";
import Projects from "@/components/projects";
import { PROJECTS, type Project } from "@/lib/content";
import { getFeaturedProjects, getProjects, projectToCard } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects — Hamza Elmouddane",
  description:
    "Browse the projects built by Hamza Elmouddane — scalable web applications, backend systems, and digital products using NestJS, FastAPI, React, and more.",
};

const TYPE_BADGE: Record<string, string> = {
  "Client Work": "text-amber border-[rgba(255,107,0,0.3)]",
  "Open Source": "text-screen border-[rgba(15,240,170,0.3)]",
  SaaS: "text-amber-gold border-[rgba(255,170,51,0.3)]",
};

function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="card hero-reveal reveal-d1 mb-16 grid grid-cols-1 overflow-hidden transition-colors duration-150 hover:border-amber lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative flex min-h-[220px] flex-shrink-0 items-center justify-center overflow-hidden bg-surface lg:min-h-[320px]">
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${project.imageUrl}?w=1200&auto=format`}
            alt={project.imageAlt ?? project.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-70"
              aria-hidden
              style={{
                backgroundImage:
                  "linear-gradient(var(--color-card) 1px, transparent 1px), linear-gradient(90deg, var(--color-card) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <span className="relative font-mono text-[28px] font-bold tracking-[0.06em] text-edge">
              {project.initials}
            </span>
          </>
        )}
        <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-edge bg-[rgba(13,16,18,0.85)] px-3 py-[5px] font-mono text-[10px] text-muted backdrop-blur-sm">
          <span className="h-[6px] w-[6px] rounded-full bg-amber-gold shadow-[0_0_6px_var(--color-amber-gold)]" />
          {project.statusLabel}
        </span>
        <span className="absolute right-4 top-4 z-10 rounded-[4px] border border-[rgba(255,107,0,0.4)] bg-[rgba(13,16,18,0.85)] px-2.5 py-1 font-mono text-[10px] text-amber backdrop-blur-sm">
          📌 pinned
        </span>
      </div>

      <div className="flex flex-col p-8 min-[560px]:p-10">
        <div className="mb-4 flex flex-wrap gap-2.5">
          {project.types.map((t) => (
            <span
              key={t}
              className={`rounded-[4px] border px-2 py-[2px] font-mono text-[11px] ${
                TYPE_BADGE[t] ?? "text-terminal border-edge"
              }`}
            >
              {t}
            </span>
          ))}
        </div>
        <h2 className="mb-3 font-display text-[clamp(22px,2.4vw,30px)] font-bold leading-[1.2] text-cream">
          <Link href={`/projects/${project.slug}`} className="transition-colors hover:text-amber-gold">
            {project.name}
          </Link>
        </h2>
        <p className="mb-6 flex-1 text-[15px] leading-[1.7] text-muted">{project.description}</p>
        <div className="mb-7 flex flex-wrap gap-2">
          {project.stack.map((tag) => (
            <span
              key={tag}
              className="rounded-[4px] border border-edge bg-surface px-2.5 py-[3px] font-mono text-[11px] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {project.liveUrl ? (
            <Link href={project.liveUrl} className="btn btn-primary px-4 py-2 text-xs">
              Live Demo →
            </Link>
          ) : null}
          {project.githubUrl ? (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost px-4 py-2 text-xs"
            >
              GitHub ↗
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default async function ProjectsPage() {
  let projects: Project[] = PROJECTS;
  let featuredProject: Project = PROJECTS.find((p) => p.featured) ?? PROJECTS[0];

  try {
    const [sanityProjects, sanityFeatured] = await Promise.all([
      getProjects(),
      getFeaturedProjects(),
    ]);
    if (sanityProjects.length > 0) {
      const pinnedSlugs = sanityFeatured.map((p) => p.slug);
      projects = sanityProjects.map((p) => projectToCard(p, pinnedSlugs));
    }
    const firstFeatured = sanityFeatured[0];
    if (firstFeatured) {
      featuredProject = projectToCard(firstFeatured);
    }
  } catch {
    // Sanity unreachable — fall back to static mocks.
  }

  return (
    <>
      {/* ── PROJECTS HERO ─────────────────────────── */}
      <section className="relative overflow-hidden border-b border-edge py-[72px]">
        <div className="bg-grid-faint pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative">
          <p className="hero-reveal mb-[18px] font-mono text-[13px] text-terminal">
            <span className="text-amber">~/hamza $</span> ls -la projects/
          </p>
          <h1 className="hero-reveal reveal-d1 mb-[18px] font-display text-[clamp(36px,4vw,56px)] font-bold leading-[1.08] tracking-tight">
            THE{" "}
            <ShinyText text="PROJECTS." color="#FF6B00" shineColor="#ffffff" speed={2} />
          </h1>
          <p className="hero-reveal reveal-d2 mb-8 max-w-[560px] text-[17px] leading-[1.7] text-muted">
            A selection of the{" "}
            <strong className="font-semibold text-cream">products, tools, and systems</strong>{" "}
            I have built — from zero-dependency libraries to multi-tenant SaaS platforms.
          </p>
          <div className="hero-reveal reveal-d3 flex flex-wrap items-center gap-5 font-mono text-xs text-muted">
            <span className="text-terminal">● {projects.length} projects</span>
            <span className="text-edge">|</span>
            <span>NestJS · FastAPI · Go · TypeScript</span>
            <span className="text-edge">|</span>
            <span>SaaS · Open Source · Personal</span>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECT ──────────────────────── */}
      <section className="border-b border-edge bg-base pt-[72px]">
        <div className="container-x">
          <p className="section-label hero-reveal">cat pinned.project</p>
          <FeaturedProject project={featuredProject} />
        </div>
      </section>

      {/* ── FILTERS + PROJECTS GRID ───────────────── */}
      <Projects projects={projects} />

      {/* ── CONTACT STRIP ─────────────────────────── */}
      <ContactStrip
        label="init contact"
        title="Have a system that needs building?"
        description="APIs, AI pipelines, real-time infrastructure — if it's backend-shaped and it has to work, I want to hear about it."
      />
    </>
  );
}
