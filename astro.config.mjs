import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import auth from 'auth-astro';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [react(), mdx(), auth()],
  site: process.env.SITE || 'https://sarakhanx.github.io',
  base: process.env.BASE_PATH || '/yard',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
});