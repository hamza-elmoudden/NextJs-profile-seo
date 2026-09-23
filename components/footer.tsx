"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useAppSelector } from "@/lib/hooks";
import type { SocialLink } from "@/lib/site-settings";

const SOCIAL_ICONS: Record<string, typeof FaGithub> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  x: FaXTwitter,
  twitter: FaXTwitter,
};

const FALLBACK_SOCIAL_LINKS: SocialLink[] = [
  { _key: "github", platform: "github", url: "https://github.com/hamza-elmoudden", label: "GitHub" },
  { _key: "linkedin", platform: "linkedin", url: "https://linkedin.com/in/hamza-elmouddane-08a140296", label: "LinkedIn" },
  { _key: "instagram", platform: "instagram", url: "#", label: "Instagram" },
  { _key: "x", platform: "x", url: "#", label: "X" },
];

export default function Footer() {
  const settings = useAppSelector((state) => state.siteSettings.data);
  const socialLinks = settings?.socialLinks?.length ? settings.socialLinks : FALLBACK_SOCIAL_LINKS;
  const copyright =
    settings?.footerText ?? `© 2026 ${settings?.siteName ?? "Hamza Elmouddane"} — ${settings?.location ?? "Morocco"}`;

  return (
    <footer className="border-t border-edge py-7">
      <div className="container-x flex flex-wrap items-center justify-between gap-5 font-mono text-xs text-muted">
        <span>{copyright}</span>
        <div className="flex items-center gap-[22px]">
          {settings?.email && (
            <a
              href={`mailto:${settings.email}`}
              aria-label="Email"
              className="transition-colors hover:text-amber"
            >
              <FaEnvelope size={16} />
            </a>
          )}
          {socialLinks.map((link) => {
            const Icon = SOCIAL_ICONS[link.platform.toLowerCase()] ?? FaGithub;
            const withLabel = link.platform.toLowerCase() === "github";
            return (
              <Link
                key={link._key}
                href={link.url}
                aria-label={link.label ?? link.platform}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel={link.url.startsWith("http") ? "noreferrer" : undefined}
                className="flex items-center gap-1.5 transition-colors hover:text-amber"
              >
                <Icon size={16} />
                {withLabel && <span>{link.label ?? link.platform}</span>}
              </Link>
            );
          })}
        </div>
        <span>
          <span className="text-terminal">●</span> all systems operational
        </span>
      </div>
    </footer>
  );
}
