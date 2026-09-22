import type { Metadata } from "next";
import Link from "next/link";
import PathTerminal from "@/components/not-found-terminal";

export const metadata: Metadata = {
  title: "404 — Page Not Found · Hamza Elmouddane",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[calc(100svh-140px)] flex-col items-center justify-center overflow-hidden px-5 py-16">
      <div className="bg-grid-faint pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative flex w-full max-w-[680px] flex-col items-center text-center">
        <div className="hero-reveal -mb-3 select-none font-display text-[clamp(100px,18vw,180px)] font-bold leading-none tracking-[-0.04em]">
          <span className="text-surface">4</span>
          <span className="relative text-transparent [-webkit-text-stroke:2px_var(--color-amber)]">
            0
            <span
              aria-hidden
              className="absolute inset-0 bg-amber-tint bg-clip-text text-transparent [-webkit-text-fill-color:transparent] [-webkit-text-stroke:0]"
            >
              0
            </span>
          </span>
          <span className="text-surface">4</span>
        </div>

        <PathTerminal />

        <h1 className="hero-reveal reveal-d2 mb-3 font-display text-[clamp(22px,3vw,30px)] font-bold">
          Route <span className="text-amber">not found.</span>
        </h1>
        <p className="hero-reveal reveal-d3 mb-10 max-w-[460px] text-[15px] leading-[1.7] text-muted">
          The page you&apos;re looking for doesn&apos;t exist, was moved, or the URL has a typo.
          Head back to somewhere that works.
        </p>

        <div className="hero-reveal reveal-d4 flex flex-wrap items-center justify-center gap-3.5">
          <Link href="/" className="btn btn-primary">
            ← Go Home
          </Link>
          <Link href="/about" className="btn btn-ghost">
            About Me →
          </Link>
        </div>

        <div className="hero-reveal reveal-d4 mt-10 flex flex-wrap items-center justify-center gap-2 font-mono text-xs text-muted">
          <span>or jump to</span>
          <Link
            href="/projects"
            className="rounded-[4px] border border-edge px-3 py-1 transition-colors hover:border-amber hover:text-amber"
          >
            Projects
          </Link>
          <span className="text-edge">·</span>
          <Link
            href="/blog"
            className="rounded-[4px] border border-edge px-3 py-1 transition-colors hover:border-amber hover:text-amber"
          >
            Blog
          </Link>
          <span className="text-edge">·</span>
          <a
            href="mailto:hello@hamza.dev"
            className="rounded-[4px] border border-edge px-3 py-1 transition-colors hover:border-amber hover:text-amber"
          >
            Contact
          </a>
          <span className="text-edge">·</span>
          <a
            href="https://github.com/hamza-elmoudden"
            target="_blank"
            rel="noreferrer"
            className="rounded-[4px] border border-edge px-3 py-1 transition-colors hover:border-amber hover:text-amber"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
}