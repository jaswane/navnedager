import { describe, it, expect } from "vitest";
import {
  normalizeName,
  slugify,
  nameBySlug,
  searchIndex,
} from "@/lib/navnedager";

describe("normalizeName – bevarer norske bokstaver", () => {
  it("små bokstaver og trim, men beholder æ/ø/å", () => {
    expect(normalizeName("  Bjørn ")).toBe("bjørn");
    expect(normalizeName("KÅRE")).toBe("kåre");
    expect(normalizeName("Æsa")).toBe("æsa");
  });
  it("skiller Søren og Soren (konverterer IKKE ø til o)", () => {
    expect(normalizeName("Søren")).not.toBe(normalizeName("Soren"));
  });
  it("er NFC-normalisert", () => {
    // "å" satt sammen av a + ring (NFD) skal normaliseres til én kodepunkt
    const nfd = "Å".normalize("NFD"); // Å i NFD
    expect(normalizeName(nfd)).toBe("å");
  });
});

describe("slugify – tolerant URL-nøkkel", () => {
  it("transliterer norske og diakritiske tegn", () => {
    expect(slugify("Bjørn")).toBe("bjorn");
    expect(slugify("Kåre")).toBe("kare");
    expect(slugify("Æsa")).toBe("aesa");
  });
  it("håndterer mellomrom og bindestrek", () => {
    expect(slugify("Anne Marie")).toBe("anne-marie");
    expect(slugify("Anne-Marie")).toBe("anne-marie");
  });
});

describe("navneoppslag", () => {
  it("eksakt slug gir riktig navn", () => {
    expect(nameBySlug("kolbein")?.name).toBe("Kolbein");
  });
  it("ukjent slug gir undefined (ingen fuzzy-omdirigering)", () => {
    expect(nameBySlug("finnesikke")).toBeUndefined();
  });
  it("søkeindeksen har normalisert primærnøkkel som bevarer æ/ø/å", () => {
    const items = searchIndex();
    const bjorn = items.find((i) => i.n === "Bjørn");
    expect(bjorn?.k).toBe("bjørn");
    expect(bjorn?.s).toBe("bjorn");
  });
});
