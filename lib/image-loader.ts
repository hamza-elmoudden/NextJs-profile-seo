// Global next/image loader (see `images.loaderFile` in next.config.ts).
// All images are served from the Sanity CDN, which honors `w`, `q`, and
// `auto=format` query params directly.
export default function sanityLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}w=${width}&q=${quality ?? 80}&auto=format`;
}
