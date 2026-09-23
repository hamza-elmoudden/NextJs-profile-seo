"use client";

import Link from "next/link";
import { useState } from "react";
import { BLOG_CATEGORIES, type BlogPost } from "@/lib/content";

const POSTS_PER_PAGE = 6;

const TAG_LABELS: Record<string, string> = {
  "system-design": "system design",
};

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article
      className={`card group flex flex-col overflow-hidden transition-colors duration-150 hover:border-amber ${
        post.pinned ? "border-[rgba(255,107,0,0.3)]" : ""
      }`}
    >
      <div className="relative flex-shrink-0 overflow-hidden">
        <div className="relative flex h-[180px] items-center justify-center overflow-hidden bg-surface">
          <div
            className="absolute inset-0 opacity-60"
            aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(var(--color-card) 1px, transparent 1px), linear-gradient(90deg, var(--color-card) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/^https?:\/\//.test(post.cover) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span className="relative font-mono text-[22px] font-bold uppercase tracking-[0.06em] text-edge">
              {post.cover}
            </span>
          )}
        </div>
        <span
          className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-amber to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden
        />
        {post.pinned ? (
          <span className="absolute left-3 top-3 rounded-[4px] border border-[rgba(255,107,0,0.4)] bg-[rgba(13,16,18,0.82)] px-2.5 py-1 font-mono text-[10px] text-amber backdrop-blur-sm">
            📌 pinned
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-[22px] pb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2.5 font-mono text-[11px] text-muted">
          <span className="rounded-[4px] border border-edge px-2 py-0.5 text-terminal">
            {TAG_LABELS[post.tag] ?? post.tag}
          </span>
          <span>{post.date}</span>
          {post.readTime ? <span>· {post.readTime}</span> : null}
        </div>
        <h3 className="mb-2.5 font-display text-[17px] font-semibold leading-snug text-cream">
          <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-amber-gold">
            {post.title}
          </Link>
        </h3>
        <p className="mb-5 flex-1 text-sm leading-[1.65] text-muted">{post.excerpt}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-amber transition-[gap] duration-150 group-hover:gap-2.5"
        >
          read post →
        </Link>
      </div>
    </article>
  );
}

export default function BlogPosts({
  posts,
  categories,
  showFilter = true,
  activeCategory = "all",
}: {
  posts: BlogPost[];
  categories?: { id: string; label: string }[];
  showFilter?: boolean;
  activeCategory?: string;
}) {
  const filterCategories =
    categories ??
    BLOG_CATEGORIES.filter((c) => c.id !== "all").map((c) => ({ id: c.id, label: c.label }));

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const visiblePosts =
    totalPages > 1 ? posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE) : posts;

  const pageButtonClass = (active: boolean) =>
    `min-h-10 rounded-md border px-4 font-mono text-[13px] transition-all duration-150 ${
      active
        ? "border-amber bg-amber-tint text-amber"
        : "border-edge bg-transparent text-muted hover:border-amber hover:bg-amber-tint hover:text-cream"
    }`;

  const navButtonClass = (disabled: boolean) =>
    `min-h-10 rounded-md border px-4 font-mono text-[13px] transition-all duration-150 ${
      disabled
        ? "cursor-not-allowed border-edge text-edge opacity-50"
        : "border-edge bg-transparent text-muted hover:border-amber hover:bg-amber-tint hover:text-cream"
    }`;

  const filterClass = (active: boolean) =>
    `rounded-full border px-4 py-[7px] font-mono text-xs transition-all duration-150 ${
      active
        ? "border-amber bg-amber-tint text-amber"
        : "border-edge bg-transparent text-muted hover:border-amber hover:bg-amber-tint hover:text-cream"
    }`;

  return (
    <>
      {showFilter ? (
        <div className="sticky top-[68px] z-50 border-b border-edge bg-base py-5">
          <div className="container-x flex flex-wrap items-center gap-3">
            <Link href="/blog" className={filterClass(activeCategory === "all")}>
              all
            </Link>
            {filterCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.id}`}
                className={filterClass(activeCategory === cat.id)}
              >
                {cat.label}
              </Link>
            ))}
            <span className="hidden h-5 w-px bg-edge sm:block" aria-hidden />
            <span className="ml-auto pl-2 font-mono text-[11px] text-muted">
              showing <span className="text-amber">{posts.length}</span> posts
            </span>
          </div>
        </div>
      ) : null}

      <section className="pb-[52px] pt-16">
        <div className="container-x">
          <div className="mb-12 grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 xl:grid-cols-3">
            {visiblePosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={navButtonClass(currentPage === 1)}
              >
                ← prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={pageButtonClass(page === currentPage)}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={navButtonClass(currentPage === totalPages)}
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
