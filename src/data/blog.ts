export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
};

/**
 * Mock blog posts — user will write real content later.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "building-zalo-miniapps-at-scale",
    title: "Building Zalo Mini Apps at Scale",
    excerpt:
      "Lessons learned from building mini apps serving millions of users for major Vietnamese brands. Architecture decisions, performance gotchas, and the Zalo ecosystem quirks.",
    date: "2025-01-15",
    readTime: "8 min read",
    tags: ["Zalo Mini App", "Architecture", "Performance"],
  },
  {
    slug: "performance-budgets-in-practice",
    title: "Performance Budgets in Practice",
    excerpt:
      "How I enforce strict performance budgets across projects — from Lighthouse CI to custom bundle analysis, and why 'fast enough' is never enough.",
    date: "2024-12-20",
    readTime: "6 min read",
    tags: ["Performance", "Lighthouse", "Best Practices"],
  },
  {
    slug: "why-astro-for-portfolio",
    title: "Why I Chose Astro for My Portfolio",
    excerpt:
      "Comparing Next.js, Nuxt, SvelteKit, and Astro for a developer portfolio. Spoiler: static-first with zero JS by default wins when content is king.",
    date: "2024-11-10",
    readTime: "5 min read",
    tags: ["Astro", "Static Site", "Developer Experience"],
  },
];
