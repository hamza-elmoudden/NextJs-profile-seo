import { sanityClient } from "@/lib/sanity";

export interface SanityImage {
  asset: { url: string };
  alt: string | null;
  caption?: string | null;
}

export interface SocialLink {
  _key: string;
  platform: string;
  url: string;
  label: string | null;
}

export interface NavigationItem {
  _key: string;
  label: string;
  url: string;
  external: boolean;
  children: NavigationItem[];
}

export interface SiteSettings {
  siteName: string;
  siteTitle: string | null;
  siteDescription: string | null;
  logo: SanityImage | null;
  defaultOgImage: SanityImage | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  socialLinks: SocialLink[];
  navigation: NavigationItem[];
  footerText: string | null;
}

export const GET_SITE_SETTINGS = `*[_type == "siteSettings"][0] {
  siteName,
  siteTitle,
  siteDescription,
  logo {
    asset-> { url },
    alt,
    "caption": coalesce(caption, null)
  },
  defaultOgImage {
    asset-> { url },
    "alt": null
  },
  email,
  phone,
  location,
  socialLinks[] { _key, platform, url, label },
  navigation[] { _key, label, url, external, children[] { _key, label, url, external, children } },
  footerText
}`;

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityClient.fetch<SiteSettings | null>(GET_SITE_SETTINGS);
}
