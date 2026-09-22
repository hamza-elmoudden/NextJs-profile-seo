import type { Metadata } from "next";
import ContactStrip from "@/components/contact-strip";
import PortableBody from "@/components/portable-body";
import Terminal from "@/components/terminal";
import { getAboutPage } from "@/lib/about-page";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();
  const seo = about?.seo;
  return {
    title: seo?.metaTitle ?? "About — Hamza Elmouddane",
    description:
      seo?.metaDescription ??
      "Backend & AI Engineer based in Morocco. Self-taught, production-obsessed, building systems that last.",
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo?.ogTitle ?? seo?.metaTitle ?? "About — Hamza Elmouddane",
      description: seo?.ogDescription ?? seo?.metaDescription ?? undefined,
      url: seo?.canonicalUrl ?? undefined,
      images: seo?.ogImage?.asset?.url ? [{ url: seo.ogImage.asset.url }] : undefined,
    },
  };
}

const TIMELINE = [
  {
    year: "2026 — now",
    title: "Independent Builder & Freelancer",
    description:
      "Building SecureZone (zero-knowledge file platform), Safa IA (AI skincare), PilotIQ (route broker lib), and FastNest (Python DI framework). Actively looking for backend & AI remote roles.",
    tag: "● current",
    active: true,
  },
  {
    year: "2024 – 2025",
    title: "Deep NestJS + CQRS Architecture Phase",
    description:
      "Designed and shipped Zomra (real-time social events platform) and multiple NestJS CQRS backends. Developed expertise in event-driven architecture, sagas, and real-time infrastructure with WebSockets.",
    tag: "backend",
  },
  {
    year: "2023 – 2024",
    title: "AI Integration & Python Backend",
    description:
      "Built LLM pipelines, RAG systems, and AI-powered features with FastAPI. Started the FastNest project — a NestJS-inspired Python framework leveraging FastAPI's async foundation.",
    tag: "ai · python",
  },
  {
    year: "2021 – 2023",
    title: "Full-Stack → Backend Specialisation",
    description:
      "Started with React and Express, progressively moved to NestJS, TypeScript, and PostgreSQL. Began open-source library development and realised the backend — the invisible layer — was home.",
    tag: "typescript · node",
  },
  {
    year: "2019 – 2021",
    title: "OFPPT — Technicien Spécialisé, Réseaux Informatique",
    description:
      "Bac+2 certification in computer networks. Learned the infrastructure layer first — which turned out to be the perfect foundation for building the software that runs on top of it.",
    tag: "networking · bac+2",
  },
];

const VALUES = [
  {
    title: "Production First",
    description:
      "I design for what happens after deploy. Error budgets, retries, observability, and graceful degradation are requirements — not afterthoughts.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2 4 6v12l8 4 8-4V6l-8-4Z" />
        <path d="M12 22V12M4 6l8 6 8-6" />
      </svg>
    ),
  },
  {
    title: "Zero Unnecessary Dependencies",
    description:
      "Every package is a liability. I prefer to understand the primitive and write the thin layer myself. Libraries I build ship with zero runtime deps.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
      </svg>
    ),
  },
  {
    title: "Ship Fast, Iterate Faster",
    description:
      "I move quickly without cutting corners on correctness. Prototypes are labeled, MVPs are scoped, and every build ends with a list of what's next.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
      </svg>
    ),
  },
];

function WhoAmI() {
  return (
    <Terminal title="hamza@prod: ~/about">
      <span className="tok-c">{"// whoami --full"}</span>
      {"\n"}
      <span className="tok-k">const</span> hamza = {"{"}
      {"\n  role:      "}
      <span className="tok-s">&apos;Backend &amp; AI Engineer&apos;</span>,
      {"\n  location:  "}
      <span className="tok-s">&apos;Morocco &apos;</span>,
      {"\n  stack:     ["}
      <span className="tok-s">&apos;NestJS&apos;</span>,{" "}
      <span className="tok-s">&apos;FastAPI&apos;</span>,{" "}
      <span className="tok-s">&apos;Go&apos;</span>],
      {"\n  openTo:    "}
      <span className="tok-s">&apos;freelance &amp; remote&apos;</span>,
      {"\n"}{"};"}{"\n\n"}
      <span className="tok-c">{"// current learning"}</span>
      {"\n"}
      <span className="tok-k">const</span> now = {"{"}
      {"\n  studying:  "}
      <span className="tok-s">&apos;Go — Stage 3&apos;</span>,
      {"\n  building:  "}
      <span className="tok-s">&apos;SecureZone + Safa IA&apos;</span>,
      {"\n"}{"};"}{"\n\n"}
      <span className="tok-n">▸ all systems nominal</span>
      {"\n"}
      <span className="cursor-blink" />
    </Terminal>
  );
}

