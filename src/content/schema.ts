/**
 * Portfolio content model (Phase 1: static TypeScript data).
 *
 * This file is the single contract between content and UI. In Phase 2 the
 * same shapes are stored as JSON documents in Supabase (see CONTENT_SCHEMA.md),
 * so components must depend only on these types — never on where data lives.
 */

/* ---------------------------------------------------------------- shared */

/** Where a technical claim came from. Used to keep case studies evidence-based. */
export interface Provenance {
  /** Source document or artefact, e.g. "Final report §4.2" or "sim/tb_alu.log". */
  ref: string;
  note?: string;
}

/** Media reference. Phase 1 supports generated placeholder art only. */
export type MediaRef =
  | {
      kind: "placeholder";
      motif: PlaceholderMotif;
      /** Hue shift in degrees to keep placeholder art visually distinct. */
      hue?: number;
      alt: string;
    }
  | {
      kind: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      /** Focal point (0–1) used for cropping inside cards. */
      focal?: { x: number; y: number };
    };

export type PlaceholderMotif =
  | "logic"
  | "waveform"
  | "schematic"
  | "die"
  | "plot"
  | "block";

/* ------------------------------------------------------------- categories */

export interface Category {
  id: string;
  label: string;
  /** Owner-controlled order of bookmark tabs. */
  order: number;
}

/* ---------------------------------------------------------------- blocks */

export type Block =
  | { type: "paragraph"; text: string; source?: Provenance }
  | { type: "list"; style: "bullet" | "numbered"; items: string[]; source?: Provenance }
  | { type: "figure"; media: MediaRef; caption?: string; source?: Provenance }
  | { type: "code"; language: CodeLanguage; code: string; caption?: string; source?: Provenance }
  | { type: "keyValue"; items: { label: string; value: string }[] }
  | { type: "tags"; groups: { label: string; tags: string[] }[] }
  | {
      type: "callout";
      tone: "note" | "result" | "limitation";
      title?: string;
      text: string;
      source?: Provenance;
    }
  | {
      type: "contributions";
      mine: string[];
      /** Work done by teammates — shown to make individual credit unambiguous. */
      team?: string[];
    }
  | {
      type: "links";
      items: { label: string; href: string; kind: "pdf" | "repository" | "reference" | "report" }[];
    };

export type CodeLanguage = "verilog" | "systemverilog" | "matlab" | "python" | "c" | "text";

/* -------------------------------------------------------------- sections */

export type SectionKind =
  | "question"
  | "contributions"
  | "methodology"
  | "tools"
  | "challenges"
  | "validation"
  | "lessons"
  | "future"
  | "materials"
  | "custom";

export interface Section {
  /** Stable id, unique within a project. Used for anchors and diffs. */
  id: string;
  kind: SectionKind;
  title: string;
  hidden?: boolean;
  /**
   * stack — blocks in one column.
   * split — prose on the left, media/code on the right (desktop).
   * gallery — figures in a responsive grid.
   */
  layout: "stack" | "split" | "gallery";
  /** Progressive disclosure: collapsed sections render as expandable panels. */
  disclosure: "open" | "collapsed";
  blocks: Block[];
}

/* -------------------------------------------------------------- projects */

export type ProjectStatus =
  | "completed"
  | "in-progress"
  | "concluded-with-limitations"
  | "paused";

export type ProjectContext = "academic" | "research" | "professional" | "independent";

export interface Takeaway {
  kind: "contribution" | "outcome" | "improvement";
  text: string;
  source?: Provenance;
}

export interface Project {
  id: string;
  /** URL segment: /projects/{slug}. Must stay stable once published. */
  slug: string;
  title: string;
  subtitle: string;
  categoryId: Category["id"];
  /** Owner-controlled global order. Not chronological by assumption. */
  order: number;
  /** Publication state. Only "published" is visible on the public site. */
  publication: "draft" | "published";
  /** True for Phase 1 sample content; rendered with a visible label. */
  isPlaceholder?: boolean;
  cover: MediaRef;
  meta: {
    domain: string;
    duration: string;
    status: ProjectStatus;
    context: ProjectContext;
    team: { type: "individual" } | { type: "group"; size?: number; role?: string };
  };
  overview: string;
  /** Up to three. Never fabricate metrics. */
  takeaways?: Takeaway[];
  sections: Section[];
}

/* ------------------------------------------------------------------ site */

export interface ExpertiseArea {
  id: "digital" | "analog" | "research" | "internship" | (string & {});
  label: string;
  knowledge?: string[];
  tools?: string[];
  coursework?: string[];
  experience?: { title: string; org?: string; period?: string; summary?: string }[];
  /** Slugs of related projects. */
  projects?: string[];
}

export interface SiteProfile {
  name: string;
  isPlaceholderName?: boolean;
  headline: string;
  /** Alternatives kept for the owner to switch between later. */
  headlineAlternatives: string[];
  intro: string;
  photo: MediaRef | null;
  linkedinUrl: string | null;
  resumeUrl: string | null;
  about: string[];
  personalStory: { published: boolean; title: string; body: string[] };
  education: {
    institution: string;
    degree: string;
    major: string;
    graduation: string;
    distinctions?: string[];
    isPlaceholder?: boolean;
  }[];
  honors: { title: string; detail: string }[];
  expertise: ExpertiseArea[];
}
