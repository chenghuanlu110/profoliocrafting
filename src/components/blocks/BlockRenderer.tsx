import type { Block, Provenance } from "@/content/schema";
import { Media } from "@/components/media/Media";
import { CodeBlock } from "./CodeBlock";

function Source({ source }: { source?: Provenance }) {
  if (!source) return null;
  return (
    <p className="mt-2 font-mono text-[11px] tracking-wide text-subtle">
      Source: {source.ref}
      {source.note ? ` — ${source.note}` : ""}
    </p>
  );
}

const calloutTone = {
  note: { bar: "bg-ocean/70", label: "Note", text: "text-ocean" },
  result: { bar: "bg-jade", label: "Result", text: "text-jade" },
  limitation: { bar: "bg-[#ffb86b]", label: "Limitation", text: "text-[#ffc98f]" },
} as const;

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return (
        <div>
          <p className="prose-body">{block.text}</p>
          <Source source={block.source} />
        </div>
      );
    case "list": {
      const Tag = block.style === "numbered" ? "ol" : "ul";
      return (
        <div>
          <Tag className={`space-y-2 text-muted ${block.style === "numbered" ? "list-decimal marker:font-mono marker:text-ocean/80" : "list-none"} pl-5`}>
            {block.items.map((it, i) => (
              <li key={i} className={`leading-relaxed ${block.style === "bullet" ? "relative before:absolute before:-left-4 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-ocean/70" : "pl-1"}`}>
                {it}
              </li>
            ))}
          </Tag>
          <Source source={block.source} />
        </div>
      );
    }
    case "figure":
      return (
        <figure>
          <div className="aspect-[16/10] overflow-hidden rounded-xl border border-line">
            <Media media={block.media} variant="figure" />
          </div>
          {block.caption && <figcaption className="mt-2.5 text-[13px] text-subtle">{block.caption}</figcaption>}
          <Source source={block.source} />
        </figure>
      );
    case "code":
      return <CodeBlock code={block.code} language={block.language} caption={block.caption} />;
    case "keyValue":
      return (
        <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line">
          {block.items.map((it) => (
            <div key={it.label} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] gap-4 px-4 py-3 text-sm">
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">{it.label}</dt>
              <dd className="text-fg/90">{it.value}</dd>
            </div>
          ))}
        </dl>
      );
    case "tags":
      return (
        <div className="grid gap-5 sm:grid-cols-3">
          {block.groups.map((g) => (
            <div key={g.label}>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{g.label}</h4>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {g.tags.map((t) => (
                  <li key={t} className="rounded-md border border-line-strong bg-white/[0.02] px-2.5 py-1 font-mono text-xs text-fg/85">{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    case "callout": {
      const tone = calloutTone[block.tone];
      return (
        <aside className="relative overflow-hidden rounded-xl border border-line bg-white/[0.02] p-5 pl-6">
          <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${tone.bar}`} />
          <p className={`font-mono text-[11px] uppercase tracking-[0.14em] ${tone.text}`}>{block.title ?? tone.label}</p>
          <p className="prose-body mt-2">{block.text}</p>
          <Source source={block.source} />
        </aside>
      );
    }
    case "contributions":
      return (
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border border-jade/25 bg-jade/[0.03] p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-jade">My work</p>
            <ul className="mt-3 space-y-2.5">
              {block.mine.map((m, i) => (
                <li key={i} className="flex gap-3 text-fg/90">
                  <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-jade" />
                  <span className="leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </div>
          {block.team && block.team.length > 0 && (
            <div className="rounded-xl border border-line p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">Teammates&apos; work</p>
              <ul className="mt-3 space-y-2.5">
                {block.team.map((m, i) => (
                  <li key={i} className="flex gap-3 text-muted">
                    <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-subtle" />
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    case "links":
      return (
        <ul className="grid gap-2 sm:grid-cols-2">
          {block.items.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-sm text-fg/90 transition-colors hover:border-ocean/50 hover:text-fg"
              >
                <span>{l.label}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">{l.kind}</span>
              </a>
            </li>
          ))}
        </ul>
      );
  }
}
