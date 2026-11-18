import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { BackgroundField } from "@/components/background/BackgroundField";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} — ${site.headline}`, template: `%s — ${site.name}` },
  description: site.intro,
  openGraph: { type: "website", title: site.name, description: site.intro },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#04060c", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} ${mono.variable}`}>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only z-50 rounded bg-ocean px-3 py-2 text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <BackgroundField />
        <MotionProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
