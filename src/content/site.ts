import type { SiteProfile } from "./schema";

/**
 * Homepage content. Every field is owner-editable (inline editing arrives in
 * Phase 3). Items marked isPlaceholder render with a visible "Placeholder" tag.
 */
export const site: SiteProfile = {
  name: "Your Full Name",
  isPlaceholderName: true,
  headline: "Electrical Engineering Student & Researcher",
  headlineAlternatives: [
    "Electrical Engineering Student & Researcher",
    "Aspiring IC Design Engineer",
    "Unlicensed Engineer",
  ],
  intro:
    "I study how integrated circuits are designed, verified, and measured — and I am equally curious about the engineering problems that sit outside microelectronics. This portfolio documents what I built, how I checked it, and where it still falls short.",
  photo: null,
  linkedinUrl: null,
  resumeUrl: null,
  about: [
    "My main interest is semiconductor and integrated circuit technology: digital logic design, analog circuit behaviour, and the verification work that connects a design to evidence that it works.",
    "I am drawn to research because it rewards asking precise questions. I try to state what a design must achieve, test whether it does, and record honestly where it does not.",
    "I do not limit myself to microelectronics. I regularly learn unfamiliar tools and domains on my own when a problem requires it, and I treat each project as an opportunity to improve my engineering judgment.",
  ],
  personalStory: {
    // Unpublished until the owner provides the story.
    published: false,
    title: "Personal story",
    body: [],
  },
  education: [
    {
      institution: "University Name",
      degree: "Bachelor of Science",
      major: "Electrical Engineering",
      graduation: "Expected Month Year",
      distinctions: [],
      isPlaceholder: true,
    },
  ],
  honors: [
    {
      title: "Tau Beta Pi National Engineering Honor Society",
      detail: "Invited three consecutive years (Top 1/8 of Class)",
    },
  ],
  expertise: [
    {
      id: "digital",
      label: "Digital",
      knowledge: ["Placeholder — e.g. synchronous design", "Placeholder — e.g. FSM design"],
      tools: ["Placeholder tool"],
      coursework: ["Placeholder course"],
      projects: ["sample-pipelined-processor", "sample-fpga-signal-pipeline"],
    },
    {
      id: "analog",
      label: "Analog",
      knowledge: ["Placeholder — e.g. small-signal analysis"],
      tools: ["Placeholder tool"],
      coursework: ["Placeholder course"],
      projects: ["sample-two-stage-opamp", "sample-bandgap-reference"],
    },
    {
      id: "research",
      label: "Research",
      knowledge: ["Placeholder — e.g. literature review"],
      tools: ["Placeholder tool"],
      experience: [],
      projects: ["sample-device-characterization", "sample-research-methods"],
    },
    {
      // Hidden automatically while empty. Do not invent internship experience.
      id: "internship",
      label: "Internship",
    },
  ],
};
