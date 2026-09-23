"use client";

import { useAppSelector } from "@/lib/hooks";

export default function ContactEmailLink() {
  const email = useAppSelector((state) => state.siteSettings.data?.email);
  const address = email ?? "hello@hamza.dev";

  return (
    <a
      href={`mailto:${address}`}
      className="mt-3 inline-flex font-mono text-[13px] text-amber transition-colors hover:text-amber-gold"
    >
      {address} ↗
    </a>
  );
}
