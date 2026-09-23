export default function SectionHeader({ label, title, sub }: { label: string; title: string; sub: string }) {
  return (
    <>
      <p className="section-label">{label}</p>
      <h2 className="section-heading">{title}</h2>
      <p className="section-sub">{sub}</p>
    </>
  );
}