// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

const priorityPaths = new Set(
  JSON.parse(readFileSync(new URL('./src/data/sitemap-priority-paths.json', import.meta.url), 'utf-8'))
);

const structuralPrefixes = ['/clinics/', '/services/', '/guides/'];
function isStructural(path) {
  if (['/', '/clinics', '/services', '/guide', '/guides', '/search'].includes(path)) return true;
  for (const prefix of structuralPrefixes) {
    if (path.startsWith(prefix) && path.split('/').length <= 3) return true;
  }
  return false;
}

export default defineConfig({
  site: 'https://clinicfinder.co.za',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => {
        const path = page.replace('https://clinicfinder.co.za', '') || '/';
        return priorityPaths.has(path) || isStructural(path);
      },
    }),
  ],
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
