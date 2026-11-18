import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">This page does not exist</h1>
      <p className="prose-body mt-3">The project may have been renamed or unpublished.</p>
      <Link href="/projects" className="mt-8 inline-block text-ocean hover:underline">Browse all projects →</Link>
    </section>
  );
}
