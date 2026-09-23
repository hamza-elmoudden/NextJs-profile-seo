import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import AnimatedTerminal, {
  GATEWAY_CONTENT,
} from "@/components/animated-terminal";
import HeroEffects from "@/components/hero-effects";
import { getSiteSettings } from "@/lib/site-settings";
import ShinyText from "@/components/shiny-text";

const VIDEO_SRC = "/video/kling_20260912_VIDEO_Cinematic__5034_0.mp4";
const LOOP_VIDEO_SRC = "/video/end.mp4";
const FALLBACK_GITHUB_URL = "https://github.com/hamza-elmoudden";

export default async function Hero() {
  let githubUrl = FALLBACK_GITHUB_URL;
  try {
    const settings = await getSiteSettings();
    const github = settings?.socialLinks?.find(
      (link) => link.platform.toLowerCase() === "github"
    );
    if (github?.url) githubUrl = github.url;
  } catch {
    // keep fallback
  }

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh]  flex-col justify-center overflow-hidden py-4 min-[860px]:py-6"
    >
      <HeroEffects />
      <canvas
        data-hero-canvas
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        aria-hidden
      />
      <video
        data-hero-video
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover"
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        aria-hidden
      />
      <video
        data-hero-video-loop
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover opacity-0 transition-opacity duration-700"
        src={LOOP_VIDEO_SRC}
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        tabIndex={-1}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-ink/55"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-b from-ink/70 via-transparent to-ink/80"
        aria-hidden
      />
      <div
        className="bg-grid-faint pointer-events-none absolute inset-0 z-[3]"
        aria-hidden
      />

      <div className="container-x relative z-10 grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <div
            data-hero-badge
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-edge bg-card px-3.5 py-[7px] font-mono text-xs text-screen max-lg:static lg:absolute lg:-top-5 lg:right-0"
          >
            <span className="h-[7px] w-[7px] rounded-full bg-terminal shadow-[0_0_8px_var(--color-terminal)]" />
            available for freelance
          </div>
          <p
            data-hero-whoami
            className="mb-5 font-mono text-[13px] text-terminal"
          >
            <span className="text-amber">~/hamza $</span> whoami --verbose
          </p>
          <h1 className="mb-[22px] font-display text-[clamp(38px,4.6vw,60px)] font-bold leading-[1.08] tracking-tight">
            <span className="block overflow-hidden">
              <span data-hero-line className="block will-change-transform">
                I BUILD{" "}
                <ShinyText text="SYSTEMS." color="#FF6B00" speed={2} />
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="block will-change-transform">
                I SHIP{" "}
                <ShinyText text="BACKENDS." color="#b8a898" speed={2} />
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="block will-change-transform">
                I ENGINEER{" "}
                <ShinyText text="THE INVISIBLE." color="#FF6B00" speed={2} />
              </span>
            </span>
          </h1>
          <p
            data-hero-desc
            className="mb-[34px] max-w-[520px] text-[17px] text-muted"
          >
            <strong className="font-semibold text-cream">
              Backend &amp; AI Engineer
            </strong>{" "}
            — NestJS · FastAPI · Go · TypeScript. Self-taught, Morocco-based,
            production-obsessed. I design the layers nobody sees but everybody
            depends on.
          </p>
          <div className="mb-12 flex flex-wrap gap-4">
            <Link
              data-hero-button
              href="/projects"
              className="btn btn-primary"
            >
              View My Work →
            </Link>
            <a
              data-hero-button
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <FaGithub className="text-lg" /> GitHub →
            </a>
          </div>
          {/* <div
            data-hero-stats
            className="flex max-w-[520px] flex-col overflow-hidden rounded-md border border-edge bg-card min-[560px]:flex-row"
          >
            {[
              { num: "5", sup: "+", label: "years exp" },
              { num: "20", sup: "+", label: "projects shipped" },
              { num: "3", sup: "", label: "open source libs" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex-1 border-b border-edge px-[22px] py-[18px] last:border-b-0 min-[560px]:border-b-0 min-[560px]:border-r min-[560px]:last:border-r-0"
              >
                <div className="font-display text-[26px] font-bold text-amber">
                  {stat.num}
                  {stat.sup ? (
                    <sup className="text-[15px]">{stat.sup}</sup>
                  ) : null}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div> */}
        </div>

        <div data-hero-terminal>
          <AnimatedTerminal
            title="hamza@prod: ~/core/api-gateway"
            badge={
              <>
                <b className="text-amber">status:</b> production · 99.98% uptime
              </>
            }
            content={GATEWAY_CONTENT}
          />
        </div>
      </div>
    </section>
  );
}
