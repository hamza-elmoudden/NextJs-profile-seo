"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const REVEAL_EVENT = "portfolio:hero-reveal";
const INTRO_STORAGE_KEY = "home-hero-intro-completed";
const MAX_INTRO_MS = 15000;

export default function HeroEffects() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current?.closest("section");
    const video = root?.querySelector<HTMLVideoElement>("[data-hero-video]");
    const loopVideo = root?.querySelector<HTMLVideoElement>(
      "[data-hero-video-loop]",
    );
    const canvas = root?.querySelector<HTMLCanvasElement>("[data-hero-canvas]");
    if (!root || !video) return;
    const ctx = canvas?.getContext("2d");

    // Crossfade to the seamless loop video after the intro/greeting ends.
    const swapToLoopVideo = () => {
      if (!loopVideo) return;
      const p = loopVideo.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
      loopVideo.classList.remove("opacity-0");
    };

    const readIntroCompleted = () => {
      try {
        return window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "true";
      } catch {
        return false;
      }
    };

    const markIntroComplete = () => {
      try {
        window.sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
      } catch {
        /* sessionStorage unavailable — noop */
      }
    };

    // Full browser reload must always replay the intro, even though
    // sessionStorage normally survives reloads within the same tab.
    // SPA/client-side navigations never create a new navigation entry, so
    // their type stays "navigate" and the flag is preserved there.
    try {
      const navEntry = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming | undefined;
      if (navEntry?.type === "reload") {
        window.sessionStorage.removeItem(INTRO_STORAGE_KEY);
      }
    } catch {
      /* performance API unavailable — noop */
    }

    // Intro already completed this session: skip video + GSAP intro.
    // Freeze the video's exact final frame onto the canvas and hide the
    // video element, so navigation never replays or shows a wrong frame.
    if (readIntroCompleted()) {
      const freezeLastFrame = () => {
        if (!ctx || video.videoWidth === 0) return;
        canvas!.width = video.videoWidth;
        canvas!.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas!.width, canvas!.height);
        video.style.visibility = "hidden";
        swapToLoopVideo();
      };
      const seekToEnd = () => {
        if (Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = video.duration;
        }
      };
      const handleMeta = () => seekToEnd();
      const handleSeeked = () => freezeLastFrame();

      video.addEventListener("loadedmetadata", handleMeta);
      video.addEventListener("seeked", handleSeeked);
      if (video.readyState >= 1) seekToEnd();
      video.pause();

      let revealTimer = 0;
      revealTimer = window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent(REVEAL_EVENT));
      }, 0);
      return () => {
        window.clearTimeout(revealTimer);
        video.removeEventListener("loadedmetadata", handleMeta);
        video.removeEventListener("seeked", handleSeeked);
      };
    }

    const captureFrame = () => {
      if (!ctx || video.videoWidth === 0) return;
      canvas!.width = video.videoWidth;
      canvas!.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas!.width, canvas!.height);
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const els = {
      badge: root.querySelector<HTMLElement>("[data-hero-badge]"),
      whoami: root.querySelector<HTMLElement>("[data-hero-whoami]"),
      lines: Array.from(
        root.querySelectorAll<HTMLElement>("[data-hero-line]"),
      ),
      desc: root.querySelector<HTMLElement>("[data-hero-desc]"),
      buttons: Array.from(
        root.querySelectorAll<HTMLElement>("[data-hero-button]"),
      ),
      stats: root.querySelector<HTMLElement>("[data-hero-stats]"),
      terminal: root.querySelector<HTMLElement>("[data-hero-terminal]"),
    };

    let timeline: gsap.core.Timeline | null = null;

    const buildReveal = () => {
      if (timeline) timeline.kill();
      const tl = gsap.timeline({
        delay: 0.35,
        defaults: { ease: "power3.out" },
      });
      timeline = tl;

      if (els.badge) {
        tl.fromTo(
          els.badge,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.7 },
        );
      }
      if (els.whoami) {
        tl.fromTo(
          els.whoami,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.35",
        );
      }
      if (els.lines.length > 0) {
        tl.fromTo(
          els.lines,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.95, stagger: 0.12, ease: "power3.inOut" },
          "-=0.45",
        );
      }
      if (els.desc) {
        tl.fromTo(
          els.desc,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1 },
          "-=0.55",
        );
      }
      if (els.buttons.length > 0) {
        tl.fromTo(
          els.buttons,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
          "-=0.65",
        );
      }
      if (els.stats) {
        tl.fromTo(
          els.stats,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5",
        );
      }
      if (els.terminal) {
        tl.fromTo(
          els.terminal,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1 },
          "-=0.55",
        );
      }
      tl.eventCallback("onComplete", markIntroComplete);
    };

    const showImmediately = () => {
      gsap.set(
        [
          els.badge,
          els.whoami,
          els.desc,
          els.stats,
          els.terminal,
          ...els.lines,
          ...els.buttons,
        ].filter((el): el is HTMLElement => el !== null),
        { opacity: 1, y: 0, yPercent: 0, clearProps: "all" },
      );
      window.dispatchEvent(new CustomEvent(REVEAL_EVENT));
      markIntroComplete();
    };

    let revealed = false;
    let fallbackTimer = 0;

    const handleVideoEnd = () => {
      if (revealed) return;
      revealed = true;
      window.clearTimeout(fallbackTimer);
      captureFrame();
      // The canvas now holds the exact final frame; hide the video so it
      // can never flash a different frame or snap back to the first frame.
      video.style.visibility = "hidden";
      swapToLoopVideo();
      buildReveal();
      window.dispatchEvent(new CustomEvent(REVEAL_EVENT));
    };

    gsap.set(els.badge, { opacity: 0, y: -12 });
    gsap.set(els.whoami, { opacity: 0, y: 26 });
    gsap.set(els.lines, { yPercent: 110 });
    gsap.set(els.desc, { opacity: 0, y: 40 });
    gsap.set(els.buttons, { opacity: 0, y: 25 });
    gsap.set(els.stats, { opacity: 0, y: 30 });
    gsap.set(els.terminal, { opacity: 0, y: 50 });

    video.addEventListener("ended", handleVideoEnd);
    const captureWhilePlaying = () => {
      if (!revealed) captureFrame();
    };
    video.addEventListener("loadeddata", captureWhilePlaying);

    video.muted = true;
    const play = video.play();
    if (play && typeof play.catch === "function") {
      play.catch(() => {
        captureFrame();
        showImmediately();
      });
    }

    if (reduceMotion) {
      video.pause();
      captureFrame();
      showImmediately();
      revealed = true;
    } else {
      fallbackTimer = window.setTimeout(() => {
        captureFrame();
        handleVideoEnd();
      }, MAX_INTRO_MS);
    }

    return () => {
      window.clearTimeout(fallbackTimer);
      video.removeEventListener("ended", handleVideoEnd);
      video.removeEventListener("loadeddata", captureWhilePlaying);
      if (timeline) timeline.kill();
    };
  }, []);

  // Marker element only; the effect locates its <section> ancestor.
  return <span ref={rootRef} className="hidden" aria-hidden data-hero-effects />;
}
