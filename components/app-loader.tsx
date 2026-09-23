"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "アイウエオカキクケコサシスセソ0123456789";

const STEPS = [
  { pct: 0, label: "initialising…", status: "compiling…", line: -1, done: false },
  { pct: 15, label: "importing modules…", status: "compiling…", line: 0, done: false },
  { pct: 35, label: "initialising app…", status: "compiling…", line: 1, done: false },
  { pct: 55, label: "loading assets…", status: "bundling…", line: 2, done: false },
  { pct: 78, label: "preloading routes…", status: "linking…", line: 3, done: false },
  { pct: 100, label: "ready!", status: "done ✓", line: 4, done: true },
];

const LINES = [
  () => (
    <>
      <span className="text-amber-gold">import</span> Portfolio{" "}
      <span className="text-amber-gold">from</span>{" "}
      <span className="text-screen">&apos;./hamza.dev&apos;</span>
    </>
  ),
  () => (
    <>
      <span className="text-amber-gold">const</span> app ={" "}
      <span className="text-cream">Portfolio</span>.<span className="text-cream">init</span>
      {"("}
      {"{"} ssr: <span className="text-amber-gold">true</span> {"}"}
      {")"}
    </>
  ),
  () => <span className="text-term-dim">{"// loading assets & routes…"}</span>,
  () => (
    <>
      <span className="text-amber-gold">await</span> app.<span className="text-cream">preload</span>
      {"(["}
      <span className="text-screen">&apos;home&apos;</span>,{" "}
      <span className="text-screen">&apos;about&apos;</span>,{" "}
      <span className="text-screen">&apos;projects&apos;</span>
      {"])"}
    </>
  ),
  () => (
    <>
      <span className="text-terminal">✓</span>{" "}
      <span className="text-terminal">build complete — serving on :3000</span>
    </>
  ),
];

const MINI_COLUMNS = [
  { left: 4, dur: 1.1, delay: 0 },
  { left: 14, dur: 1.4, delay: 0.3 },
  { left: 24, dur: 0.9, delay: 0.15 },
  { left: 34, dur: 1.2, delay: 0.5 },
];

const WAVES = [
  { h: 8, d: 0, c: "bg-screen" },
  { h: 18, d: 0.1, c: "bg-screen" },
  { h: 32, d: 0.2, c: "bg-amber" },
  { h: 20, d: 0.3, c: "bg-screen" },
  { h: 10, d: 0.4, c: "bg-screen" },
  { h: 24, d: 0.5, c: "bg-amber-gold" },
  { h: 12, d: 0.6, c: "bg-screen" },
];

