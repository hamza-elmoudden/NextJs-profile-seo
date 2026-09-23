"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Service } from "@/lib/services";

export default function ServicesSlider({ services }: { services: Service[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [pages, setPages] = useState(1);

  const getPerPage = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return 1;
    const first = track.children[0] as HTMLElement;
    return Math.max(1, Math.round(track.clientWidth / (first.offsetWidth + 20)));
  }, []);

  const sync = useCallback(() => {
    if (!mountedRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    const perPage = getPerPage();
    const total = Math.max(1, Math.ceil(services.length / perPage));
    setPages(total);
    setIndex(Math.min(Math.round(track.scrollLeft / track.clientWidth), total - 1));
  }, [getPerPage, services.length]);

  useEffect(() => {
    mountedRef.current = true;
    sync();
    window.addEventListener("resize", sync);
    return () => {
      mountedRef.current = false;
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const goTo = (page: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: page * track.clientWidth, behavior: "smooth" });
  };

  const arrow =
    "grid h-10 w-10 place-items-center rounded-md border border-edge bg-surface font-mono text-sm text-cream transition-colors hover:border-amber hover:text-amber disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={sync}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {services.map((service) => (
          <div key={service._id} className="w-[calc(100%-10px)] shrink-0 snap-start sm:w-[calc(50%-10px)] xl:w-[calc(25%-15px)]">
            <Link
              href={`/services/${service.slug}`}
              className="card group flex h-full flex-col p-6 transition-colors duration-150 hover:border-amber"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="flex h-11 w-fit items-center justify-center rounded-md border border-edge bg-surface px-2 font-mono text-[13px] text-terminal transition-colors group-hover:border-amber group-hover:text-amber">
                  {(service.icon ?? service.title.slice(0, 2)).toUpperCase()}
                </span>
                {service.featured ? (
                  <span className="font-mono text-[11px] text-amber">★ featured</span>
                ) : null}
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-cream transition-colors group-hover:text-amber-gold">
                {service.title}
              </h3>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted">{service.shortDescription}</p>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-amber transition-[gap] duration-150 group-hover:gap-2.5">
                view service →
              </span>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-amber" : "w-1.5 bg-edge hover:bg-muted"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous services"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className={arrow}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next services"
            onClick={() => goTo(index + 1)}
            disabled={index >= pages - 1}
            className={arrow}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
