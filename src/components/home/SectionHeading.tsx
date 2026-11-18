export function SectionHeading({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 id={id} className="font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{title}</h2>
      {children}
    </div>
  );
}
