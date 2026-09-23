"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { NavigationItem } from "@/lib/site-settings";

const REVEAL_EVENT = "portfolio:hero-reveal";
const INTRO_STORAGE_KEY = "home-hero-intro-completed";
const MAX_INTRO_MS = 15000;

const LINKS: { href: string; label: string; active?: (path: string) => boolean }[] = [
  { href: "/", label: "Home", active: (path) => path === "/" },
  { href: "/about", label: "About", active: (path) => path.startsWith("/about") },
  { href: "/services", label: "Services", active: (path) => path.startsWith("/services") },
  { href: "/#skills", label: "Skills" },
  { href: "/projects", label: "Projects", active: (path) => path.startsWith("/projects") },
  { href: "/blog", label: "Blog", active: (path) => path.startsWith("/blog") },
  { href: "/contact", label: "Contact", active: (path) => path.startsWith("/contact") },
];

function isActivePath(url: string, pathname: string) {
  if (url === "/") return pathname === "/";
  if (url.startsWith("/#")) return false;
  return pathname.startsWith(url);
}

export default function Navbar({ navigation }: { navigation?: NavigationItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const isHome = pathname === "/";

  const navItems = navigation?.length
    ? navigation.map((item) => ({
        href: item.url,
        label: item.label,
        external: item.external ?? item.url.startsWith("http"),
        active: (path: string) => isActivePath(item.url, path),
      }))
    : LINKS;

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header || !isHome) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const readIntroCompleted = () => {
      try {
        return window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "true";
      } catch {
        return false;
      }
    };

    const introCompleted = readIntroCompleted();
    let revealed = introCompleted;

    if (introCompleted) {
      gsap.set(header, { autoAlpha: 1, y: 0, clearProps: "all" });
    } else {
      gsap.set(header, { autoAlpha: 0, y: -30 });
    }

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      gsap.to(header, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => gsap.set(header, { clearProps: "transform,visibility,opacity" }),
      });
    };

    window.addEventListener(REVEAL_EVENT, reveal);
    const fallback = window.setTimeout(reveal, MAX_INTRO_MS);

    return () => {
      window.removeEventListener(REVEAL_EVENT, reveal);
      window.clearTimeout(fallback);
    };
  }, [isHome]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-[100] border-b border-edge bg-[rgba(13,16,18,0.88)] backdrop-blur-xl"
    >
      <div className="container-x flex h-[68px] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 font-display text-[20px] font-bold">
          <span className="grid h-[34px] w-[34px] place-items-center rounded-md border border-amber bg-amber-tint font-mono text-sm font-bold text-amber">
            HE
          </span>
          <span>
            hamza<span className="text-amber">.</span>dev
          </span>
        </Link>

        <nav className="hidden items-center gap-[30px] lg:flex">
          {navItems.map((link) => {
            const isActive = link.active?.(pathname) ?? false;
            return (
              <Link
                key={link.href}
                href={link.href}
                target={"external" in link && link.external ? "_blank" : undefined}
                rel={"external" in link && link.external ? "noreferrer" : undefined}
                className={`relative text-sm font-medium transition-colors duration-150 after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-0 after:bg-amber after:transition-[width] after:duration-200 hover:text-cream hover:after:w-full ${
                  isActive ? "text-cream after:w-full" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="ml-2 hidden rounded-md bg-amber px-[18px] py-[9px] font-mono text-[13px] font-medium text-ink transition-colors hover:bg-amber-gold xl:inline-flex"
          >
            Let&apos;s Talk →
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-edge px-3 py-2 font-mono text-[13px] text-cream lg:hidden"
        >
          [ menu ]
        </button>
      </div>

      <nav
        className={`${
          open ? "flex" : "hidden"
        } absolute left-0 right-0 top-[68px] flex-col items-start gap-4 border-b border-edge bg-base px-8 py-5 lg:hidden`}
      >
        {navItems.map((link) => {
          const isActive = link.active?.(pathname) ?? false;
          return (
            <Link
              key={link.href}
              href={link.href}
              target={"external" in link && link.external ? "_blank" : undefined}
              rel={"external" in link && link.external ? "noreferrer" : undefined}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium ${isActive ? "text-cream" : "text-muted"}`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}