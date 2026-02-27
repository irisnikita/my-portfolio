export type SkillCategory = {
  category: string;
  items: string[];
};

export const skills: SkillCategory[] = [
  {
    category: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Astro",
      "Tailwind CSS",
      "HTML / CSS",
      "Zustand",
      "TanStack Query",
    ],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "NestJS",
      "Express",
      "REST API",
      "PostgreSQL",
      "MongoDB",
      "Redis",
    ],
  },
  {
    category: "Platforms",
    items: [
      "Zalo Mini App",
      "Vercel",
      "Docker",
      "AWS (S3, EC2)",
      "GitHub Actions",
    ],
  },
  {
    category: "Tools & Practices",
    items: [
      "Git",
      "Figma",
      "Jest / Vitest",
      "CI/CD",
      "Agile / Scrum",
      "Performance Budgeting",
    ],
  },
];
