"use client";

import { useCallback, useRef, type PointerEvent, type ReactNode } from "react";

/**
 * Pointer-tracking spotlight card (Magic UI "Magic Card" pattern, adapted).
 * Position is written to CSS vars via ref — no re-renders on mousemove.
 * The glow layers only activate on fine pointers; hover fallback styling
 * (borders/tint) still comes from the composed className.
 */
export default function SpotlightCard({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);

  const handlePointerMove = useCallback((e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      onPointerMove={handlePointerMove}
      className={`group/spotlight relative overflow-hidden ${className}`}
    >
      {/* border glow following the pointer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(320px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 107, 0, 0.35), transparent 65%)",
          mask: "linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0)",
          padding: "1px",
        }}
      />
      {/* interior spotlight tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(420px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 107, 0, 0.08), transparent 70%)",
        }}
      />
      {children}
    </Tag>
  );
}
