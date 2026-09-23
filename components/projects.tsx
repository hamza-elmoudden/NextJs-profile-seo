"use client";

import Link from "next/link";
import { useState } from "react";
import { PROJECT_FILTERS, type Project, type ProjectStatus } from "@/lib/content";

const STATUS_DOT: Record<ProjectStatus, string> = {
  live: "bg-terminal shadow-[0_0_6px_var(--color-terminal)]",
  wip: "bg-amber-gold shadow-[0_0_6px_var(--color-amber-gold)]",
  concept: "bg-amber-gold shadow-[0_0_6px_var(--color-amber-gold)]",
  paused: "bg-muted",
  archived: "bg-danger",
};

const TYPE_BADGE: Record<string, string> = {
  "Client Work": "text-amber border-[rgba(255,107,0,0.3)]",
  "Open Source": "text-screen border-[rgba(15,240,170,0.3)]",
  SaaS: "text-amber-gold border-[rgba(255,170,51,0.3)]",
};

function ProjectCover({ project }: { project: Project }) {
  return (
    <div className="relative flex h-[196px] flex-shrink-0 items-center justify-center overflow-hidden bg-surface">
      {project.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${project.imageUrl}?w=800&auto=format`}
          alt={project.imageAlt ?? project.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-60"
            aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(var(--color-card) 1px, transparent 1px), linear-gradient(90deg, var(--color-card) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <span className="relative font-mono text-[20px] font-bold uppercase tracking-[0.06em] text-edge">
            {project.initials}
          </span>
        </>
      )}
      <span
        className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-amber to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-hidden
      />
      <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-edge bg-[rgba(13,16,18,0.85)] px-3 py-[5px] font-mono text-[10px] text-muted backdrop-blur-sm">
        <span className={`h-[6px] w-[6px] rounded-full ${STATUS_DOT[project.status]}`} />
        {project.statusLabel}
      </span>
      {project.pinned ? (
        <span className="absolute right-3 top-3 z-10 rounded-[4px] border border-[rgba(255,107,0,0.4)] bg-[rgba(13,16,18,0.85)] px-2.5 py-1 font-mono text-[10px] text-amber backdrop-blur-sm">
          📌 pinned
        </span>
      ) : null}
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const style = TYPE_BADGE[type] ?? "text-terminal border-edge";
  return (
    <span className={`rounded-[4px] border px-2 py-[2px] font-mono text-[11px] ${style}`}>
      {type}
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className={`card group relative flex flex-col overflow-hidden transition-colors duration-150 hover:border-amber ${
        project.pinned ? "border-[rgba(255,107,0,0.3)]" : ""
      }`}
    >
      <ProjectCover project={project} />
      <div className="flex flex-1 flex-col p-[22px] pb-6">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </div>
        <h3 className="mb-2 font-display text-[17px] font-semibold leading-snug text-cream">
          <Link
            href={`/projects/${project.slug}`}
            className="transition-colors hover:text-amber-gold after:absolute after:inset-0"
          >
            {project.name}
          </Link>
        </h3>
        <p className="mb-[18px] flex-1 text-sm leading-[1.65] text-muted">{project.description}</p>
        <div className="mb-[18px] flex flex-wrap gap-1.5">
          {project.stack.map((tag) => (
            <span
              key={tag}
              className="rounded-[4px] border border-edge bg-surface px-2.5 py-[3px] font-mono text-[10px] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="relative z-10 flex gap-2.5">
          {project.liveUrl ? (
            <Link
              href={project.liveUrl}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-amber transition-[gap] duration-150 group-hover:gap-2.5"
            >
              view project →
            </Link>
          ) : null}
          {project.githubUrl ? (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-cream"
            >
              GitHub ↗
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

const PROJECTS_PER_PAGE = 6;

export default function Projects({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const visible =
    active === "all" ? projects : projects.filter((p) => p.filters.includes(active));

  const totalPages = Math.ceil(visible.length / PROJECTS_PER_PAGE);
  const visiblePage = visible.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  return (
    <>
      <div className="sticky top-[68px] z-50 border-b border-edge bg-base py-5">
        <div className="container-x flex flex-wrap items-center gap-3">
          {PROJECT_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => {
                setActive(filter.id);
                setCurrentPage(1);
              }}
              className={`rounded-full border px-4 py-[7px] font-mono text-xs transition-all duration-150 ${
                active === filter.id
                  ? "border-amber bg-amber-tint text-amber"
                  : "border-edge bg-transparent text-muted hover:border-amber hover:bg-amber-tint hover:text-cream"
              }`}
            >
              {filter.label}
            </button>
          ))}
          <span className="hidden h-5 w-px bg-edge sm:block" aria-hidden />
          <span className="ml-auto pl-2 font-mono text-[11px] text-muted">
            showing <span className="text-amber">{visible.length}</span> projects
          </span>
        </div>
      </div>

      <section className="pb-[52px] pt-16">
        <div className="container-x">
          <div className="mb-12 grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 xl:grid-cols-3">
            {visiblePage.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`min-h-10 rounded-md border px-4 font-mono text-[13px] transition-all duration-150 ${
                  currentPage === 1
                    ? "cursor-not-allowed border-edge text-edge opacity-50"
                    : "border-edge bg-transparent text-muted hover:border-amber hover:bg-amber-tint hover:text-cream"
                }`}
              >
                ← prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`min-h-10 rounded-md border px-4 font-mono text-[13px] transition-all duration-150 ${
                    page === currentPage
                      ? "border-amber bg-amber-tint text-amber"
                      : "border-edge bg-transparent text-muted hover:border-amber hover:bg-amber-tint hover:text-cream"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`min-h-10 rounded-md border px-4 font-mono text-[13px] transition-all duration-150 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed border-edge text-edge opacity-50"
                    : "border-edge bg-transparent text-muted hover:border-amber hover:bg-amber-tint hover:text-cream"
                }`}
              >
                next →
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}