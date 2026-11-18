import Link from "next/link";
import { site } from "@/content/site";
import type { ExpertiseArea } from "@/content/schema";
import { getPublishedProject, projectPath } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";

const wrap = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

export function About() {
  return (
    <section aria-labelledby="about-title" className={`${wrap} py-14`}>
      <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
        <SectionHeading id="about-title" eyebrow="01 · About" title="How I approach engineering" />
        <div className="space-y-5">
          {site.about.map((p, i) => (
            <p key={i} className="prose-body text-[1.05rem]">{p}</p>
          ))}
          {site.personalStory.published && (
            <div className="panel mt-8 p-6">
              <h3 className="font-display text-lg text-fg">{site.personalStory.title}</h3>
              {site.personalStory.body.map((p, i) => <p key={i} className="prose-body mt-3">{p}</p>)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function EducationHonors() {
  const edu = site.education[0]; // Latest relevant degree only, by default.
  return (
    <section aria-labelledby="edu-title" className={`${wrap} py-14`}>
      <SectionHeading id="edu-title" eyebrow="02 · Education & honors" title="Academic record" />
      <div className="grid gap-5 md:grid-cols-2">
        {edu && (
          <article className="panel p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <p className="eyebrow !text-subtle">Education</p>
              {edu.isPlaceholder && <span className="placeholder-tag">Placeholder</span>}
            </div>
            <h3 className="mt-4 font-display text-xl text-fg">{edu.institution}</h3>
            <p className="mt-1 text-muted">{edu.degree} · {edu.major}</p>
            <p className="mt-4 font-mono text-sm text-subtle">{edu.graduation}</p>
            {edu.distinctions && edu.distinctions.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm text-muted">{edu.distinctions.map((d) => <li key={d}>{d}</li>)}</ul>
            )}
          </article>
        )}
        {site.honors.map((h) => (
          <article key={h.title} className="panel relative overflow-hidden p-6 sm:p-7">
            <div aria-hidden className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-jade/70 to-transparent" />
            <p className="eyebrow !text-subtle">Honor</p>
            <h3 className="mt-4 font-display text-xl text-fg">{h.title}</h3>
            <p className="mt-2 text-muted">{h.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function hasContent(a: ExpertiseArea) {
  return Boolean(a.knowledge?.length || a.tools?.length || a.coursework?.length || a.experience?.length || a.projects?.length);
}

function List({ label, items }: { label: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{label}</h4>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {items.map((t) => (
          <li key={t} className="rounded-md border border-line bg-white/[0.02] px-2 py-1 text-[13px] text-muted">{t}</li>
        ))}
      </ul>
    </div>
  );
}

export function Expertise() {
  const areas = site.expertise.filter(hasContent); // empty areas stay hidden
  if (!areas.length) return null;
  return (
    <section aria-labelledby="exp-title" className={`${wrap} py-14`}>
      <SectionHeading id="exp-title" eyebrow="03 · Expertise & experience" title="Areas of work">
        <span className="placeholder-tag mt-3">Placeholder entries</span>
      </SectionHeading>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {areas.map((a) => {
          const related = (a.projects ?? []).map((s) => getPublishedProject(s)).filter((p) => p !== undefined);
          return (
            <article key={a.id} className="panel flex flex-col gap-5 p-6">
              <h3 className="font-display text-lg text-fg">{a.label}</h3>
              <List label="Knowledge" items={a.knowledge} />
              <List label="Tools" items={a.tools} />
              <List label="Coursework" items={a.coursework} />
              {a.experience?.length ? (
                <ul className="space-y-2 text-sm text-muted">{a.experience.map((e) => <li key={e.title}>{e.title}{e.org ? ` · ${e.org}` : ""}</li>)}</ul>
              ) : null}
              {related.length > 0 && (
                <div className="mt-auto border-t border-line pt-4">
                  <h4 className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">Projects</h4>
                  <ul className="mt-2 space-y-1.5">
                    {related.map((p) => (
                      <li key={p.slug}>
                        <Link href={projectPath(p.slug)} className="text-sm text-ocean/90 underline-offset-4 hover:text-ocean hover:underline">{p.title.replace(/^Sample Project:\s*/, "")}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
