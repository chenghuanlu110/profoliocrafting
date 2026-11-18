import Link from "next/link";
import { site } from "@/content/site";
import { Media } from "@/components/media/Media";

function PhotoPlaceholder() {
  return (
    <div role="img" aria-label="Photo placeholder" className="relative grid h-full w-full place-items-center bg-[linear-gradient(160deg,#0b2a66,#060c1a_70%)]">
      <svg viewBox="0 0 200 240" className="h-3/5 w-3/5 opacity-50" aria-hidden>
        <circle cx="100" cy="88" r="42" fill="none" stroke="#5ea8ff" strokeWidth="2" />
        <path d="M30 230c8-52 38-78 70-78s62 26 70 78" fill="none" stroke="#5ea8ff" strokeWidth="2" />
      </svg>
      <span className="placeholder-tag absolute bottom-4 left-4">Photo placeholder</span>
    </div>
  );
}

export function Hero() {
  const btn = "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300";
  return (
    <section aria-labelledby="hero-title" className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <div>
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-ocean/60" /> Engineering portfolio
          </p>
          <h1 id="hero-title" className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-6xl">
            {site.name}
          </h1>
          {site.isPlaceholderName && <span className="placeholder-tag mt-3">Name placeholder</span>}
          <p className="mt-5 font-display text-xl text-ocean sm:text-2xl">{site.headline}</p>
          <p className="prose-body mt-6 max-w-xl text-[1.05rem]">{site.intro}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="#projects" className={`${btn} bg-sapphire text-white shadow-[0_0_0_1px_rgb(0_211_251/0.35),0_10px_30px_-10px_rgb(0_66_172/0.9)] hover:bg-sapphire-600 hover:shadow-[0_0_0_1px_rgb(0_211_251/0.6),0_10px_40px_-10px_rgb(0_211_251/0.5)]`}>
              View projects
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
            </Link>
            {site.resumeUrl ? (
              <a href={site.resumeUrl} download className={`${btn} border border-line-strong text-fg hover:border-ocean/60`}>Download CV</a>
            ) : (
              <Link href="/resume" className={`${btn} border border-line-strong text-fg hover:border-ocean/60`}>
                Download CV <span className="placeholder-tag">Not uploaded</span>
              </Link>
            )}
            {site.linkedinUrl && (
              <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer" className={`${btn} text-muted hover:text-fg`}>
                LinkedIn ↗
              </a>
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div aria-hidden className="absolute -inset-3 rounded-[2rem] border border-line" />
          <div aria-hidden className="absolute -right-3 -top-3 h-6 w-6 border-r-2 border-t-2 border-ocean/70" />
          <div aria-hidden className="absolute -bottom-3 -left-3 h-6 w-6 border-b-2 border-l-2 border-ocean/70" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-line-strong">
            {site.photo ? <Media media={site.photo} priority sizes="(min-width:1024px) 40vw, 90vw" /> : <PhotoPlaceholder />}
          </div>
        </div>
      </div>
    </section>
  );
}
