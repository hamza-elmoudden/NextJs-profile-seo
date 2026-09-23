"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Terminal from "@/components/terminal";

export type TermToken = {
  text: string;
  cls?: "c" | "k" | "s" | "f" | "n";
};

const TOK_CLASS: Record<"c" | "k" | "s" | "f" | "n", string> = {
  c: "tok-c",
  k: "tok-k",
  s: "tok-s",
  f: "tok-f",
  n: "tok-n",
};

type Phase = "typing" | "holding" | "clearing";

const HOLD_MS = 2600;
const CLEAR_MS = 450;

export const GATEWAY_CONTENT: TermToken[] = [
  { text: "// gateway.ts — the invisible layer\n", cls: "c" },
  { text: "import", cls: "k" },
  { text: " { broker } " },
  { text: "from", cls: "k" },
  { text: " " },
  { text: "'@he/route-broker'", cls: "s" },
  { text: ";\n\n\n" },
  { text: "const", cls: "k" },
  { text: " gw = " },
  { text: "createGateway", cls: "f" },
  { text: "({\n" },
  { text: "    transport: " },
  { text: "'ws'", cls: "s" },
  { text: ",\n" },
  { text: "    queue: " },
  { text: "'redis-pubsub'", cls: "s" },
  { text: ",\n" },
  { text: "    ai: " },
  { text: "'rag-pipeline'", cls: "s" },
  { text: ",\n" },
  { text: "});\n\n\n" },
  { text: "gw." },
  { text: "on", cls: "f" },
  { text: "(" },
  { text: "'request'", cls: "s" },
  { text: ", " },
  { text: "async", cls: "k" },
  { text: " (ctx) => {\n" },
  { text: "    " },
  { text: "const", cls: "k" },
  { text: " intent = " },
  { text: "await", cls: "k" },
  { text: " " },
  { text: "classify", cls: "f" },
  { text: "(ctx.body);\n" },
  { text: "    " },
  { text: "return", cls: "k" },
  { text: " broker." },
  { text: "dispatch", cls: "f" },
  { text: "(intent, {\n" },
  { text: "        timeout: " },
  { text: "30_000", cls: "n" },
  { text: ",\n" },
  { text: "        retries: " },
  { text: "3", cls: "n" },
  { text: ",\n" },
  { text: "    });\n\n\n" },
  { text: "// uptime 214d · p99 12ms · 0 leaks\n", cls: "c" },
];

export default function AnimatedTerminal({
  title = "~/dev",
  badge,
  content = GATEWAY_CONTENT,
}: {
  title?: string;
  badge?: ReactNode;
  content?: TermToken[];
}) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [phase, setPhase] = useState<Phase>("typing");
  const [count, setCount] = useState(0);

  const tokens = useMemo(() => content, [content]);
  const total = useMemo(
    () => tokens.reduce((n, t) => n + t.text.length, 0),
    [tokens],
  );
  const chars = useMemo(() => {
    const out: { ch: string; cls?: TermToken["cls"] }[] = [];
    for (const t of tokens) {
      for (const ch of t.text) out.push({ ch, cls: t.cls });
    }
    return out;
  }, [tokens]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => {
      mq.removeEventListener?.("change", update);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion || phase !== "typing") return;
    if (count >= total) return;
    const nextChar = chars[count]?.ch;
    let delay = 20 + Math.random() * 30;
    if (nextChar === "\n") {
      delay = 180 + Math.random() * 240;
    } else if (Math.random() < 0.07) {
      delay += Math.random() * 150;
    }
    const t = window.setTimeout(() => {
      const step = Math.random() < 0.16 ? 1 + Math.floor(Math.random() * 3) : 1;
      const next = Math.min(count + step, total);
      setCount(next);
      if (next >= total) setPhase("holding");
    }, delay);
    return () => window.clearTimeout(t);
  }, [phase, reduceMotion, chars, count, total]);

  useEffect(() => {
    if (phase !== "holding") return;
    const t = window.setTimeout(() => setPhase("clearing"), HOLD_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "clearing") return;
    const t = window.setTimeout(() => {
      setCount(0);
      setPhase("typing");
    }, CLEAR_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  const renderFull = () =>
    tokens.map((t, i) => (
      <span key={i} className={t.cls ? TOK_CLASS[t.cls] : undefined}>
        {t.text}
      </span>
    ));

  const renderRevealed = () => {
    const spans: ReactNode[] = [];
    for (let i = 0; i < count && i < chars.length; i++) {
      const { ch, cls } = chars[i];
      spans.push(
        <span key={i} className={cls ? TOK_CLASS[cls] : undefined}>
          {ch}
        </span>,
      );
    }
    return spans;
  };

  return (
    <Terminal title={title} badge={badge}>
      <div className="relative">
        <div aria-hidden="true" className="whitespace-pre invisible">
          {renderFull()}
        </div>
        <div
          aria-hidden={!reduceMotion}
          className="whitespace-pre absolute inset-0 overflow-hidden"
        >
          <div
            className={`transition-opacity duration-500 ease-in-out ${
              phase === "clearing" ? "opacity-0" : "opacity-100"
            }`}
          >
            {reduceMotion ? renderFull() : renderRevealed()}
            {reduceMotion ? null : (
              <span aria-hidden="true" className="cursor-blink" />
            )}
          </div>
        </div>
      </div>
    </Terminal>
  );
}