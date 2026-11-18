import Image from "next/image";
import type { MediaRef } from "@/content/schema";
import { PlaceholderArt } from "./PlaceholderArt";

/** Renders any MediaRef. Real images use next/image for responsive, lazy loading. */
export function Media({
  media,
  variant = "figure",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  className = "",
}: {
  media: MediaRef;
  variant?: "cover" | "figure";
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (media.kind === "placeholder") {
    return (
      <div role="img" aria-label={media.alt} className={`relative h-full w-full ${className}`}>
        <PlaceholderArt motif={media.motif} hue={media.hue} variant={variant} label={variant === "figure"} className="h-full w-full" />
      </div>
    );
  }
  const pos = media.focal ? `${media.focal.x * 100}% ${media.focal.y * 100}%` : "50% 50%";
  return (
    <Image
      src={media.src}
      alt={media.alt}
      width={media.width}
      height={media.height}
      sizes={sizes}
      priority={priority}
      className={`h-full w-full object-cover ${className}`}
      style={{ objectPosition: pos }}
    />
  );
}
