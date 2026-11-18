import Link from "next/link";
import { site } from "@/content/site";

export function SiteHeader() {
  const linkCls =
    "rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-fg hover:bg-white/[0.04]";
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg border border-line-strong bg-sapphire/40 font-mono text-[11px] tracking-wider text-ocean transition-colors group-hover:border-ocean/60">
            EE
          </span>
          <span className="hidden font-display text-[15px] font-medium tracking-tight sm:inline">{site.name}</span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-0.5 sm:gap-1">
            <li><Link className={linkCls} href="/">Home</Link></li>
            <li><Link className={linkCls} href="/projects">Projects</Link></li>
            <li>
              <Link className={linkCls} href={site.resumeUrl ?? "/resume"}>Resume</Link>
            </li>
            <li>
              {site.linkedinUrl ? (
                <a className={linkCls} href={site.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <span className={`${linkCls} cursor-not-allowed opacity-60 hover:bg-transparent hover:text-muted`} title="LinkedIn URL not set yet (src/content/site.ts)">
                  LinkedIn
                </span>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
