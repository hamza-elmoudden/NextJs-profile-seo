import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const components = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-4 mt-10 font-display text-[clamp(22px,2.4vw,28px)] font-bold leading-snug text-cream">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-3 mt-8 font-display text-xl font-semibold leading-snug text-cream">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="mb-2.5 mt-6 font-display text-lg font-semibold text-cream">{children}</h4>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-5 text-[16px] leading-[1.8] text-muted">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-7 border-l-2 border-amber bg-amber-tint px-5 py-4 font-mono text-sm leading-[1.8] text-cream">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-cream">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="rounded-[4px] border border-edge bg-card px-1.5 py-0.5 font-mono text-[0.85em] text-terminal">
        {children}
      </code>
    ),
    link: ({
      value,
      children,
    }: {
      value?: { href?: string; blank?: boolean };
      children?: React.ReactNode;
    }) => (
      <a
        href={value?.href ?? "#"}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-amber underline decoration-[rgba(255,107,0,0.4)] underline-offset-4 transition-colors hover:text-amber-gold"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-5 list-disc space-y-2 pl-6 text-[16px] leading-[1.8] text-muted marker:text-amber">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-5 list-decimal space-y-2 pl-6 text-[16px] leading-[1.8] text-muted marker:text-amber">
        {children}
      </ol>
    ),
  },
  types: {
    code: ({ value }: { value?: { code?: string; language?: string } }) => (
      <pre className="my-7 overflow-x-auto rounded-md border border-edge bg-card p-5 font-mono text-[13px] leading-[1.8] text-cream">
        <code>{value?.code ?? ""}</code>
      </pre>
    ),
    image: ({ value }: { value?: { asset?: { url?: string }; alt?: string; caption?: string } }) =>
      value?.asset?.url ? (
        <figure className="my-7 overflow-hidden rounded-md border border-edge">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value.asset.url} alt={value.alt ?? ""} className="w-full" />
          {value.caption ? (
            <figcaption className="border-t border-edge bg-card px-4 py-2.5 text-center font-mono text-[11px] text-muted">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null,
  },
};

export default function PortableBody({ body }: { body: unknown }) {
  if (!Array.isArray(body) || body.length === 0) return null;
  return (
    <div className="article-body">
      <PortableText value={body as PortableTextBlock[]} components={components} />
    </div>
  );
}
