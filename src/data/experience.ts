export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
};

/**
 * Draft work experience — user will review and correct details.
 * Newest first.
 */
export const experience: ExperienceEntry[] = [
  {
    company: "Antsomi",
    role: "Full-stack Developer",
    period: "2022 – Present",
    description:
      "Building Zalo Mini Apps for major Vietnamese brands (Highlands Coffee, PNJ, Phúc Long, Aristino). Architecting front-end with React/Next.js and back-end services with NestJS. Integrating CDP (Customer Data Platform) for personalized user journeys and loyalty programs.",
    tags: ["React", "Next.js", "NestJS", "Zalo Mini App", "CDP"],
  },
  {
    company: "Previous Company",
    role: "Front-end Developer",
    period: "2021 – 2022",
    description:
      "Developed responsive web applications with React and TypeScript. Collaborated with design and back-end teams to ship user-facing features. Focused on performance optimization and component reusability.",
    tags: ["React", "TypeScript", "REST API", "Responsive Design"],
  },
];
