import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-10 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} {site.name}. Content reflects my own work; limitations are stated where known.</p>
        <p className="font-mono text-xs tracking-wider">Phase 1 prototype · placeholder content</p>
      </div>
    </footer>
  );
}