export default function AppLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timer: number;
    const run = (i: number) => {
      setStep(i);
      if (i < STEPS.length - 1) {
        timer = window.setTimeout(() => run(i + 1), 600);
      }
    };
    timer = window.setTimeout(() => run(0), 400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FONT_SIZE = 14;
    let cols = 0;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(window.innerWidth / FONT_SIZE);
      drops = Array.from({ length: cols }, () => Math.random() * -50);
    };

    const draw = () => {
      ctx.fillStyle = "rgba(13, 16, 18, 0.055)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;

      for (let i = 0; i < cols; i++) {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        if (Math.random() > 0.92) {
          ctx.fillStyle = "#ffffff";
        } else if (i % 7 === 0) {
          ctx.fillStyle = `rgba(255, 107, 0, ${(Math.random() * 0.6 + 0.4) * 0.7})`;
        } else {
          ctx.fillStyle = `rgba(0, 255, 65, ${Math.random() * 0.6 + 0.4})`;
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    const id = window.setInterval(draw, 40);

    return () => {
      window.removeEventListener("resize", resize);
      window.clearInterval(id);
    };
  }, []);

  const s = STEPS[step] ?? STEPS[STEPS.length - 1];

  return (
    <div className="flex min-h-full flex-col items-center justify-center overflow-hidden bg-ink">
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 opacity-[0.18]" />
      <div
        className="pointer-events-none fixed left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,107,0,0.07)_0%,transparent_70%)]"
        style={{ animation: "glow-pulse 3s ease-in-out infinite" }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center gap-12 py-12">
        <div
          className="grid h-14 w-14 place-items-center rounded-[10px] border-[1.5px] border-amber bg-[rgba(255,107,0,0.08)] font-display text-xl font-bold text-amber shadow-[0_0_24px_rgba(255,107,0,0.15)]"
          style={{ animation: "logo-pop 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          HE
        </div>

        <div
          className="w-[480px] max-w-[calc(100vw-48px)] overflow-hidden rounded-[10px] border border-edge bg-base shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
          style={{ animation: "slide-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both" }}
        >
          <div className="flex items-center gap-2 border-b border-edge bg-card px-[18px] py-3">
            <span className="h-[11px] w-[11px] rounded-full bg-danger" />
            <span className="h-[11px] w-[11px] rounded-full bg-amber-gold" />
            <span className="h-[11px] w-[11px] rounded-full bg-terminal" />
            <span className="ml-2.5 text-xs tracking-[0.02em] text-muted">
              hamza@prod: ~/portfolio
            </span>
            <span
              className={`ml-auto text-[11px] transition-colors duration-300 ${
                s.done ? "text-terminal" : "text-amber"
              }`}
            >
              {s.status}
            </span>
          </div>

          <div className="min-h-[172px] px-[22px] py-5 font-mono text-[12.5px] leading-[1.9]">
            {LINES.map((line, i) => (
              <div
                key={i}
                className={`flex items-center gap-2.5 transition-opacity duration-300 ${
                  i <= s.line ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="min-w-[18px] select-none text-right text-edge">{i + 1}</span>
                <span>{line()}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-edge px-[18px] py-[14px]">
            <div className="flex items-center justify-between text-[11px] text-muted">
              <span>{s.label}</span>
              <span className="font-medium text-amber">{s.pct}%</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-surface">
              <div
                className="relative h-full rounded-full bg-gradient-to-r from-amber to-amber-gold transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ width: `${s.pct}%` }}
              >
                <span className="absolute inset-x-0 top-0 h-1/2 rounded-full bg-white/10" />
                <span className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-amber-gold shadow-[0_0_8px_var(--color-amber-gold)]" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-7"
          style={{ animation: "slide-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.25s both" }}
        >
          <div className="flex flex-col items-center gap-2.5">
            <div className="relative h-11 w-11">
              <span
                className="absolute inset-0 rounded-full border-[1.5px] border-transparent border-t-amber"
                style={{ animation: "spin 1.4s linear infinite" }}
              />
              <span
                className="absolute inset-[6px] rounded-full border-[1.5px] border-transparent border-r-amber-gold"
                style={{ animation: "spin 0.9s linear infinite reverse" }}
              />
              <span
                className="absolute inset-[12px] rounded-full border-[1.5px] border-transparent border-b-screen"
                style={{ animation: "spin 1.8s linear infinite" }}
              />
              <span className="absolute inset-0 grid place-items-center">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-amber shadow-[0_0_8px_var(--color-amber)]"
                  style={{ animation: "core-pulse 1.4s ease-in-out infinite" }}
                />
              </span>
            </div>
            <span className="text-[10px] text-muted">orbit</span>
          </div>

          <span className="h-11 w-px flex-shrink-0 bg-edge" aria-hidden />

          <div className="flex flex-col items-center gap-2.5">
            <div className="relative h-11 w-11 overflow-hidden rounded-md border border-edge bg-card">
              {MINI_COLUMNS.map((col, ci) => (
                <div
                  key={ci}
                  className="absolute flex flex-col"
                  style={{
                    left: col.left,
                    animation: `matrix-fall ${col.dur}s linear infinite`,
                    animationDelay: `${col.delay}s`,
                  }}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <span
                      key={i}
                      className={`block text-[9px] leading-[1.5] ${
                        i === 0
                          ? "text-cream [text-shadow:0_0_4px_var(--color-terminal)]"
                          : "text-terminal"
                      }`}
                    >
                      {GLYPHS[(i + ci) % GLYPHS.length]}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <span className="text-[10px] text-muted">pixels</span>
          </div>

          <span className="h-11 w-px flex-shrink-0 bg-edge" aria-hidden />

          <div className="flex flex-col items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center gap-[3px]">
              {WAVES.map((w, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-[2px] ${w.c}`}
                  style={{
                    height: w.h,
                    animation: "wave-bounce 1s ease-in-out infinite",
                    animationDelay: `${w.d}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted">signal</span>
          </div>
        </div>

        <div
          className="flex items-center gap-2 text-xs text-muted"
          style={{ animation: "slide-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.35s both" }}
        >
          <span
            className="h-[6px] w-[6px] rounded-full bg-terminal shadow-[0_0_6px_var(--color-terminal)]"
            style={{ animation: "core-pulse 1s ease-in-out infinite" }}
          />
          {s.done ? (
            <span className="text-cream">
              hamza.dev ready <span className="text-terminal">●</span>
            </span>
          ) : (
            <span className="text-cream">
              <span className="text-amber">hamza.dev</span> is loading
              <span className="cursor-blink" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}