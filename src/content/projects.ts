import type { Category, Project } from "./schema";

/**
 * PHASE 1 SAMPLE CONTENT — every project below is a labelled placeholder used to
 * validate layout and interaction. None of it describes real work, results or
 * metrics. Bracketed text like [metric] marks where verified data belongs.
 */

export const categories: Category[] = [
  { id: "digital", label: "Digital", order: 1 },
  { id: "analog", label: "Analog", order: 2 },
  { id: "research", label: "Research", order: 3 },
  // No projects yet: the bookmark is hidden automatically.
  { id: "internship", label: "Internship", order: 4 },
];

const sampleVerilog = `// Placeholder snippet — replace with code from the actual project.
module hazard_unit (
  input  logic [4:0] id_rs1, id_rs2,
  input  logic [4:0] ex_rd,
  input  logic       ex_mem_read,
  output logic       stall
);
  // Load-use hazard: stall one cycle when the next instruction
  // needs a register that is still being loaded from memory.
  assign stall = ex_mem_read && (ex_rd != 5'd0) &&
                 ((ex_rd == id_rs1) || (ex_rd == id_rs2));
endmodule`;

const sampleMatlab = `% Placeholder snippet — replace with the real analysis script.
data = readmatrix("measurements.csv");
vg   = data(:,1);
id   = data(:,2);
gm   = gradient(id) ./ gradient(vg);   % transconductance estimate
plot(vg, gm, "LineWidth", 1.5); grid on;
xlabel("V_{GS} (V)"); ylabel("g_m (S)");`;

