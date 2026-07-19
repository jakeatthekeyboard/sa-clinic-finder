import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

/**
 * Provenance-manifest tests for ClinicFinder.
 *
 * CF's facility records are SOURCED from open data (OpenStreetMap via Overpass, plus HOTOSM)
 * — nothing here is modelled or AI-estimated. The honest caveat on this site is a different
 * one: OSM is community-maintained, so completeness and currency vary by area. That is a
 * COVERAGE caveat, not a provenance one, and it matters more here than anywhere else in the
 * portfolio because a wrong clinic address costs someone a trip they may not afford.
 *
 * MECE over manifest failure modes: A structure, B coverage, C accuracy, D vocabulary,
 * E non-regression (facility data must stay `sourced`; the coverage caveat must stay stated).
 */

const DATA = join(__dirname, "../src/data");
const manifest = JSON.parse(readFileSync(join(DATA, "_provenance.json"), "utf-8"));

describe("A. Manifest structure", () => {
  it("defines a level vocabulary with descriptions", () => {
    expect(Object.keys(manifest.levels).length).toBeGreaterThanOrEqual(3);
    Object.values(manifest.levels).forEach((d: any) => expect(String(d).length).toBeGreaterThan(20));
  });

  it("carries an updated_at timestamp", () => {
    expect(manifest.updated_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

describe("B. Coverage — every shipped dataset is described", () => {
  const described = Object.keys(manifest.datasets);
  const files = readdirSync(DATA).filter(
    (f) => (f.endsWith(".json") || f.endsWith(".ts")) && !f.startsWith("_") && f !== "helpers.ts",
  );

  files.forEach((f) => {
    it(`${f} is described`, () => {
      const hit = described.some((d) => d === f || (d.includes("*") && f.startsWith(d.split("*")[0])));
      expect(hit, `${f} has no provenance entry`).toBe(true);
    });
  });
});

describe("C. Accuracy — declared fields exist in the data", () => {
  it("facilities.json fields named by the manifest are real", () => {
    const f = JSON.parse(readFileSync(join(DATA, "facilities.json"), "utf-8"));
    const keys = new Set(Object.keys(f[0]));
    const declared = Object.keys(manifest.datasets["facilities.json"]).filter((k) => !k.includes("*"));
    const missing = declared.filter((k) => !keys.has(k));
    expect(missing, "manifest names fields absent from facilities.json").toEqual([]);
  });
});

describe("D. Vocabulary — no undefined level is used", () => {
  const levels = new Set(Object.keys(manifest.levels));
  Object.entries(manifest.datasets).forEach(([ds, fields]: [string, any]) => {
    it(`${ds} uses only defined levels`, () => {
      const unknown = [...new Set(Object.values(fields).map(String))].filter((l) => !levels.has(l));
      expect(unknown, `undefined level(s) in ${ds}`).toEqual([]);
    });
  });
});

describe("E. Non-regression — facility data stays sourced, coverage caveat stays stated", () => {
  it("facility name, address and coordinates are declared sourced", () => {
    const f = manifest.datasets["facilities.json"];
    expect(f.name).toBe("sourced");
    expect(f.address).toBe("sourced");
    expect(f.coordinates).toBe("sourced");
  });

  it("nothing on this site is declared ai_estimate", () => {
    const all = Object.values(manifest.datasets).flatMap((ds: any) => Object.values(ds).map(String));
    expect(all).not.toContain("ai_estimate");
  });

  it("the open-data sources are named", () => {
    expect(manifest.primary_sources.join(" ")).toMatch(/OpenStreetMap|Overpass|HOTOSM/i);
  });

  it("the coverage caveat is recorded and framed as coverage, not provenance", () => {
    const notes = manifest.notes.join(" ");
    expect(notes).toMatch(/community-maintained/i);
    expect(notes).toMatch(/coverage caveat/i);
  });
});
