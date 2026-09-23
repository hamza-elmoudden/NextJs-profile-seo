import type { ReactNode } from "react";

export default function Terminal({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-md border border-edge bg-base shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-2 border-b border-edge bg-card px-4 py-3">
          <span className="h-[11px] w-[11px] rounded-full bg-danger" />
          <span className="h-[11px] w-[11px] rounded-full bg-amber-gold" />
          <span className="h-[11px] w-[11px] rounded-full bg-terminal" />
          <span className="ml-2 font-mono text-xs text-muted">{title}</span>
        </div>
        <div className="term-body">{children}</div>
      </div>
      {badge ? (
        <div className="absolute -bottom-[18px] -left-[18px] rounded-md border border-edge bg-card px-4 py-3 font-mono text-xs text-terminal shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
          {badge}
        </div>
      ) : null}
    </div>
  );
}