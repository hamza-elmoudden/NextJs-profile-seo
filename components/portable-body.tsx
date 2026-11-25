import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import SanityNextImage from "@/components/sanity-next-image";
import { urlFor } from "@/lib/image";

// Body images arrive unresolved ({ asset: { _ref: "image-<id>-<w>x<h>-<ext>" } }).
// The URL builder resolves refs directly, and the ref encodes the dimensions.
type BodyImage = {
  asset?: { _ref?: string; url?: string };
  alt?: string | null;
  caption?: string | null;
};

function refDimensions(ref: string | undefined): { width: number; height: number } | null {
  const m = ref?.match(/-(\d+)x(\d+)-[a-z0-9]+$/i);
  return m ? { width: Number(m[1]), height: Number(m[2]) } : null;
}

function BodyImageFigure({ value, fallbackAlt }: { value?: BodyImage; fallbackAlt: string }) {
  if (!value?.asset?._ref && !value?.asset?.url) return null;
  const dims = refDimensions(value.asset._ref) ?? { width: 1200, height: 675 };
  const src = urlFor(value as Parameters<typeof urlFor>[0]).auto("format").url();
  const alt = value.alt?.trim() || value.caption?.trim() || fallbackAlt;
  return (
    <figure className="my-7 overflow-hidden rounded-md border border-edge">
      <SanityNextImage
        src={src}
        alt={alt}
        width={dims.width}
        height={dims.height}
        sizes="(min-width: 768px) 720px, 100vw"
        className="h-auto w-full"
      />
      {value.caption ? (
        <figcaption className="border-t border-edge bg-card px-4 py-2.5 text-center font-mono text-[11px] text-muted">
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function CodeBlock({ value }: { value?: { code?: string; language?: string; filename?: string } }) {
  return (
    <figure className="my-7 overflow-hidden rounded-md border border-edge bg-card">
      {value?.filename || value?.language ? (
        <figcaption className="flex justify-between gap-4 border-b border-edge px-5 py-2 font-mono text-[11px] text-muted">
          <span>{value?.filename ?? ""}</span>
          <span className="text-terminal">{value?.language ?? ""}</span>
        </figcaption>
      ) : null}
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.8] text-cream">
        <code>{value?.code ?? ""}</code>
      </pre>
    </figure>
  );
}

const baseComponents = {
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
};

function makeComponents(fallbackAlt: string): PortableTextComponents {
  const image = ({ value }: { value?: BodyImage }) => (
    <BodyImageFigure value={value} fallbackAlt={fallbackAlt} />
  );
  return {
    ...baseComponents,
    // Every custom block type in the Sanity `portableText` schema
    // (codeBlock, inlineImage) plus legacy names, so none hit the
    // "Unknown block type" fallback.
    types: { codeBlock: CodeBlock, code: CodeBlock, inlineImage: image, image },
  };
}

export default function PortableBody({
  body,
  fallbackAlt = "",
}: {
  body: unknown;
  /** Alt text for body images whose alt and caption are both empty (e.g. the post title). */
  fallbackAlt?: string;
}) {
  if (!Array.isArray(body) || body.length === 0) return null;
  return (
    <div className="article-body">
      <PortableText value={body as PortableTextBlock[]} components={makeComponents(fallbackAlt)} />
    </div>
  );
}
