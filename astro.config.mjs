import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
  site: process.env.SITE || 'https://sarakhanx.github.io',
  base: process.env.BASE_PATH || '/yard',
  integrations: [react()],
});