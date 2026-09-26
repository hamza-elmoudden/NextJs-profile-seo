"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import PortableBody from "@/components/portable-body";
import TerminalInput from "@/components/global-terminal/terminal-input";
import { getAboutPage } from "@/lib/about-page";
import type { Service, ServiceFull } from "@/lib/services";
import { getServiceBySlug, getServices } from "@/lib/services";
import type { Skill } from "@/lib/skills";
import { getSkills } from "@/lib/skills";
import type { SiteSettings } from "@/lib/site-settings";

export type TermTone = "muted" | "cream" | "accent" | "green" | "dim";

export type TermLine =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string; tone?: TermTone }
  | { kind: "error"; text: string }
  | { kind: "body"; node: React.ReactNode };

type View = { id: string; lines: TermLine[] };

const HELP_LINES: TermLine[] = [
  { kind: "out", text: "Available commands:", tone: "cream" },
  { kind: "out", text: "" },
  { kind: "out", text: "  about        About me", tone: "muted" },
  { kind: "out", text: "  services     List my services", tone: "muted" },
  { kind: "out", text: "  skills       List my technical skills", tone: "muted" },
  { kind: "out", text: "  contact      Contact information", tone: "muted" },
  { kind: "out", text: "  clear        Clear terminal", tone: "muted" },
  { kind: "out", text: "  close        Close terminal", tone: "muted" },
];

const RULE = "─".repeat(28);

const TONE_CLASS: Record<TermTone, string> = {
  muted: "text-muted",
  cream: "text-cream",
  accent: "text-amber-gold",
  green: "text-terminal",
  dim: "text-term-dim",
};

const servicesCache = { current: null as Service[] | null };
const skillsCache = { current: null as Skill[] | null };

