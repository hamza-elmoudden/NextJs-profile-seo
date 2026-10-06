"use client";

import { useEffect, useState } from "react";
import AppLoader from "@/components/app-loader";

const MIN_DISPLAY_MS = 3800;
const FADE_MS = 600;

export const BOOT_DONE_EVENT = "portfolio:boot-done";
export const BOOT_DONE_FLAG = "__portfolioBootDone";

export default function BootScreen() {
  const [loaded, setLoaded] = useState(
    () => typeof window !== "undefined" && document.readyState === "complete",
  );
  const [minElapsed, setMinElapsed] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const onLoad = () => setLoaded(true);
    window.addEventListener("load", onLoad);
    const minTimer = window.setTimeout(() => setMinElapsed(true), MIN_DISPLAY_MS);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(minTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const fading = loaded && minElapsed;

  useEffect(() => {
    if (!fading) return;
    const timer = window.setTimeout(() => setGone(true), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [fading]);

  useEffect(() => {
    if (!gone) return;
    document.body.style.overflow = "";
    // Signal that the loader has fully faded out: the hero intro video may start.
    (window as unknown as Record<string, unknown>)[BOOT_DONE_FLAG] = true;
    window.dispatchEvent(new CustomEvent(BOOT_DONE_EVENT));
  }, [gone]);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] bg-ink transition-opacity duration-500 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <AppLoader />
    </div>
  );
}