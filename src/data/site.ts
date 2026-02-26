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
  bio: string;
  cvUrl?: string | null;
  socials: Socials;
};

export const site: SiteData = {
  name: "Nguyễn Lương Trường Vĩ",
  title: "Full-stack",
  location: "Ho Chi Minh City (GMT+7)",
  email: "nltruongvi@gmail.com",
  tagline: "Performance-first full-stack craft.",
  bio:
    "I build pragmatic products with clean UI, careful motion, and a performance budget — from idea to production.",
  cvUrl: null,
  socials: {
    githubUrl: import.meta.env.PUBLIC_GITHUB_URL ?? null,
    linkedinUrl: null,
    xUrl: null,
  },
};
