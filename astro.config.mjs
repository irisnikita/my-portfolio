// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

const site =
  process.env.SITE_URL ? process.env.SITE_URL :
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
  undefined;

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),

  // Canonical base URL (also required for sitemap generation)
  site,

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), sitemap()],
});