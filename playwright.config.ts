import { defineConfig } from '@playwright/test';
import { createHash } from 'node:crypto';

// -- Per-worktree test port, and no silent reuse (#1478) ---------------------
// All four site repos pinned one shared port and reused whatever server was
// already on it, so a leftover server served the WRONG TREE's output. A git
// worktree does NOT protect against this: the port is machine-global. Measured
// six keeper-pair overlaps in the 30 days to 2026-08-28, every one THIS pair --
// liquorlicensecost (20:45) still running when daycarecostguide started
// (21:00) -- so two different SITES were serving each other's dist to each
// other's Playwright suite.
//
// The port is DERIVED from the absolute repo root, so two checkouts cannot
// agree on one and the same checkout always does. The range is wide because a
// 90-slot first draft collided franchisevs with daycarecostguide immediately.
// `reuseExistingServer` is now false because 20,000 slots is small but NOT
// zero: reuse is the mechanism that turns a port clash into SILENT wrong-tree
// serving, and with it off Playwright refuses the occupied port by name. A rare
// loud failure beats a rare silent one. Cost in CI time: none -- the server is
// started either way. Use TEST_URL to point a run at an existing server.
const repoRoot = process.cwd();
const port = Number(process.env.TEST_PORT)
  || 20000 + (parseInt(createHash('sha1').update(repoRoot).digest('hex').slice(0, 8), 16) % 20000);
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 60000,
  use: {
    baseURL: process.env.TEST_URL || `http://localhost:${port}`,
    headless: true,
  },
  webServer: {
    command: `python3 -m http.server ${port} --directory dist`,
    port,
    reuseExistingServer: false,
    timeout: 10000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
