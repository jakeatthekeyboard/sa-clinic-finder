import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const GUIDES_DIR = join(__dirname, "../src/pages/guides");

const guideFiles = readdirSync(GUIDES_DIR)
  .filter((f) => f.endsWith(".astro") && f !== "index.astro");

describe("Guide structured data coverage", () => {
  guideFiles.forEach((file) => {
    const content = readFileSync(join(GUIDES_DIR, file), "utf-8");

    it(`${file}: has HowTo schema`, () => {
      const hasHowTo =
        content.includes('"HowTo"') ||
        content.includes("'HowTo'") ||
        content.includes('"@type": "HowTo"') ||
        content.includes("'@type': 'HowTo'");
      expect(hasHowTo, `${file} is missing HowTo structured data`).toBe(true);
    });

    it(`${file}: has Article schema`, () => {
      const hasArticle =
        content.includes('"Article"') || content.includes("'Article'");
      expect(hasArticle, `${file} is missing Article structured data`).toBe(
        true
      );
    });

    it(`${file}: has FAQPage schema`, () => {
      const hasFAQ =
        content.includes('"FAQPage"') || content.includes("'FAQPage'");
      expect(hasFAQ, `${file} is missing FAQPage structured data`).toBe(true);
    });
  });
});
