"use client";

import Link from "next/link";

export default function ContactStrip({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <section id="contact" className="py-[72px]">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-md border border-edge bg-card px-6 py-12 min-[860px]:px-12">
          <span className="border-beam" aria-hidden />
          <div
            className="bg-grid-faint pointer-events-none absolute inset-0"
            aria-hidden
          />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-[560px]">
              <p className="section-label">{label}</p>
              <h2 className="mb-2 font-display text-[clamp(26px,3vw,36px)] font-bold leading-tight text-cream">
                {title}
              </h2>
              <p className="text-muted">{description}</p>
            </div>
            <Link href="/contact" className="btn btn-primary">
              Let&apos;s Talk →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
