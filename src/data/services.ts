export type Service = {
  icon: string;
  title: string;
  description: string;
};

export const services: Service[] = [
  {
    icon: "🏗️",
    title: "Full-stack Development",
    description:
      "End-to-end web applications with React/Next.js on the front-end and NestJS on the back-end. REST & GraphQL APIs, database design, CI/CD pipelines.",
  },
  {
    icon: "📱",
    title: "Zalo Mini App Development",
    description:
      "Native-like mini applications for the Vietnamese market — ordering, loyalty, payments, store locator. Serving millions of daily active users.",
  },
  {
    icon: "📊",
    title: "CDP Integration",
    description:
      "Customer Data Platform setup and integration for personalized user journeys, segmentation, campaign automation, and data-driven product decisions.",
  },
  {
    icon: "🎨",
    title: "UI & Motion Engineering",
    description:
      "Performance-first interfaces with cinematic motion — transform-only animations, reduced-motion support, and strict Lighthouse performance budgets.",
  },
];
