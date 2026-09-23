"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import AppLoader from "@/components/app-loader";

const MIN_DISPLAY_MS = 3800;
const FADE_MS = 600;
const INTRO_STORAGE_KEY = "home-hero-intro-completed";

const noopSubscribe = () => () => {};

const readIntroCompleted = () => {
  try {
    return window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export default function BootScreen() {
  const pathname = usePathname();

  // First visit to Home: skip the splash so the hero video intro is the
  // first thing the user sees. Server snapshot keeps SSR output stable.
  const skipHomeIntro = useSyncExternalStore(
    noopSubscribe,
    () => pathname === "/" && !readIntroCompleted(),
    () => false,
  );

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
    if (!gone && !skipHomeIntro) return;
    document.body.style.overflow = "";
  }, [gone, skipHomeIntro]);

  if (gone || skipHomeIntro) return null;

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