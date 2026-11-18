import type { Block, Category, Project, Section } from "@/content/schema";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { contextLabel, statusLabel, teamLabel } from "@/lib/content";

/**
 * Research-oriented case study. Progressive disclosure:
 *   1. header + meta (scannable in seconds)
 *   2. overview + up to three takeaways
 *   3. owner-ordered sections; "collapsed" ones render as expandable panels
 */

const takeawayLabel = { contribution: "Key contribution", outcome: "Verified outcome", improvement: "Engineering improvement" } as const;

const isMedia = (b: Block) => b.type === "figure" || b.type === "code";

function SectionBody({ section }: { section: Section }) {
  const blocks = section.blocks;
  if (section.layout === "split" && blocks.some(isMedia) && blocks.some((b) => !isMedia(b))) {
    return (
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="space-y-5">{blocks.filter((b) => !isMedia(b)).map((b, i) => <BlockRenderer key={i} block={b} />)}</div>
        <div className="space-y-5">{blocks.filter(isMedia).map((b, i) => <BlockRenderer key={i} block={b} />)}</div>
      </div>
    );
  }
  if (section.layout === "gallery") {
    const figures = blocks.filter((b) => b.type === "figure");
    const rest = blocks.filter((b) => b.type !== "figure");
    return (
      <div className="space-y-6">
        {rest.map((b, i) => <BlockRenderer key={i} block={b} />)}
        {figures.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">{figures.map((b, i) => <BlockRenderer key={i} block={b} />)}</div>
        )}
      </div>
    );
  }
  return <div className="space-y-5">{blocks.map((b, i) => <BlockRenderer key={i} block={b} />)}</div>;
}

function SectionView({ section, anchor, number }: { section: Section; anchor: string; number: number }) {
  const heading = (
    <span className="flex items-baseline gap-3">
      <span className="font-mono text-xs text-ocean/80">{String(number).padStart(2, "0")}</span>
      <span className="font-display text-xl font-semibold tracking-tight text-fg sm:text-[1.35rem]">{section.title}</span>
    </span>
  );
  if (section.disclosure === "collapsed") {
    return (
      <details id={anchor} className="group scroll-mt-24 rounded-2xl border border-line bg-white/[0.015] open:bg-transparent">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 transition-colors hover:bg-white/[0.03] [&::-webkit-details-marker]:hidden">
          <h3>{heading}</h3>
          <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full border border-line-strong text-muted transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <div className="px-5 pb-6 pt-2">
          <SectionBody section={section} />
        </div>
      </details>
    );
  }
  return (
    <section id={anchor} aria-labelledby={`${anchor}-h`} className="scroll-mt-24">
      <h3 id={`${anchor}-h`} className="mb-5">{heading}</h3>
      <SectionBody section={section} />
    </section>
  );
}

export function ProjectDetail({
  project,
  category,
  position,
  total,
  titleAs: Title = "h2",
}: {
  project: Project;
  category?: Category;
  position: number;
  total: number;
  titleAs?: "h1" | "h2";
}) {
  const sections = project.sections.filter((s) => !s.hidden);
  const anchor = (s: Section) => `${project.slug}--${s.id}`;
  const meta = [
    { label: "Domain", value: project.meta.domain },
    { label: "Category", value: category?.label ?? project.categoryId },
    { label: "Duration", value: project.meta.duration },
    { label: "Status", value: statusLabel[project.meta.status] },
    { label: "Context", value: contextLabel[project.meta.context] },
    { label: "Team", value: teamLabel(project.meta.team) },
  ];

  return (
    <article aria-labelledby={`${project.slug}-title`}>
      {/* 1 · Header */}
      <header className="border-b border-line pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <p className="eyebrow">
            Case study · {String(position + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
          {project.isPlaceholder && <span className="placeholder-tag">Placeholder content</span>}
        </div>
        <Title id={`${project.slug}-title`} className="mt-4 max-w-4xl font-display text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-4xl">
          {project.title}
        </Title>
        <p className="mt-3 max-w-3xl text-lg text-muted">{project.subtitle}</p>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
          {meta.map((m) => (
            <div key={m.label} className="border-l border-line pl-3">
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">{m.label}</dt>
              <dd className="mt-1 text-sm text-fg/90">{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* 2 · Overview + takeaways */}
      <div className="grid gap-8 py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">Overview</h3>
          <p className="mt-3 text-[1.1rem] leading-relaxed text-fg/90">{project.overview}</p>
        </div>
        {project.takeaways && project.takeaways.length > 0 && (
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">Key takeaways</h3>
            <ol className="mt-3 space-y-3">
              {project.takeaways.slice(0, 3).map((t, i) => (
                <li key={i} className="panel flex gap-4 p-4">
                  <span className="font-display text-2xl font-semibold leading-none text-ocean/80">{i + 1}</span>
                  <div>
                    <p className={`font-mono text-[10.5px] uppercase tracking-[0.14em] ${t.kind === "contribution" ? "text-jade" : "text-ocean"}`}>{takeawayLabel[t.kind]}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-fg/90">{t.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* 3 · Sections */}
      {sections.length > 0 && (
        <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
          <nav aria-label="Case study sections" className="hidden lg:block">
            <ol className="sticky top-24 space-y-1 border-l border-line">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${anchor(s)}`} className="-ml-px flex gap-2.5 border-l border-transparent py-1.5 pl-4 text-[13px] text-subtle transition-colors hover:border-ocean hover:text-fg">
                    <span className="font-mono text-[11px] text-ocean/60">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="min-w-0 space-y-14">
            {sections.map((s, i) => (
              <SectionView key={s.id} section={s} anchor={anchor(s)} number={i + 1} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
