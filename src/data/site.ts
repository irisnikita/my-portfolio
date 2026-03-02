export type Socials = {
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  xUrl?: string | null;
};

export type SiteData = {
  name: string;
  title: string;
  location: string;
  email: string;
  tagline: string;
  description: string;
  bio: string;
  cvUrl?: string | null;
  socials: Socials;
};

export const site: SiteData = {
  name: "Nguyễn Lương Trường Vĩ",
  title: "Full-stack Developer",
  location: "Ho Chi Minh City (GMT+7)",
  email: "nltruongvi@gmail.com",
  tagline: "Performance-first full-stack craft.",
  description: "Thoughts on web development, performance, and building production apps at scale.",
  bio: "Full-stack developer with 4+ years building production apps — from CDP platforms to Zalo Mini Apps serving millions of users for brands like Highlands Coffee, PNJ, Phúc Long, and Aristino. I focus on clean UI, careful motion, and a strict performance budget.",
  cvUrl: "/cv.pdf",
  socials: {
    githubUrl: import.meta.env.PUBLIC_GITHUB_URL ?? "https://github.com/irisnikita",
    linkedinUrl: import.meta.env.PUBLIC_LINKEDIN_URL ?? "https://www.linkedin.com/in/truongvi",
    xUrl: import.meta.env.PUBLIC_X_URL ?? null,
  },
};