export const projects: Project[] = [
  /* ------------------------------------------------------------ DIGITAL */
  {
    id: "p-001",
    slug: "sample-pipelined-processor",
    title: "Sample Project: Five-Stage Pipelined Processor",
    subtitle: "Full case-study template showing every section type",
    categoryId: "digital",
    order: 1,
    publication: "published",
    isPlaceholder: true,
    cover: { kind: "placeholder", motif: "logic", hue: 0, alt: "Placeholder cover with abstract logic-gate pattern" },
    meta: {
      domain: "Digital design · Computer architecture",
      duration: "[Start] – [End]",
      status: "concluded-with-limitations",
      context: "academic",
      team: { type: "group", size: 3, role: "[Your role]" },
    },
    overview:
      "Placeholder overview. In two or three sentences, state what was built, why, and the current state of the work. A professor should understand the project from this paragraph alone.",
    takeaways: [
      { kind: "contribution", text: "Placeholder — the single most important thing you personally designed or implemented." },
      { kind: "outcome", text: "Placeholder — a verified outcome, described only as far as evidence supports it." },
      { kind: "improvement", text: "Placeholder — a meaningful iteration, e.g. a bug found and the root cause fixed." },
    ],
    sections: [
      {
        id: "question",
        kind: "question",
        title: "Engineering question",
        layout: "split",
        disclosure: "open",
        blocks: [
          {
            type: "paragraph",
            text: "Placeholder problem statement. What question did the project try to answer, and why does it matter? Keep the motivation concrete.",
          },
          {
            type: "keyValue",
            items: [
              { label: "Requirement", value: "[Functional requirement]" },
              { label: "Constraint", value: "[Timing / area / tool constraint]" },
              { label: "Background", value: "[Relevant prior knowledge]" },
            ],
          },
        ],
      },
      {
        id: "contributions",
        kind: "contributions",
        title: "My contributions",
        layout: "stack",
        disclosure: "open",
        blocks: [
          {
            type: "contributions",
            mine: [
              "Placeholder — designed [module] and chose [approach] over [alternative].",
              "Placeholder — wrote the testbench for [unit] and ran [verification].",
              "Placeholder — debugged [issue] and documented the root cause.",
            ],
            team: ["Placeholder — teammate A implemented [module].", "Placeholder — teammate B prepared [deliverable]."],
          },
        ],
      },
      {
        id: "methodology",
        kind: "methodology",
        title: "Technical methodology",
        layout: "split",
        disclosure: "open",
        blocks: [
          {
            type: "paragraph",
            text: "Placeholder architecture description. Explain the overall structure, the key design decisions and the tradeoffs you considered.",
          },
          {
            type: "list",
            style: "numbered",
            items: ["Placeholder step — specification", "Placeholder step — RTL implementation", "Placeholder step — unit verification", "Placeholder step — integration and timing"],
          },
          {
            type: "figure",
            media: { kind: "placeholder", motif: "block", alt: "Placeholder block diagram" },
            caption: "Placeholder figure — system block diagram goes here.",
          },
        ],
      },
      {
        id: "tools",
        kind: "tools",
        title: "Tools and technologies",
        layout: "stack",
        disclosure: "open",
        blocks: [
          {
            type: "tags",
            groups: [
              { label: "Languages", tags: ["[HDL]", "[Scripting]"] },
              { label: "EDA / Simulation", tags: ["[Simulator]", "[Synthesis tool]"] },
              { label: "Hardware", tags: ["[Board / platform]"] },
            ],
          },
        ],
      },
      {
        id: "challenges",
        kind: "challenges",
        title: "Challenges and debugging",
        layout: "split",
        disclosure: "open",
        blocks: [
          {
            type: "paragraph",
            text: "Placeholder narrative of a real difficulty: the symptom, the first (unsuccessful) hypothesis, how the root cause was isolated, and what was changed.",
          },
          {
            type: "callout",
            tone: "limitation",
            title: "Remaining limitation",
            text: "Placeholder — state honestly what the final solution does not handle.",
          },
          { type: "code", language: "systemverilog", code: sampleVerilog, caption: "Placeholder code excerpt." },
        ],
      },
      {
        id: "validation",
        kind: "validation",
        title: "Validation and evidence",
        layout: "gallery",
        disclosure: "open",
        blocks: [
          {
            type: "callout",
            tone: "result",
            title: "Placeholder result",
            text: "Replace with a result that is supported by simulation logs, measurements or reports. Compare it against the original requirement. [metric] [requirement]",
          },
          {
            type: "figure",
            media: { kind: "placeholder", motif: "waveform", alt: "Placeholder simulation waveform" },
            caption: "Placeholder — simulation waveform.",
          },
          {
            type: "figure",
            media: { kind: "placeholder", motif: "plot", hue: -20, alt: "Placeholder results plot" },
            caption: "Placeholder — results plot.",
          },
        ],
      },
      {
        id: "lessons",
        kind: "lessons",
        title: "Lessons learned",
        layout: "stack",
        disclosure: "collapsed",
        blocks: [
          {
            type: "list",
            style: "bullet",
            items: ["Placeholder — new technical understanding.", "Placeholder — what you would decide differently.", "Placeholder — something learned independently."],
          },
        ],
      },
      {
        id: "future",
        kind: "future",
        title: "Future work",
        layout: "stack",
        disclosure: "collapsed",
        blocks: [{ type: "list", style: "bullet", items: ["Placeholder — unresolved problem.", "Placeholder — follow-up experiment."] }],
      },
      {
        id: "materials",
        kind: "materials",
        title: "Supporting materials",
        layout: "stack",
        disclosure: "collapsed",
        blocks: [
          {
            type: "links",
            items: [
              { label: "Placeholder — project report (PDF)", href: "#", kind: "pdf" },
              { label: "Placeholder — source repository", href: "#", kind: "repository" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "p-002",
    slug: "sample-fpga-signal-pipeline",
    title: "Sample Project: FPGA Signal-Processing Pipeline",
    subtitle: "Shorter layout — fewer sections, different order",
    categoryId: "digital",
    order: 2,
    publication: "published",
    isPlaceholder: true,
    cover: { kind: "placeholder", motif: "waveform", hue: -25, alt: "Placeholder cover with abstract waveform pattern" },
    meta: {
      domain: "FPGA · Digital signal processing",
      duration: "[Duration]",
      status: "in-progress",
      context: "independent",
      team: { type: "individual" },
    },
    overview:
      "Placeholder overview for an individual, in-progress project. This sample demonstrates that projects do not share an identical structure.",
    takeaways: [{ kind: "contribution", text: "Placeholder — the independent learning this project required." }],
    sections: [
      {
        id: "question",
        kind: "question",
        title: "Why this project",
        layout: "stack",
        disclosure: "open",
        blocks: [{ type: "paragraph", text: "Placeholder motivation paragraph." }],
      },
      {
        id: "progress",
        kind: "custom",
        title: "Current progress",
        layout: "split",
        disclosure: "open",
        blocks: [
          { type: "paragraph", text: "Placeholder — what works today, and what has not been verified yet." },
          { type: "figure", media: { kind: "placeholder", motif: "block", hue: -25, alt: "Placeholder pipeline diagram" }, caption: "Placeholder pipeline diagram." },
        ],
      },
      {
        id: "challenges",
        kind: "challenges",
        title: "Open problems",
        layout: "stack",
        disclosure: "open",
        blocks: [{ type: "callout", tone: "note", text: "Placeholder — an unsolved issue and the next hypothesis to test." }],
      },
    ],
  },

  /* ------------------------------------------------------------- ANALOG */
  {
    id: "p-003",
    slug: "sample-two-stage-opamp",
    title: "Sample Project: Two-Stage Operational Amplifier",
    subtitle: "Placeholder analog design case study",
    categoryId: "analog",
    order: 3,
    publication: "published",
    isPlaceholder: true,
    cover: { kind: "placeholder", motif: "schematic", hue: -20, alt: "Placeholder cover with abstract schematic pattern" },
    meta: {
      domain: "Analog IC design",
      duration: "[Duration]",
      status: "completed",
      context: "academic",
      team: { type: "individual" },
    },
    overview: "Placeholder overview of an analog design project — specification, topology choice, simulation, and comparison against requirements.",
    takeaways: [
      { kind: "contribution", text: "Placeholder — topology and sizing decisions." },
      { kind: "outcome", text: "Placeholder — simulated performance vs. specification." },
    ],
    sections: [
      {
        id: "question",
        kind: "question",
        title: "Design specification",
        layout: "split",
        disclosure: "open",
        blocks: [
          { type: "paragraph", text: "Placeholder — what the amplifier needed to achieve and why." },
          {
            type: "keyValue",
            items: [
              { label: "Gain", value: "[spec]" },
              { label: "Bandwidth", value: "[spec]" },
              { label: "Phase margin", value: "[spec]" },
              { label: "Power", value: "[spec]" },
            ],
          },
        ],
      },
      {
        id: "methodology",
        kind: "methodology",
        title: "Topology and sizing",
        layout: "split",
        disclosure: "open",
        blocks: [
          { type: "paragraph", text: "Placeholder — topology rationale and compensation approach." },
          { type: "figure", media: { kind: "placeholder", motif: "schematic", hue: -20, alt: "Placeholder schematic" }, caption: "Placeholder — schematic screenshot." },
        ],
      },
      {
        id: "validation",
        kind: "validation",
        title: "Simulation results",
        layout: "stack",
        disclosure: "open",
        blocks: [{ type: "callout", tone: "result", text: "Placeholder — results table vs. specification. [metric]" }],
      },
    ],
  },
  {
    id: "p-004",
    slug: "sample-bandgap-reference",
    title: "Sample Project: Bandgap Voltage Reference",
    subtitle: "Placeholder showing an unsuccessful first approach",
    categoryId: "analog",
    order: 4,
    publication: "published",
    isPlaceholder: true,
    cover: { kind: "placeholder", motif: "die", hue: 15, alt: "Placeholder cover with abstract die layout pattern" },
    meta: {
      domain: "Analog IC design · Layout",
      duration: "[Duration]",
      status: "concluded-with-limitations",
      context: "academic",
      team: { type: "group", size: 2 },
    },
    overview: "Placeholder overview for a project whose first approach did not meet requirements. Documenting this honestly is part of the portfolio's purpose.",
    sections: [
      {
        id: "challenges",
        kind: "challenges",
        title: "First attempt and why it failed",
        layout: "stack",
        disclosure: "open",
        blocks: [
          { type: "paragraph", text: "Placeholder — describe the original approach and the observed failure." },
          { type: "callout", tone: "limitation", text: "Placeholder — root cause and what could not be fixed within the project time." },
        ],
      },
      {
        id: "lessons",
        kind: "lessons",
        title: "What changed in my approach",
        layout: "stack",
        disclosure: "open",
        blocks: [{ type: "list", style: "bullet", items: ["Placeholder lesson.", "Placeholder lesson."] }],
      },
    ],
  },

  /* ----------------------------------------------------------- RESEARCH */
  {
    id: "p-005",
    slug: "sample-device-characterization",
    title: "Sample Project: Device Characterization Study",
    subtitle: "Placeholder research project with measurement data",
    categoryId: "research",
    order: 5,
    publication: "published",
    isPlaceholder: true,
    cover: { kind: "placeholder", motif: "plot", hue: -45, alt: "Placeholder cover with abstract measurement plot" },
    meta: {
      domain: "Semiconductor devices · Measurement",
      duration: "[Duration]",
      status: "in-progress",
      context: "research",
      team: { type: "group", role: "[Undergraduate researcher]" },
    },
    overview: "Placeholder overview of a research project: the question, the measurement method, and what the data does and does not show.",
    takeaways: [{ kind: "contribution", text: "Placeholder — the analysis you personally performed." }],
    sections: [
      {
        id: "question",
        kind: "question",
        title: "Research question",
        layout: "stack",
        disclosure: "open",
        blocks: [{ type: "paragraph", text: "Placeholder research question and background." }],
      },
      {
        id: "methodology",
        kind: "methodology",
        title: "Measurement and analysis",
        layout: "split",
        disclosure: "open",
        blocks: [
          { type: "paragraph", text: "Placeholder — equipment, procedure and analysis method." },
          { type: "code", language: "matlab", code: sampleMatlab, caption: "Placeholder analysis excerpt." },
        ],
      },
    ],
  },
  {
    id: "p-006",
    slug: "sample-research-methods",
    title: "Sample Project: Literature Review & Replication",
    subtitle: "Placeholder independent research exercise",
    categoryId: "research",
    order: 6,
    publication: "published",
    isPlaceholder: true,
    cover: { kind: "placeholder", motif: "block", hue: -40, alt: "Placeholder cover with abstract block pattern" },
    meta: {
      domain: "Research methods",
      duration: "[Duration]",
      status: "paused",
      context: "independent",
      team: { type: "individual" },
    },
    overview: "Placeholder overview of a self-directed study, used to show breadth of curiosity beyond the core field.",
    sections: [
      {
        id: "lessons",
        kind: "lessons",
        title: "What I learned",
        layout: "stack",
        disclosure: "open",
        blocks: [{ type: "paragraph", text: "Placeholder reflection." }],
      },
    ],
  },
  {
    id: "p-007",
    slug: "sample-unpublished-draft",
    title: "Sample Draft (not public)",
    subtitle: "Demonstrates that drafts never reach the public site",
    categoryId: "digital",
    order: 7,
    publication: "draft",
    isPlaceholder: true,
    cover: { kind: "placeholder", motif: "logic", alt: "Placeholder" },
    meta: { domain: "—", duration: "—", status: "in-progress", context: "independent", team: { type: "individual" } },
    overview: "This project is a draft and must not appear publicly.",
    sections: [],
  },
];
