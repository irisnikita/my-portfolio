// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),

  // Set this to your final production domain for consistent canonical URLs.
  // Example: site: 'https://example.com'
  // site: 'https://example.com',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx()],
});