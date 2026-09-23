"use client";

import { useAppSelector } from "@/lib/hooks";

export default function ContactStrip({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  const email = useAppSelector((state) => state.siteSettings.data?.email);

  return (
    <section id="contact" className="py-[72px]">
      <div className="container-x flex flex-wrap items-center justify-between gap-8">
        <div className="max-w-[560px]">
          <p className="section-label">{label}</p>
          <h2 className="mb-2 font-display text-[clamp(26px,3vw,36px)] font-bold leading-tight text-cream">
            {title}
          </h2>
          <p className="text-muted">{description}</p>
        </div>
        <a href={email ? `mailto:${email}` : "mailto:hello@hamza.dev"} className="btn btn-primary">
          Let&apos;s Talk →
        </a>
      </div>
    </section>
  );
}
