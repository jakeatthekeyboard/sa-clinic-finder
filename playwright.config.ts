import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:4321',
    headless: true,
  },
  webServer: {
    command: 'python3 -m http.server 4321 --directory dist',
    port: 4321,
    reuseExistingServer: true,
    timeout: 10000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
