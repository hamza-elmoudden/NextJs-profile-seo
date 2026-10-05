import Image from "next/image";
import { sanityLoader, urlFor } from "@/lib/image";
import type { SanityImage } from "@/lib/site-settings";

type SanityImageProps = {
  image: SanityImage;
  /** Render width in px. Height is derived from the asset aspect ratio when omitted. */
  width?: number;
  height?: number;
  /** Fill the positioned parent instead of using width/height. */
  fill?: boolean;
  sizes?: string;
  /** Set for above-the-fold / LCP images. */
  priority?: boolean;
  className?: string;
  /** Overrides image.alt. Pass "" for decorative images. */
  alt?: string;
  quality?: number;
  /** When a string, wraps the image in the standard figure/figcaption pattern. */
  caption?: string | null;
  figureClassName?: string;
};

// Server-compatible and dependency-light, so it can also render inside
// client components (the Sanity URL builder is isomorphic).
export default function SanityImage({
  image,
  width = 1200,
  height,
  fill,
  sizes,
  priority,
  className,
  alt,
  quality = 80,
  caption,
  figureClassName,
}: SanityImageProps) {
  const dimensions = image.asset.metadata?.dimensions;
  const resolvedHeight =
    height ?? (dimensions ? Math.round(width / dimensions.aspectRatio) : undefined);
  const lqip = image.asset.metadata?.lqip;

  // src carries no w/q params — sanityLoader appends them per srcset entry.
  const src = urlFor(image).auto("format").url();

  const img = (
    <Image
      loader={sanityLoader}
      src={src}
      alt={alt ?? image.alt ?? ""}
      {...(fill || resolvedHeight === undefined
        ? { fill: true }
        : { width, height: resolvedHeight })}
      sizes={sizes}
      priority={priority}
      quality={quality}
      className={className}
      {...(lqip ? { placeholder: "blur" as const, blurDataURL: lqip } : {})}
    />
  );

  if (figureClassName !== undefined || typeof caption === "string") {
    return (
      <figure className={figureClassName}>
        {img}
        {typeof caption === "string" ? (
          <figcaption className="border-t border-edge bg-card px-4 py-2.5 text-center font-mono text-[11px] text-muted">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return img;
}