export default function GlobalTerminal({ settings }: { settings: SiteSettings | null }) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<TermLine[]>([
    { kind: "out", text: "Hamza Elmouddane — portfolio shell", tone: "dim" },
    { kind: "out", text: 'Type "help" to see available commands.', tone: "dim" },
    { kind: "out", text: "" },
    ...HELP_LINES,
  ]);
  const [viewStack, setViewStack] = useState<View[]>([{ id: "home", lines: HELP_LINES }]);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const pushView = useCallback((id: string, viewLines: TermLine[]) => {
    setLines((prev) => [...prev, { kind: "out", text: "" }, ...viewLines]);
    setViewStack((prev) => [...prev, { id, lines: viewLines }]);
  }, []);

  const append = useCallback((block: TermLine[]) => {
    setLines((prev) => [...prev, { kind: "out", text: "" }, ...block]);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const runCommand = useCallback(
    async (raw: string) => {
      const [command, ...args] = raw.split(/\s+/);
      const arg = args.join(" ");
      setLines((prev) => [...prev, { kind: "cmd", text: raw }]);

      const currentView = viewStack[viewStack.length - 1];
      const inService = currentView.id.startsWith("service:");
      const serviceSlug = inService ? currentView.id.slice("service:".length) : null;

      switch (command) {
        case "help":
          setViewStack([{ id: "home", lines: HELP_LINES }]);
          append(HELP_LINES);
          return;

        case "clear":
          setLines([]);
          return;

        case "close":
        case "exit":
          close();
          return;

        case "back":
          if (viewStack.length > 1) {
            const next = viewStack.slice(0, -1);
            setViewStack(next);
            append(next[next.length - 1].lines);
          } else {
            append([{ kind: "out", text: "Already at the top level.", tone: "dim" }]);
          }
          return;

        case "description":
          if (serviceSlug) {
            const service = await getServiceBySlug(serviceSlug);
            if (service?.description?.length) {
              append([
                { kind: "out", text: service.title, tone: "cream" },
                { kind: "out", text: RULE, tone: "dim" },
                { kind: "out", text: "" },
                { kind: "body", node: <PortableBody body={service.description} /> },
              ]);
            } else {
              append([{ kind: "out", text: "No detailed description for this service.", tone: "dim" }]);
            }
          } else {
            append([{ kind: "error", text: 'No service selected. Type "services" first.' }]);
          }
          return;

        case "open":
          if (serviceSlug) {
            close();
            router.push(`/services/${serviceSlug}`);
          } else {
            append([{ kind: "error", text: 'No service selected. Type "services" first.' }]);
          }
          return;
      }

      if (inService && !["help", "clear", "close", "exit", "back", "description", "open"].includes(command)) {
        append([
          { kind: "error", text: `Command not found: ${command}` },
          { kind: "out", text: 'Type "back" to return, "description" for details, or "open" to view the page.', tone: "dim" },
        ]);
        return;
      }

      switch (command) {
        case "about": {
          const about = await getAboutPage();
          if (!about) {
            append([{ kind: "error", text: "About content is unavailable right now." }]);
            return;
          }
          pushView("about", [
            { kind: "out", text: about.title || "About Me", tone: "cream" },
            { kind: "out", text: RULE, tone: "dim" },
            { kind: "out", text: "" },
            ...(about.introduction
              ? about.introduction.split("\n").map((p) => ({ kind: "out", text: p, tone: "muted" }) as TermLine)
              : []),
            ...(about.location
              ? [
                  { kind: "out", text: "" } as TermLine,
                  { kind: "out", text: `Location: ${about.location}`, tone: "green" } as TermLine,
                ]
              : []),
          ]);
          return;
        }

        case "services": {
          servicesCache.current ??= await getServices();
          const services = servicesCache.current;
          if (!services.length) {
            append([{ kind: "error", text: "No services found." }]);
            return;
          }
          pushView("services", [
            { kind: "out", text: "Available services:", tone: "cream" },
            { kind: "out", text: "" },
            ...services.flatMap((service, index): TermLine[] => [
              { kind: "out", text: `[${index + 1}] ${service.title}`, tone: "cream" },
              { kind: "out", text: `    ${service.shortDescription}`, tone: "muted" },
              { kind: "out", text: "" },
            ]),
            { kind: "out", text: "Type:", tone: "dim" },
            { kind: "out", text: "  service <slug>      e.g. service " + services[0].slug, tone: "dim" },
            { kind: "out", text: "  service <number>    e.g. service 1", tone: "dim" },
          ]);
          return;
        }

        case "service": {
          if (!arg) {
            append([{ kind: "error", text: "Usage: service <slug|number>" }]);
            return;
          }
          servicesCache.current ??= await getServices();
          const services = servicesCache.current;
          const byIndex = /^\d+$/.test(arg) ? services[Number(arg) - 1] : undefined;
          const match = byIndex ?? services.find((s) => s.slug === arg);
          if (!match) {
            append([
              { kind: "error", text: `Service not found: ${arg}` },
              { kind: "out", text: 'Type "services" to list available services.', tone: "dim" },
            ]);
            return;
          }
          const service: ServiceFull | null = await getServiceBySlug(match.slug);
          pushView(`service:${match.slug}`, [
            { kind: "out", text: service?.title ?? match.title, tone: "cream" },
            { kind: "out", text: RULE, tone: "dim" },
            { kind: "out", text: "" },
            { kind: "out", text: service?.shortDescription ?? match.shortDescription, tone: "muted" },
            { kind: "out", text: "" },
            { kind: "out", text: "Type:", tone: "dim" },
            { kind: "out", text: "  description    full description", tone: "dim" },
            { kind: "out", text: "  open           view service page", tone: "dim" },
            { kind: "out", text: "  back           go back", tone: "dim" },
          ]);
          return;
        }

        case "skills": {
          skillsCache.current ??= await getSkills();
          const skills = skillsCache.current;
          if (!skills.length) {
            append([{ kind: "error", text: "No skills found." }]);
            return;
          }
          const byCategory = new Map<string, Skill[]>();
          for (const skill of skills) {
            const category = skill.category ?? "Other";
            byCategory.set(category, [...(byCategory.get(category) ?? []), skill]);
          }
          pushView("skills", [
            { kind: "out", text: "Technical Skills", tone: "cream" },
            { kind: "out", text: RULE, tone: "dim" },
            { kind: "out", text: "" },
            ...[...byCategory.entries()].flatMap(([category, items]): TermLine[] => [
              { kind: "out", text: category, tone: "accent" },
              ...items.map((skill) => ({ kind: "out", text: `  - ${skill.name}`, tone: "muted" }) as TermLine),
              { kind: "out", text: "" },
            ]),
          ]);
          return;
        }

        case "contact": {
          const email = settings?.email;
          const socials = settings?.socialLinks ?? [];
          if (!email && !socials.length && !settings?.location) {
            append([{ kind: "error", text: "Contact information is unavailable right now." }]);
            return;
          }
          pushView("contact", [
            { kind: "out", text: "Contact", tone: "cream" },
            { kind: "out", text: RULE, tone: "dim" },
            { kind: "out", text: "" },
            ...(email
              ? [
                  { kind: "out", text: "Email:", tone: "accent" } as TermLine,
                  { kind: "out", text: `  ${email}`, tone: "muted" } as TermLine,
                ]
              : []),
            ...(settings?.location
              ? [
                  { kind: "out", text: "" } as TermLine,
                  { kind: "out", text: "Location:", tone: "accent" } as TermLine,
                  { kind: "out", text: `  ${settings.location}`, tone: "muted" } as TermLine,
                ]
              : []),
            ...socials.flatMap((link): TermLine[] => [
              { kind: "out", text: "" },
              { kind: "out", text: `${link.label ?? link.platform}:`, tone: "accent" },
              { kind: "out", text: `  ${link.url}`, tone: "green" },
            ]),
          ]);
          return;
        }

        default:
          append([
            { kind: "error", text: `Command not found: ${command}` },
            { kind: "out", text: 'Type "help" to see available commands.', tone: "dim" },
          ]);
      }
    },
    [append, close, pushView, router, settings, viewStack],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close terminal" : "Open terminal"}
        title={open ? "Close terminal" : "Terminal"}
        aria-expanded={open}
        className="group fixed top-1/2 left-0 z-50 -translate-y-1/2 rounded-r-md border border-l-0 border-edge bg-card py-3 pr-3.5 pl-2.5 font-mono text-sm font-bold text-terminal shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-colors duration-150 hover:border-amber hover:bg-amber-tint hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
      >
        <span aria-hidden="true">&gt;_</span>
        <span className="pointer-events-none absolute top-1/2 left-full ml-2 -translate-y-1/2 rounded-[4px] border border-edge bg-ink px-2 py-1 font-mono text-[11px] whitespace-nowrap text-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          terminal
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="terminal-window"
            role="dialog"
            aria-label="Terminal"
            initial={{ x: reduceMotion ? 0 : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: reduceMotion ? 0 : "-100%" }}
            transition={{ type: "tween", duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 left-0 z-50 flex w-full flex-col border-r border-edge bg-ink shadow-[24px_0_60px_rgba(0,0,0,0.5)] sm:w-[min(560px,92vw)]"
          >
            <div className="flex items-center gap-2 border-b border-edge bg-card px-4 py-3">
              <span className="h-[11px] w-[11px] rounded-full bg-danger" />
              <span className="h-[11px] w-[11px] rounded-full bg-amber-gold" />
              <span className="h-[11px] w-[11px] rounded-full bg-terminal" />
              <span className="ml-2 font-mono text-xs text-muted">terminal</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close terminal"
                className="ml-auto rounded-[4px] border border-edge px-2 py-0.5 font-mono text-[11px] text-muted transition-colors hover:border-amber hover:text-cream focus-visible:outline-2 focus-visible:outline-amber"
              >
                esc
              </button>
            </div>

            <div ref={scrollRef} className="term-body min-h-0 flex-1 overflow-y-auto">
              {lines.map((line, index) =>
                line.kind === "body" ? (
                  <div key={index} className="text-muted [&_p]:mb-2 [&_p]:text-[13px]">
                    {line.node}
                  </div>
                ) : line.kind === "cmd" ? (
                  <div key={index} className="whitespace-pre-wrap">
                    <span className="text-amber">$ </span>
                    <span className="text-cream">{line.text}</span>
                  </div>
                ) : (
                  <div key={index} className={`whitespace-pre-wrap ${line.kind === "error" ? "text-danger" : TONE_CLASS[line.tone ?? "muted"]}`}>
                    {line.text}
                  </div>
                ),
              )}
            </div>

            <TerminalInput
              ref={inputRef}
              onSubmit={(value) => void runCommand(value)}
              onEscape={close}
              onRecord={(command) => setHistory((prev) => [...prev, command])}
              history={history}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
