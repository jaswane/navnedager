import { describe, it, expect } from "vitest";
import verified from "@/data/navnetoppen-slugs.json";
import {
  navnetoppenLink,
  hasNavnetoppenPage,
  NAVNETOPPEN_OVERVIEW,
} from "@/lib/navnetoppen";
import { allNames } from "@/lib/navnedager";

// Navn som live-QA bekreftet gir 404 på Navnetoppen.
const KNOWN_404 = ["Kolbein", "Hild", "Agate", "Eilen", "Borgar", "Dagmar", "Halvdan"];

describe("Navnetoppen – verifisert kilde", () => {
  it("datafilen dokumenterer kilde, metode og genereringsdato", () => {
    const v = verified as Record<string, unknown>;
    expect(v._source).toBe("https://navnetoppen.no/sitemap.xml");
    expect(String(v._generated)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(v._script).toBe("scripts/build-navnetoppen-slugs.mjs");
    expect(Array.isArray(v.slugs)).toBe(true);
    expect((v.slugs as string[]).length).toBeGreaterThan(400);
  });
});

describe("Navnetoppen – dyplenker", () => {
  it("verifisert navn får dyplenke til sin egen side", () => {
    const link = navnetoppenLink("Bjørn", "bjorn");
    expect(link.verified).toBe(true);
    expect(link.href).toBe("https://navnetoppen.no/navn/bjorn");
    expect(link.label).toContain("Bjørn");
  });

  it.each(KNOWN_404)(
    "%s (kjent 404) får IKKE en antatt dyplenke",
    (name) => {
      const entry = allNames().find((e) => e.name === name);
      expect(entry, `fant ikke ${name} i navneindeksen`).toBeDefined();
      const link = navnetoppenLink(entry!.name, entry!.slug);
      expect(link.verified).toBe(false);
      expect(link.href).toBe(NAVNETOPPEN_OVERVIEW);
      expect(link.href).not.toContain("/navn/");
    }
  );

  it("ingen navneside kan generere en lenke til en uverifisert /navn/-URL", () => {
    for (const e of allNames()) {
      const link = navnetoppenLink(e.name, e.slug);
      if (link.href.includes("navnetoppen.no/navn/")) {
        const slug = link.href.split("/navn/")[1];
        expect(hasNavnetoppenPage(slug), `uverifisert dyplenke: ${slug}`).toBe(true);
      }
    }
  });

  it("kolliderende slugs (Åslaug/Asmund/Asta) faller trygt tilbake", () => {
    for (const n of ["Åslaug", "Asmund", "Asta"]) {
      const e = allNames().find((x) => x.name === n);
      if (!e) continue;
      const link = navnetoppenLink(e.name, e.slug);
      if (!link.verified) expect(link.href).toBe(NAVNETOPPEN_OVERVIEW);
    }
  });

  it("fallback-lenken er en dokumentert oversiktsside, ikke en gjettet URL", () => {
    expect(NAVNETOPPEN_OVERVIEW).toBe("https://navnetoppen.no/populaere-navn");
  });
});
