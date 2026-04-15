// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://clinicfinder.co.za',
  adapter: vercel(),
  integrations: [sitemap()],
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