export default async function About() {
  const about = await getAboutPage();
  const biography = about?.biography?.length ? about.biography : null;
  const location = about?.location ?? "Morocco";

  return (
    <>
      {/* ── ABOUT HERO ─────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-edge py-[60px] min-[560px]:py-[72px] min-[860px]:py-[80px]">
        <div className="bg-grid-faint pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative grid items-start gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <p className="hero-reveal mb-[18px] font-mono text-[13px] text-terminal">
              <span className="text-amber">~/hamza $</span> cat about.md
            </p>
            <h1 className="hero-reveal reveal-d1 mb-[20px] font-display text-[clamp(36px,4vw,56px)] font-bold leading-[1.08] tracking-tight">
              {(about?.title ?? "ABOUT ME.").toUpperCase()}
            </h1>
            <p className="hero-reveal reveal-d2 mb-[32px] max-w-[580px] text-[17px] leading-[1.7] text-muted">
              {about?.introduction ?? (
                <>
                  <strong className="font-semibold text-cream">
                    Self-taught Backend &amp; AI Engineer
                  </strong>{" "}
                  building systems that run in the dark — invisible, reliable, fast. Based in
                  Morocco 🇲🇦, obsessed with the internals no one talks about.
                </>
              )}
            </p>
            <div className="hero-reveal reveal-d3 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-card px-3.5 py-[7px] font-mono text-xs text-muted">
                <span className="h-[7px] w-[7px] rounded-full bg-screen shadow-[0_0_8px_var(--color-screen)]" />
                available for freelance
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-card px-3.5 py-[7px] font-mono text-xs text-muted">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber"
                >
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {location} 🇲🇦
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-card px-3.5 py-[7px] font-mono text-xs text-muted">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
                Backend &amp; AI Engineer
              </span>
            </div>
          </div>

          <div className="hero-reveal reveal-d2 w-full max-w-[320px] flex-shrink-0 overflow-hidden rounded-md border border-edge bg-card lg:w-[260px]">
            <div className="flex h-[280px] w-full items-center justify-center bg-surface">
              {about?.profileImage?.asset?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={about.profileImage.asset.url}
                  alt={about.profileImage.alt ?? "Hamza Elmouddane"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 font-mono text-xs text-muted">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-edge"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  <span>profileImage</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 border-t border-edge px-4 py-3.5 font-mono text-[11px] text-muted">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber"
              >
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>
                <span className="text-[13px] font-semibold text-cream">Hamza Elmouddane</span>
                &nbsp;·&nbsp; {location} 🇲🇦
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BIOGRAPHY ──────────────────────────────── */}
      <section className="section-pad border-y border-edge bg-base">
        <div className="container-x grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <p className="section-label hero-reveal">cat biography.md</p>
            <h2 className="section-heading hero-reveal reveal-d1">The Long Version</h2>
            {biography ? (
              <div className="hero-reveal reveal-d2 [&_p]:text-[15px] [&_p]:leading-[1.8]">
                <PortableBody body={biography} />
              </div>
            ) : (
            <div className="hero-reveal reveal-d2 space-y-5 text-[15px] leading-[1.8] text-muted">
              <p>
                I&apos;m <strong className="text-cream">Hamza Elmouddane</strong> — a
                self-taught backend and AI engineer from Morocco. I started with networks
                (OFPPT, Bac+2 — Technicien Spécialisé, Réseaux Informatique) and quickly
                realized what I actually wanted to build was the software underneath the
                infrastructure.
              </p>
              <p>
                Five years later I specialise in{" "}
                <strong className="text-cream">NestJS · FastAPI · Go · TypeScript</strong>{" "}
                — building APIs, event-driven architectures, real-time systems, and LLM
                pipelines that run in production without drama. I&apos;ve designed
                frameworks (<a href="#" className="text-amber hover:text-amber-gold">FastNest</a>),
                shipped zero-dependency libraries (<a href="#" className="text-amber hover:text-amber-gold">PilotIQ</a>),
                and architected platforms from greenfield to multi-tenant SaaS.
              </p>
              <p>
                I work best on the hard problems: the invisible layer between the user and
                the database, the queue that can&apos;t drop messages, the AI pipeline that
                has to stay coherent at scale. If it has to be fast, correct, and online at
                3 AM — that&apos;s my domain.
              </p>
              <p>
                When I&apos;m not writing code I&apos;m deep in the internals of whatever
                framework I&apos;m using next, writing about what broke and why, or learning
                Go one stage at a time with a self-built curriculum designed to go from zero
                to distributed systems engineer.
              </p>
            </div>
            )}
          </div>

          <aside className="flex flex-col gap-5">
            <div className="card overflow-hidden hero-reveal reveal-d1">
              <div className="flex items-center gap-2.5 border-b border-edge bg-surface px-[18px] py-3.5 font-mono text-xs text-muted">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                quick_facts.json
              </div>
              <div className="flex flex-col gap-3 p-[18px]">
                {[
                  { key: "location", value: "Morocco 🇲🇦", terminal: false },
                  { key: "role", value: "Backend & AI Engineer", terminal: false },
                  { key: "focus", value: "NestJS · FastAPI · Go", terminal: false },
                  { key: "exp", value: "5+ years", terminal: false },
                  {
                    key: "status",
                    value: "● open to work",
                    terminal: true,
                  },
                ].map((fact) => (
                  <div key={fact.key} className="flex items-start gap-3 text-sm">
                    <span className="min-w-[80px] pt-0.5 font-mono text-[11px] text-terminal">
                      {fact.key}
                    </span>
                    <span className={fact.terminal ? "text-screen" : "text-cream"}>
                      {fact.value}
                    </span>
                  </div>
                ))}
                <div className="flex items-start gap-3 text-sm">
                  <span className="min-w-[80px] pt-0.5 font-mono text-[11px] text-terminal">
                    github
                  </span>
                  <a
                    href="https://github.com/hamza-elmoudden"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber hover:text-amber-gold"
                  >
                    hamza-elmoudden
                  </a>
                </div>
              </div>
            </div>

            <div className="hero-reveal reveal-d2">
              <WhoAmI />
            </div>
          </aside>
        </div>
      </section>

      {/* ── JOURNEY TIMELINE ───────────────────────── */}
      <section className="section-pad" id="journey">
        <div className="container-x">
          <p className="section-label hero-reveal">git log --oneline</p>
          <h2 className="section-heading hero-reveal reveal-d1">The Journey</h2>
          <p className="section-sub hero-reveal reveal-d2">Every commit that got me here.</p>

          <div className="hero-reveal reveal-d3 relative">
            <div
              className="absolute bottom-2 left-0 top-2 w-px bg-gradient-to-b from-amber via-edge to-transparent"
              aria-hidden
            />
            <div className="flex flex-col gap-10 pl-8">
              {TIMELINE.map((item) => (
                <div key={item.year} className="relative">
                  <span
                    className={`absolute -left-[38px] top-[6px] h-3 w-3 rounded-full border-2 ${
                      item.active
                        ? "border-terminal bg-terminal shadow-[0_0_8px_var(--color-terminal)]"
                        : "border-edge bg-card"
                    }`}
                    aria-hidden
                  />
                  <div className="mb-1 font-mono text-[11px] text-amber">{item.year}</div>
                  <h3 className="mb-1 font-display text-[17px] font-semibold text-cream">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-[1.65] text-muted">{item.description}</p>
                  <span className="mt-2 inline-flex rounded-[4px] border border-edge px-2 py-0.5 font-mono text-[10px] text-terminal">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES / APPROACH ──────────────────────── */}
      <section className="section-pad border-t border-b border-edge bg-base">
        <div className="container-x">
          <p className="section-label hero-reveal">cat principles.txt</p>
          <h2 className="section-heading hero-reveal reveal-d1">How I Work</h2>
          <p className="section-sub hero-reveal reveal-d2">
            Not philosophies. Habits I&apos;ve formed the hard way.
          </p>

          <div className="hero-reveal reveal-d3 mt-2 grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title} className="card card-hover p-7">
                <div className="mb-[18px] grid h-11 w-11 place-items-center rounded-md border border-edge bg-surface text-amber">
                  {value.icon}
                </div>
                <h3 className="mb-2 font-display text-[17px] font-semibold text-cream">
                  {value.title}
                </h3>
                <p className="text-sm leading-[1.65] text-muted">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT STRIP ──────────────────────────── */}
      <ContactStrip
        label="init contact"
        title="Want to work together?"
        description="Backend architecture, AI pipelines, real-time systems — if it needs to run reliably at scale, I want to hear about it."
      />
    </>
  );
}