import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

/**
 * AI-transparency page tests (#844).
 *
 * WHY: /how-this-site-is-made is an E-E-A-T and trust asset — it states that the content
 * is AI-drafted and human-supervised, names who is accountable, and distinguishes what is
 * sourced from what is modelled. A page making that promise is worse than no page at all
 * if it silently loses the distinction, so the load-bearing assertion here is not "the
 * page exists" but "the page still tells a reader which class each figure belongs to".
 *
 * The provenance table is GENERATED from src/data/_provenance.json rather than written
 * out in prose, precisely so it cannot drift from the manifest the data tooling reads.
 * These tests pin that generation.
 */

const ROOT = join(__dirname, "..");
const PAGE = join(ROOT, "src/pages/how-this-site-is-made.astro");
const BASE = join(ROOT, "src/layouts/Base.astro");

const DIST = join(ROOT, "dist");

/** Every built HTML page. Walked at call time so a locale added later is covered. */
function builtPages(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "index.html") out.push(p);
    }
  };
  walk(DIST);
  return out;
}

const page = readFileSync(PAGE, "utf-8");
const flat = page.replace(/\s+/g, " ");
const prov = JSON.parse(readFileSync(join(ROOT, "src/data/_provenance.json"), "utf-8"));

function levelsInUse(): Set<string> {
  const used = new Set<string>();
  for (const fields of Object.values(prov.datasets ?? {})) {
    if (fields && typeof fields === "object") {
      for (const v of Object.values(fields as Record<string, unknown>)) {
        if (typeof v === "string") used.add(v);
      }
    }
  }
  return used;
}

describe("AI-transparency page", () => {
  it("exists", () => {
    expect(existsSync(PAGE)).toBe(true);
  });

  it("is footer-linked from every BUILT page, in every locale (#1368)", () => {
    // Asserted on the BUILT output, not on Base.astro's source text. The source
    // assertion this replaces matched the literal `href="/how-this-site-is-made"`,
    // which is exactly the hard-coded English href #1368 removed: the layout now
    // resolves the link through `localeHref`, so a source-text check could only be
    // kept green by putting the defect back. It also could not see the thing that
    // matters — that an isiXhosa reader lands on the isiXhosa page.
    const pages = builtPages();
    expect(pages.length).toBeGreaterThan(3000);
    const missing: string[] = [];
    for (const f of pages) {
      const html = readFileSync(f, "utf-8");
      const rel = f.slice(DIST.length);
      const prefix = rel.startsWith("/xh/") ? "/xh" : rel.startsWith("/zu/") ? "/zu" : "";
      if (!html.includes(`href="${prefix}/how-this-site-is-made"`)) missing.push(rel);
    }
    expect(missing.slice(0, 5)).toEqual([]);
  });

  it("has no hard-coded English chrome href left in the layout (#1368)", () => {
    // The footer legal strip, the corrections link and the header search link were all
    // literal English paths, so all 2,240 built /xh and /zu pages sent a reader who
    // clicked "sazise" — the corrections channel — into English. Only asset hrefs
    // (/favicon.svg, /llms.txt) may be literal here.
    const base = readFileSync(BASE, "utf-8");
    const literals = [...base.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]);
    expect(literals.sort()).toEqual(["/favicon.svg", "/llms.txt"]);
  });

  it("is indexable — a trust page hidden from search is worthless as an E-E-A-T signal", () => {
    expect(page).not.toMatch(/noindex/i);
  });

  it("states the content is AI-drafted AND human-supervised (#844 acceptance a)", () => {
    expect(flat).toMatch(/AI-drafted and human-supervised/i);
  });

  it("asserts a person holds editorial responsibility (#844 acceptance b)", () => {
    expect(flat).toMatch(/[Ee]ditorial responsibility/);
    // The claim that matters: AI drafts, a person is accountable. Not the reverse.
    expect(flat).toMatch(/it is not the party accountable for it/);
  });

  it("describes a re-verification cycle (#844 acceptance d)", () => {
    expect(flat).toMatch(/community-maintained/);
  });

  it("gives a real contact route for corrections (#844 acceptance e)", () => {
    expect(page).toContain("mailto:hello@clinicfinder.co.za");
  });

  it("derives the provenance table from the manifest, not from hand-written prose", () => {
    expect(page).toContain("_provenance.json");
    expect(page).toMatch(/provenance\.levels/);
  });

  it("can order every provenance level that is actually in use", () => {
    // A level present in the manifest but absent from LEVEL_ORDER would vanish from the
    // page silently — the exact failure mode this page exists to prevent.
    const used = levelsInUse();
    expect(used.size).toBeGreaterThan(0);
    for (const lvl of used) {
      expect(page).toContain(`'${lvl}'`);
    }
  });

  it("names its primary sources inline", () => {
    expect(Array.isArray(prov.primary_sources)).toBe(true);
    expect(page).toMatch(/primary_sources/);
    expect(flat).toMatch(/OpenStreetMap/);
  });

  it("does NOT hedge sourced facility records as estimates", () => {
    // The manifest is explicit: facility records are sourced, not modelled. Hedging them
    // would make the site less useful for no honesty gain.
    expect(flat).toMatch(/are <strong>sourced<\/strong>/);
  });

  it("frames the real caveat as COVERAGE, not invention", () => {
    expect(flat).toMatch(/community-maintained/);
    expect(flat).toMatch(/not that figures are made up/);
  });

  it("carries the phone-ahead safety line — this is a humanitarian site", () => {
    // A wrong address costs someone a trip they may not be able to afford. This line is
    // the single most useful sentence on the page and must not be edited away.
    expect(flat).toMatch(/[Pp]lease phone ahead before/);
  });
});
