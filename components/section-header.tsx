import Reveal from "@/components/reveal";

export default function SectionHeader({ label, title, sub }: { label: string; title: string; sub: string }) {
  return (
    <>
      <Reveal>
        <p className="section-label">{label}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="section-heading">{title}</h2>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="section-sub">{sub}</p>
      </Reveal>
    </>
  );
}
