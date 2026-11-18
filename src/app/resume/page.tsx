import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Résumé" };

export default function ResumePage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <p className="eyebrow mb-3">Résumé / CV</p>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Curriculum vitae</h1>
      {site.resumeUrl ? (
        <a href={site.resumeUrl} download className="mt-8 inline-flex rounded-full bg-sapphire px-5 py-2.5 text-sm font-medium text-white">Download PDF</a>
      ) : (
        <div className="panel mt-8 p-6">
          <span className="placeholder-tag">Not uploaded</span>
          <p className="prose-body mt-3">
            The CV has not been uploaded yet. In Phase 1, place a PDF in <code className="font-mono text-ocean">public/</code> and set{" "}
            <code className="font-mono text-ocean">resumeUrl</code> in <code className="font-mono text-ocean">src/content/site.ts</code>.
            From Phase 3 it is uploaded through Developer Studio.
          </p>
          <Link href="/" className="mt-5 inline-block text-sm text-ocean hover:underline">← Back to home</Link>
        </div>
      )}
    </section>
  );
}
