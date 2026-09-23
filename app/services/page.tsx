import type { Metadata } from "next";
import Link from "next/link";
import ContactStrip from "@/components/contact-strip";
import ShinyText from "@/components/shiny-text";
import { getServices } from "@/lib/services";

// ISR: revalidate this page every 25 minutes
export const revalidate = 1500;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Services — Hamza Elmouddane",
    description:
      "Backend development, AI engineering, and infrastructure services — APIs, pipelines, and systems that have to work, by Hamza Elmouddane.",
  };
}

export default async function Services() {
  const services = await getServices();

  return (
    <>
      {/* ── SERVICES HERO ─────────────────────────── */}
      <section className="relative overflow-hidden border-b border-edge py-[72px]">
        <div className="bg-grid-faint pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative">
          <p className="hero-reveal mb-[18px] font-mono text-[13px] text-terminal">
            <span className="text-amber">~/hamza $</span> ls ./services
          </p>
          <h1 className="hero-reveal reveal-d1 mb-[18px] font-display text-[clamp(36px,4vw,56px)] font-bold leading-[1.08] tracking-tight">
            THE <ShinyText text="SERVICES." color="#FF6B00" speed={2} />
          </h1>
          <p className="hero-reveal reveal-d2 mb-8 max-w-[560px] text-[17px] leading-[1.7] text-muted">
            What I build, end to end: backend systems, AI pipelines, and the infrastructure that
            keeps them honest in production.
          </p>
          <div className="hero-reveal reveal-d3 flex flex-wrap items-center gap-5 font-mono text-xs text-muted">
            <span className="text-terminal">● {services.length} services offered</span>
            <span className="text-edge">|</span>
            <span>NestJS · FastAPI · Go · AI/LLM</span>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ─────────────────────────── */}
      <section className="border-b border-edge bg-base py-[72px]">
        <div className="container-x">
          <p className="section-label hero-reveal">cat services.list</p>
          {services.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <Link
                  key={service._id}
                  href={`/services/${service.slug}`}
                  className="card group flex flex-col p-[26px] transition-colors duration-150 hover:border-amber"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-11 w-fit px-2 items-center justify-center rounded-md border border-edge bg-card font-mono text-[13px] text-terminal transition-colors group-hover:border-amber group-hover:text-amber">
                      {(service.icon ?? service.title.slice(0, 2)).toUpperCase()}
                    </span>
                    {service.featured ? (
                      <span className="font-mono text-[11px] text-amber">★ featured</span>
                    ) : null}
                  </div>
                  <h2 className="mb-2.5 font-display text-[18px] font-semibold leading-snug text-cream transition-colors group-hover:text-amber-gold">
                    {service.title}
                  </h2>
                  <p className="flex-1 text-sm leading-[1.6] text-muted">
                    {service.shortDescription}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-amber transition-[gap] duration-150 group-hover:gap-2.5">
                    view service →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-8 font-mono text-sm text-muted">
              <span className="text-terminal">$</span> no services found — check back soon.
            </p>
          )}
        </div>
      </section>

      <ContactStrip
        label="init project"
        title="Need one of these built?"
        description="APIs, AI pipelines, real-time infrastructure — if it's backend-shaped and it has to work, I want to hear about it."
      />
    </>
  );
}
