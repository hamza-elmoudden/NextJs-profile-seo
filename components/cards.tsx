import Link from "next/link";
import type { Post, Service, Skill } from "@/lib/content";

export function ServiceCard({ title, stack, description, icon }: Service) {
  return ( 
    <article className="card card-hover flex flex-col p-6">
      <div className="mb-5 grid h-11 w-fit  py-2  px-2 place-items-center rounded-md border border-edge bg-surface text-amber">
        {icon}
      </div>
      <h3 className="mb-2 font-display text-lg font-semibold text-cream">{title}</h3>
      <div className="mb-[18px] font-mono text-[11px] text-terminal">{stack}</div>
      <p className="mb-5 flex-1 text-sm leading-relaxed text-muted">{description}</p>
      <Link
        href="/#contact"
        className="group inline-flex items-center gap-1.5 self-start font-mono text-[13px] text-amber"
      >
        learn more
        <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
      </Link>
    </article>
  );
}

export function SkillCard({ name, tag, icon, secondary }: Skill) {
  return (
    <div
      className={`card flex flex-col items-center px-3 pb-[18px] pt-6 text-center transition-colors duration-150 hover:border-amber hover:bg-amber-tint ${
        secondary ? "opacity-75" : ""
      }`}
    >
      <div className={`mb-3 ${secondary ? "text-muted" : "text-amber"}`}>{icon}</div>
      <div className="font-mono text-[13px] text-cream">{name}</div>
      <div className="mt-1 font-mono text-[10px] text-muted">{tag}</div>
    </div>
  );
}

export function PostCard({ slug, tag, date, readTime, title, excerpt }: Post) {
  const href = `/blog/${slug}`;
  return (
    <article className="card card-hover flex flex-col p-6">
      <div className="mb-4 flex items-center gap-3 font-mono text-[11px] text-muted">
        <span className="rounded-[4px] border border-edge px-2 py-0.5 text-terminal">{tag}</span>
        <span>{date}</span>
        {readTime ? <span>· {readTime}</span> : null}
      </div>
      <h3 className="mb-2.5 font-display text-lg font-semibold leading-snug text-cream">
        <Link href={href} className="transition-colors hover:text-amber-gold">
          {title}
        </Link>
      </h3>
      <p className="mb-5 flex-1 truncate text-sm text-muted">{excerpt}</p>
      <Link href={href} className="inline-flex items-center gap-1.5 font-mono text-xs text-amber">
        read post →
      </Link>
    </article>
  );
}