import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactStrip from "@/components/contact-strip";
import PortableBody from "@/components/portable-body";
import { getAllServiceSlugs, getServiceBySlug, getServices } from "@/lib/services";

// ISR: revalidate service pages every 25 minutes; new slugs render on demand
export const revalidate = 1500;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found — Hamza Elmouddane" };

  const title = service.seo?.metaTitle ?? service.title;
  const description = service.seo?.metaDescription ?? service.shortDescription;

  return {
    title: `${title} — Hamza Elmouddane`,
    description,
    alternates: service.seo?.canonicalUrl
      ? { canonical: service.seo.canonicalUrl }
      : undefined,
    robots: service.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: service.seo?.ogTitle ?? title,
      description: service.seo?.ogDescription ?? description,
      images: service.seo?.ogImage?.asset?.url
        ? [{ url: service.seo.ogImage.asset.url }]
        : undefined,
    },
    twitter: {
      card: service.seo?.twitterCard ?? "summary_large_image",
      title: service.seo?.ogTitle ?? title,
      description: service.seo?.ogDescription ?? description,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const allServices = await getServices();
  const others = allServices.filter((s) => s._id !== service._id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
    provider: {
      "@type": "Person",
      name: "Hamza Elmouddane",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── SERVICE HERO ──────────────────────────── */}
      <section className="relative overflow-hidden border-b border-edge py-[72px]">
        <div className="bg-grid-faint pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative">
          <Link
            href="/services"
            className="hero-reveal mb-8 inline-flex items-center gap-1.5 font-mono text-[13px] text-muted transition-colors hover:text-amber"
          >
            ← cd ~/services
          </Link>
          <div className="hero-reveal mb-[18px] flex items-center gap-4">
            <span className="flex h-12 w-fit px-2 items-center justify-center rounded-md border border-edge bg-card font-mono text-sm text-terminal">
              {(service.icon ?? service.title.slice(0, 2)).toUpperCase()}
            </span>
            <span className="font-mono text-[11px] text-muted">
              service/{service.slug}
              {service.featured ? <span className="ml-3 text-amber">★ featured</span> : null}
            </span>
          </div>
          <h1 className="hero-reveal reveal-d1 mb-[18px] max-w-[860px] font-display text-[clamp(30px,4vw,52px)] font-bold leading-[1.15] tracking-tight">
            {service.title}
          </h1>
          <p className="hero-reveal reveal-d2 max-w-[640px] text-[17px] leading-[1.7] text-muted">
            {service.shortDescription}
          </p>
        </div>
      </section>

      {/* ── DESCRIPTION ───────────────────────────── */}
      <section className="border-b border-edge py-[64px]">
        <div className="container-x">
          <article className="max-w-[720px]">
            <p className="section-label mb-8">cat {service.slug}.md</p>
            <PortableBody body={service.description} />
          </article>
        </div>
      </section>

      {/* ── OTHER SERVICES ────────────────────────── */}
      {others.length > 0 ? (
        <section className="border-b border-edge bg-base py-[72px]">
          <div className="container-x">
            <p className="section-label hero-reveal">cat other.services</p>
            <div className="mt-8 grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 xl:grid-cols-3">
              {others.map((s) => (
                <Link
                  key={s._id}
                  href={`/services/${s.slug}`}
                  className="card group flex flex-col p-[22px] transition-colors duration-150 hover:border-amber"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-fit px-2 py-2 items-center justify-center rounded-md border border-edge bg-card font-mono text-xs text-terminal">
                      {(s.icon ?? s.title.slice(0, 2)).toUpperCase()}
                    </span>
                    <h3 className="font-display text-[16px] font-semibold text-cream transition-colors group-hover:text-amber-gold">
                      {s.title}
                    </h3>
                  </div>
                  <p className="flex-1 text-sm leading-[1.6] text-muted">
                    {s.shortDescription.slice(0, 120)}
                    {s.shortDescription.length > 120 ? "…" : ""}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-amber transition-[gap] duration-150 group-hover:gap-2.5">
                    view service →
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
          <Link href="/services" className="btn btn-primary">
            ← all services
          </Link>
        </div>
      </section>

      <ContactStrip
        label="init request"
        title={`Need ${service.title.toLowerCase()}?`}
        description="Tell me what you're building and what it has to survive. I'll reply with a plan, a timeline, and zero buzzwords."
      />
    </>
  );
}
