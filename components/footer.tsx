"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import type { SocialLink } from "@/lib/site-settings";

const FALLBACK_SOCIAL_LINKS: SocialLink[] = [
  { _key: "github", platform: "github", url: "https://github.com/hamza-elmoudden", label: "hamza-elmouddane" },
  { _key: "linkedin", platform: "linkedin", url: "https://linkedin.com/in/hamza-elmouddane-08a140296", label: "hamza_elmouddane" },
];

const NAV_LINKS = [
  { href: "/", label: "home" },
  { href: "/projects", label: "projects" },
  { href: "/about", label: "about" },
  { href: "/blog", label: "blog" },
  { href: "/contact", label: "contact" },
  { href: "/services", label: "services" },
];

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const linkClass =
  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-cream no-underline transition-all duration-150 hover:bg-amber-tint hover:pl-3.5 hover:text-amber group";

function PaneBar({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-edge px-3.5 py-2.5 text-xs text-muted">
      <i className="h-[9px] w-[9px] rounded-full bg-edge" />
      <i className="h-[9px] w-[9px] rounded-full bg-edge" />
      <i className="h-[9px] w-[9px] rounded-full bg-edge" />
      <span className="ml-2">{title}</span>
    </div>
  );
}

export default function Footer() {
  const settings = useAppSelector((state) => state.siteSettings.data);
  const socialLinks = settings?.socialLinks?.length ? settings.socialLinks : FALLBACK_SOCIAL_LINKS;
  const name = settings?.siteName ?? "Hamza Elmouddane";
  const email = settings?.email ?? "hamzaelmouddanedev@gmail.com";
  const time = useClock();
  const pathname = usePathname();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- pathname is the reshuffle trigger
  const order = useMemo(() => shuffle([0, 1, 2]), [pathname]);

  const boxes = [
    {
      key: "kv",
      node: (
        <dl className="grid h-full max-w-[520px] grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 rounded-xl border border-edge bg-card px-5 py-[18px]">
          <dt className="text-amber">uptime</dt>
          <dd className="text-muted">since 2019 — still shipping</dd>
          <dt className="text-amber">local</dt>
          <dd className="text-muted">gmt+1 · {time}</dd>
          <dt className="text-amber">mail</dt>
          <dd>
            <a
              href={`mailto:${email}`}
              className="break-all border-b border-dashed border-muted text-cream transition-colors hover:border-amber hover:text-amber"
            >
              {email}
            </a>
          </dd>
        </dl>
      ),
    },
    {
      key: "pages",
      node: (
        <section className="h-full overflow-hidden rounded-xl border border-edge bg-card">
          <PaneBar title="~/pages" />
          <p className="px-[18px] pt-4 text-cream">
            <span className="mr-2 font-medium text-amber">&gt;</span>cd ./pages
          </p>
          <nav aria-label="Footer navigation" className="px-2.5 pb-3.5 pt-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                <span className="text-muted transition-colors group-hover:text-amber">▸</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </section>
      ),
    },
    {
      key: "social",
      node: (
        <section className="h-full overflow-hidden rounded-xl border border-edge bg-card">
          <PaneBar title="~/social" />
          <p className="px-[18px] pt-4 text-cream">
            <span className="mr-2 font-medium text-amber">&gt;</span>ping ./social
          </p>
          <ul className="px-2.5 pb-3.5 pt-1">
            <li>
              <a href={`mailto:${email}`} className={linkClass}>
                <span className="text-muted transition-colors group-hover:text-amber">→</span>
                email
              </a>
            </li>
            {socialLinks.map((link) => (
              <li key={link._key}>
                <a
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : undefined}
                  rel={link.url.startsWith("http") ? "noreferrer" : undefined}
                  className={linkClass}
                >
                  <span className="text-muted transition-colors group-hover:text-amber">→</span>
                  {(link.label ?? link.platform).toLowerCase()}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ),
    },
  ];

  return (
    <footer className="border-t border-edge bg-base font-mono text-sm">
      <div className="container-x py-12">
        <div className="grid h-16 w-16 place-items-center rounded-full border-[1.5px] border-amber text-[22px] text-amber shadow-[0_0_28px_-4px_var(--color-amber),inset_0_0_14px_-6px_var(--color-amber)]">
          H
        </div>
        <p className="mt-6 text-lg font-bold tracking-tight text-cream">{name}</p>
        <p className="mt-1 text-muted">software engineer — building for the web</p>

        <div className="mt-8 grid gap-6 min-[680px]:grid-cols-2">
          {order.map((boxIndex, position) => (
            <div
              key={boxes[boxIndex].key}
              className={position === 0 ? "min-[680px]:col-span-2" : ""}
              style={{ animation: "hero-in 0.4s ease both" }}
            >
              {boxes[boxIndex].node}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-edge">
        <div className="container-x flex flex-wrap items-center justify-between gap-2.5 py-[18px] text-xs text-muted">
          <span>© 2026 {name} — all rights reserved</span>
          <span className="flex items-center gap-2">
            <span className="relative flex h-[7px] w-[7px]">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-60" />
              <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-amber" />
            </span>
            all systems operational
          </span>
          <span>{time}</span>
        </div>
      </div>
    </footer>
  );
}
