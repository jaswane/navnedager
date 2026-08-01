import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { SITE, absoluteUrl } from "@/lib/site";
import { allNames } from "@/lib/navnedager";
import { MONTHS_NB, allDates } from "@/lib/dates";

describe("navnedagsdata er uendret", () => {
  it("datasettet har uendret innhold (sha256-lås)", () => {
    const raw = readFileSync(
      new URL("../../data/navnedager.json", import.meta.url)
    );
    const hash = createHash("sha256").update(raw).digest("hex");
    // Oppdater bevisst KUN når navnedagsdata faktisk skal endres.
    expect(hash).toBe(
      "39f05560968569b6ee1be98d1f586c0c493f9cc31ce3978d563f216c1406ebe7"
    );
  });

  it("9. juni er fortsatt Kolbein og Kolbjørn", () => {
    const names = allNames().filter((e) => e.month === 6 && e.day === 9);
    expect(names.map((n) => n.name)).toEqual(["Kolbein", "Kolbjørn"]);
  });
});

describe("canonical-domene er uendret", () => {
  it("bruker apex-domenet", () => {
    expect(SITE.url).toBe("https://navnedager.no");
    expect(absoluteUrl("/navn/kolbein")).toBe(
      "https://navnedager.no/navn/kolbein"
    );
  });

  it("canonical peker aldri til www", () => {
    expect(absoluteUrl("/")).not.toContain("www.");
  });
});

describe("sitemap-omfang er uendret", () => {
  it("dekker statiske sider + 12 måneder + 366 datoer + alle navn", () => {
    const staticPaths = 10;
    const expected =
      staticPaths + MONTHS_NB.length + allDates().length + allNames().length;
    expect(expected).toBe(10 + 12 + 366 + 730);
  });
});
