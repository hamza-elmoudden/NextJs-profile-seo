import createImageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";
import type { ImageLoader } from "next/image";
import type { SanityImage } from "@/lib/site-settings";

const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
});

// Accepts any Sanity image source. When the source carries hotspot/crop and
// an asset _id (as fetched via IMAGE_FRAGMENT), the builder honors them
// automatically in every derived URL.
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// next/image loader for cdn.sanity.io URLs. The CDN honors `w`, `q`, and
// `auto=format` directly, so no custom server loader is needed.
export const sanityLoader: ImageLoader = ({ src, width, quality }) => {
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}w=${width}&q=${quality ?? 80}&auto=format`;
};

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

// Open Graph images must be a stable, crawler-friendly format — so no
// auto('format') here; the CDN serves JPEG/PNG by default.
export function ogImageEntry(image: SanityImage) {
  return {
    url: urlFor(image).width(OG_IMAGE_WIDTH).height(OG_IMAGE_HEIGHT).fit("crop").url(),
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: image.alt ?? "",
  };
}
