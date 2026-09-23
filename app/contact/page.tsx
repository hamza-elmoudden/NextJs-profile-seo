import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import ContactEmailLink from "@/components/contact-email-link";
import ShinyText from "@/components/shiny-text";

export const metadata: Metadata = {
  title: "Contact — Hamza Elmouddane",
  description:
    "Contact Hamza Elmouddane about backend systems, scalable web applications, AI pipelines, and digital product development.",
};

const WHAT_TO_SEND = [
  "Project or product overview",
  "Technical challenge or goal",
  "Expected timeline and scope",
];

const DETAILS_STRIP = [
  { value: "24–48h", label: "typical response time" },
  { value: "Remote-first", label: "collaboration style" },
  { value: "Backend-shaped", label: "systems, APIs, AI, infrastructure" },
];

export default function Contact() {
  return (
    <>
      {/* ── PAGE HERO ─────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-edge py-[64px] min-[860px]:py-[80px]">
        <div className="bg-grid-faint pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative">
          <p className="hero-reveal mb-[18px] font-mono text-[13px] text-terminal">
            <span className="text-amber">~/hamza $</span> ./contact --open-channel
          </p>
          <h1 className="hero-reveal reveal-d1 mb-[20px] font-display text-[clamp(38px,5vw,64px)] font-bold leading-[1.06] tracking-[-0.015em]">
            LET&apos;S BUILD <ShinyText text="SOMETHING." color="#FF6B00" speed={2} />
          </h1>
          <p className="hero-reveal reveal-d2 mb-[32px] max-w-[620px] text-[17px] leading-[1.7] text-muted">
            Have a backend system, AI pipeline, SaaS product, or technical problem that needs
            a{" "}
            <strong className="font-semibold text-cream">clean, scalable solution</strong>?
            Send the details — I&apos;ll get back to you.
          </p>
          <div className="hero-reveal reveal-d3 flex flex-wrap items-center gap-4 font-mono text-xs text-muted">
            <span className="inline-flex items-center gap-2 text-terminal">
              ● available for select projects
            </span>
            <span className="hidden h-4 w-px bg-edge sm:inline" aria-hidden />
            <span>Backend · APIs · AI · Real-time Systems</span>
            <span className="hidden h-4 w-px bg-edge md:inline" aria-hidden />
            <span>Response within 24–48h</span>
          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ───────────────────────── */}
      <section className="relative py-[72px] min-[860px]:py-[104px]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(circle at 85% 15%, rgba(255,107,0,0.08), transparent 28%)" }}
          aria-hidden
        />
        <div className="container-x relative">
          <p className="section-label hero-reveal">init contact.form</p>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.18fr)]">
            {/* Contact information */}
            <aside className="grid grid-cols-1 gap-4 max-[1023px]:grid-cols-2 max-[639px]:grid-cols-1" aria-label="Contact information">
              <div className="hero-reveal reveal-d1 card group relative overflow-hidden p-4 transition-colors duration-150 hover:border-amber max-[1023px]:col-span-2 lg:col-span-1">
                <p className="mb-[10px] inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-terminal">
                  <span className="text-amber">&gt;</span> direct channel
                </p>
                <h2 className="mb-2 font-display text-[21px] font-bold leading-[1.25]">
                  Start the conversation.
                </h2>
                <p className="text-sm leading-[1.65] text-muted">
                  The more context you share — goals, timeline, stack, and constraints — the
                  faster I can understand whether I&apos;m the right fit.
                </p>
                <ContactEmailLink />
                <div className="mt-[18px] flex items-center gap-2.5 border-t border-edge pt-[18px] font-mono text-xs text-muted">
                  <span
                    className="h-2 w-2 rounded-full bg-terminal shadow-[0_0_10px_var(--color-terminal)]"
                    aria-hidden
                  />
                  currently accepting new inquiries
                </div>
                <span
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-amber to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  aria-hidden
                />
              </div>

              <div className="hero-reveal reveal-d2 card group relative overflow-hidden p-4 transition-colors duration-150 hover:border-amber">
                <p className="mb-[10px] inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-terminal">
                  <span className="text-amber">&gt;</span> good fit
                </p>
                <h3 className="mb-2 font-display text-[21px] font-bold leading-[1.25]">
                  What to send
                </h3>
                <ul className="mt-[18px] flex flex-col gap-2.5">
                  {WHAT_TO_SEND.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                      <span className="mt-0.5 font-mono text-[13px] text-terminal">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <span
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-amber to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  aria-hidden
                />
              </div>

              <div className="hero-reveal reveal-d3 card group relative overflow-hidden p-4 transition-colors duration-150 hover:border-amber">
                <p className="mb-[10px] inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-terminal">
                  <span className="text-amber">&gt;</span> location
                </p>
                <h3 className="mb-2 font-display text-[21px] font-bold leading-[1.25]">
                  Morocco / Remote
                </h3>
                <p className="text-sm leading-[1.65] text-muted">
                  Comfortable working across distributed teams, async workflows, and
                  international time zones.
                </p>
                <span
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-amber to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  aria-hidden
                />
              </div>
            </aside>

            {/* Contact form */}
            <div className="hero-reveal reveal-d2 card overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
              <div className="flex h-[42px] items-center gap-2 border-b border-edge bg-base px-[18px]" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-danger" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-gold" />
                <span className="h-2.5 w-2.5 rounded-full bg-terminal" />
                <span className="ml-2 font-mono text-[11px] text-muted">
                  contact.sh — interactive
                </span>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── DETAILS STRIP ─────────────────────────── */}
      <section className="border-t border-edge bg-base py-10" aria-label="Contact details">
        <div className="container-x grid grid-cols-1 gap-[18px] md:grid-cols-3">
          {DETAILS_STRIP.map((detail) => (
            <div
              key={detail.label}
              className="rounded-md border border-edge bg-[rgba(30,40,48,0.55)] p-5"
            >
              <div className="mb-1 font-display text-[20px] font-bold text-cream">
                {detail.value}
              </div>
              <div className="font-mono text-[11px] text-muted">{detail.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}