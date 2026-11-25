"use client";

import Image, { type ImageProps } from "next/image";
import { sanityLoader } from "@/lib/image";

// next/image with the cdn.sanity.io loader. The loader is a function, which a
// server component can't pass across the client boundary, so it's bound here.
export default function SanityNextImage(props: Omit<ImageProps, "loader">) {
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is required by ImageProps and forwarded
  return <Image loader={sanityLoader} {...props} />;
}
