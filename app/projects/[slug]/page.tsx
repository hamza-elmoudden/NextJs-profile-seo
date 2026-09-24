import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactStrip from "@/components/contact-strip";
import PortableBody from "@/components/portable-body";
import { getAllProjectSlugs, getProjectBySlug, getProjects } from "@/lib/projects";

// ISR: statically generate all projects at build time, then revalidate each
// page in the background at most every 60 seconds. dynamicParams (default
// true, exported for clarity) lets slugs added after the build render on
// first request and then be statically cached.
export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
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

const TYPE_LABELS: Record<string, string> = {
  personal: "Personal",
  client: "Client Work",
  opensource: "Open Source",
  saas: "SaaS",
  side: "Side Project",
};

const STATUS_LABELS: Record<string, string> = {
  idea: "concept",
  inProgress: "in progress",
  completed: "live",
  archived: "archived",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found — Hamza Elmouddane" };

  const title = project.seo?.metaTitle ?? project.title;
  const description = project.seo?.metaDescription ?? project.shortDescription;
  const ogImageUrl =
    project.seo?.ogImage?.asset?.url ?? project.featuredImage?.asset?.url;

  return {
    title: `${title} — Hamza Elmouddane`,
    description,
    alternates: project.seo?.canonicalUrl
      ? { canonical: project.seo.canonicalUrl }
      : undefined,
    robots: project.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: project.seo?.ogTitle ?? title,
      description: project.seo?.ogDescription ?? description,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: project.seo?.twitterCard ?? "summary_large_image",
      title: project.seo?.ogTitle ?? title,
      description: project.seo?.ogDescription ?? description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getProjects();
  const others = allProjects.filter((p) => p._id !== project._id).slice(0, 3);

  const start = formatDate(project.startDate);
  const end = formatDate(project.endDate);
  const statusLabel = STATUS_LABELS[project.status ?? "inProgress"] ?? "in progress";
  const typeLabel = TYPE_LABELS[project.projectType ?? "personal"] ?? "Personal";
  const coverUrl = project.featuredImage?.asset?.url;
  const gallery = (project.gallery ?? []).filter((g) => g?.asset?.url);

  let jsonLdScript: string | null = null;
  if (project.jsonLd) {
    try {
      JSON.parse(project.jsonLd);
      jsonLdScript = project.jsonLd;
    } catch {
      jsonLdScript = null;
    }
  }
  if (!jsonLdScript) {
    jsonLdScript = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: project.title,
      description: project.shortDescription,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      author: {
        "@type": "Person",
        name: "Hamza Elmouddane",
      },
      url: project.liveUrl ?? undefined,
      image: coverUrl,
    });
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript }} />

      {/* ── PROJECT HERO ──────────────────────────── */}
      <section className="relative overflow-hidden border-b border-edge py-[72px]">
        <div className="bg-grid-faint pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative">
          <Link
            href="/projects"
            className="hero-reveal mb-8 inline-flex items-center gap-1.5 font-mono text-[13px] text-muted transition-colors hover:text-amber"
          >
            ← cd ~/projects
          </Link>
          <div className="hero-reveal mb-[18px] flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted">
            <span className="rounded-[4px] border border-edge px-2 py-0.5 text-terminal">
              {typeLabel}
            </span>
            <span>project/{project.slug}</span>
            {project.featured ? <span className="text-amber">★ featured</span> : null}
          </div>
          <h1 className="hero-reveal reveal-d1 mb-[18px] max-w-[860px] font-display text-[clamp(30px,4vw,52px)] font-bold leading-[1.15] tracking-tight">
            {project.title}
          </h1>
          <p className="hero-reveal reveal-d2 max-w-[640px] text-[17px] leading-[1.7] text-muted">
            {project.shortDescription}
          </p>
          <div className="hero-reveal reveal-d3 mt-8 flex flex-wrap items-center gap-5 font-mono text-xs text-muted">
            <span className="text-terminal">● {statusLabel}</span>
            <span className="text-edge">|</span>
            <span>
              {start ? `started ${start}` : "start date —"}
              {end ? ` → ${end}` : ""}
            </span>
          </div>
        </div>
      </section>

      {/* ── COVER ─────────────────────────────────── */}
      {coverUrl ? (
        <section className="border-b border-edge bg-base py-12">
          <div className="container-x">
            <figure className="overflow-hidden rounded-md border border-edge">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt={project.featuredImage?.alt ?? project.title}
                className="w-full"
              />
              {project.featuredImage?.caption ? (
                <figcaption className="border-t border-edge bg-card px-4 py-2.5 text-center font-mono text-[11px] text-muted">
                  {project.featuredImage.caption}
                </figcaption>
              ) : null}
            </figure>
          </div>
        </section>
      ) : null}

      {/* ── DESCRIPTION + SIDE META ───────────────── */}
      <section className="border-b border-edge py-[64px]">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[1fr_260px]">
          <article className="max-w-[720px]">
            <p className="section-label mb-8">cat {project.slug}.md</p>
            <PortableBody body={project.description} />
          </article>

          {/* ── SIDE META ─────────────────────────── */}
          <aside className="lg:sticky lg:top-[92px] lg:self-start">
            <div className="card p-5">
              <p className="section-label mb-4">meta</p>
              <dl className="space-y-3 font-mono text-[12px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">status</dt>
                  <dd className="text-terminal">● {statusLabel}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">type</dt>
                  <dd className="text-amber">{typeLabel}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">started</dt>
                  <dd className="text-cream">{start ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">completed</dt>
                  <dd className="text-cream">{end ?? "—"}</dd>
                </div>
              </dl>
              {(project.technologies ?? []).length > 0 ? (
                <div className="mt-5 border-t border-edge pt-4">
                  <p className="mb-3 font-mono text-[11px] text-muted">stack</p>
                  <div className="flex flex-wrap gap-2">
                    {(project.technologies ?? []).map((t) => (
                      <span
                        key={t.slug ?? t.name}
                        className="rounded-[4px] border border-edge px-2 py-0.5 font-mono text-[11px] text-terminal"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {project.githubUrl || project.liveUrl ? (
                <div className="mt-5 border-t border-edge pt-4">
                  <p className="mb-3 font-mono text-[11px] text-muted">links</p>
                  <div className="flex flex-col gap-2.5">
                    {project.liveUrl ? (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs text-amber transition-colors hover:text-amber-gold"
                      >
                        live demo →
                      </Link>
                    ) : null}
                    {project.githubUrl ? (
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs text-muted transition-colors hover:text-cream"
                      >
                        GitHub ↗
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      {/* ── GALLERY ───────────────────────────────── */}
      {gallery.length > 0 ? (
        <section className="border-b border-edge bg-base py-[64px]">
          <div className="container-x">
            <p className="section-label hero-reveal">ls ./gallery</p>
            <div className="mt-8 grid grid-cols-1 gap-5 min-[560px]:grid-cols-2">
              {gallery.map((img, i) => (
                <figure
                  key={img.asset.url + i}
                  className="overflow-hidden rounded-md border border-edge"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.asset.url} alt={img.alt ?? project.title} className="w-full" />
                  {img.caption ? (
                    <figcaption className="border-t border-edge bg-card px-4 py-2.5 text-center font-mono text-[11px] text-muted">
                      {img.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── OTHER PROJECTS ────────────────────────── */}
      {others.length > 0 ? (
        <section className="border-b border-edge bg-base py-[72px]">
          <div className="container-x">
            <p className="section-label hero-reveal">cat other.projects</p>
            <div className="mt-8 grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 xl:grid-cols-3">
              {others.map((p) => (
                <Link
                  key={p._id}
                  href={`/projects/${p.slug}`}
                  className="card group flex flex-col p-[22px] transition-colors duration-150 hover:border-amber"
                >
                  <h3 className="mb-2.5 font-display text-[16px] font-semibold leading-snug text-cream transition-colors group-hover:text-amber-gold">
                    {p.title}
                  </h3>
                  <p className="flex-1 text-sm leading-[1.6] text-muted">
                    {p.shortDescription.slice(0, 120)}
                    {p.shortDescription.length > 120 ? "…" : ""}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-amber transition-[gap] duration-150 group-hover:gap-2.5">
                    view project →
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
          <Link href="/projects" className="btn btn-primary">
            ← all projects
          </Link>
        </div>
      </section>

      <ContactStrip
        label="init collaboration"
        title={`Want to build something like ${project.title}?`}
        description="APIs, AI pipelines, real-time infrastructure — if it's backend-shaped and it has to work, I want to hear about it."
      />
    </>
  );
}
