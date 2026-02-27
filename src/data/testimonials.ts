export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

/**
 * Placeholder testimonials — replace with real quotes from colleagues/clients.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Vĩ consistently delivers clean, performant code. His attention to detail on the Zalo Mini App project was exceptional — the app scored 95+ on Lighthouse across the board.",
    author: "Team Lead",
    role: "Engineering Manager",
    company: "Antsomi",
  },
  {
    quote:
      "Working with Vĩ on the CDP integration was seamless. He bridged the gap between front-end and back-end effortlessly and always kept the user experience as the top priority.",
    author: "Product Manager",
    role: "Product Manager",
    company: "Client Company",
  },
  {
    quote:
      "Vĩ's ability to ship fast without compromising quality is rare. He built our loyalty rewards UI in under two weeks and it just worked — no bugs in production.",
    author: "Colleague",
    role: "Senior Developer",
    company: "Antsomi",
  },
];
