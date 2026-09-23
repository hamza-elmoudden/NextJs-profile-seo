import { sanityClient } from "@/lib/sanity";
import type { SanityImage } from "@/lib/site-settings";

export interface AboutSeo {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  noIndex: boolean | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: SanityImage | null;
}

export interface AboutPage {
  title: string;
  introduction: string | null;
  biography: unknown[] | null;
  profileImage: (SanityImage & {
    asset: { url: string; metadata?: { dimensions?: unknown; lqip?: string } };
  }) | null;
  location: string | null;
  seo: AboutSeo | null;
  jsonLd: string | null;
}

export const GET_ABOUT_PAGE = `*[_type == "aboutPage"][0] {
  title,
  introduction,
  biography,
  profileImage {
    asset-> { url, metadata { dimensions, lqip } },
    alt,
    "caption": coalesce(caption, null)
  },
  location,
  seo {
    metaTitle,
    metaDescription,
    canonicalUrl,
    noIndex,
    ogTitle,
    ogDescription,
    ogImage {
      asset-> { url },
      alt
    }
  },
  jsonLd
}`;

const ABOUT_FETCH_OPTIONS = {
  cache: "force-cache" as const,
  next: { revalidate: 1800, tags: ["about"] as string[] },
};

export async function getAboutPage(): Promise<AboutPage | null> {
  return sanityClient.fetch<AboutPage | null>(GET_ABOUT_PAGE, {}, ABOUT_FETCH_OPTIONS);
}
