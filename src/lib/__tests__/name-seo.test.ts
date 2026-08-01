import { describe, it, expect } from "vitest";
import { nameMetaDescription, joinNames } from "@/lib/name-description";
import { getNameDayYearInfo } from "@/lib/nameday-context";
import { allNames, relatedNames } from "@/lib/navnedager";

describe("joinNames", () => {
  it("håndterer 0, 1, 2 og 3 navn", () => {
    expect(joinNames([])).toBe("");
    expect(joinNames(["Anders"])).toBe("Anders");
    expect(joinNames(["Anders", "Ana"])).toBe("Anders og Ana");
    expect(joinNames(["A", "B", "C"])).toBe("A, B og C");
  });
});

describe("meta description for navnesider", () => {
  it("starter med det direkte svaret og nevner hvem datoen deles med", () => {
    const d = nameMetaDescription("Andreas", 11, 30, ["Anders"]);
    expect(d.startsWith("Andreas har navnedag 30. november")).toBe(true);
    expect(d).toContain("sammen med Anders");
  });

  it("gjentar ikke spørsmålet i andre setning", () => {
    const d = nameMetaDescription("Andreas", 11, 30, ["Anders"]);
    expect(d).not.toContain("Se hvilken dato");
    // Navnet skal kun stå én gang.
    expect(d.match(/Andreas/g)).toHaveLength(1);
  });

  it("fungerer uten andre navn på datoen", () => {
    const d = nameMetaDescription("Solo", 1, 1, []);
    expect(d).toBe(
      "Solo har navnedag 1. januar. Se hvilken ukedag og uke datoen faller på, og utforsk hele den norske navnedagskalenderen."
    );
  });

  it("lover ikke innhold som ikke finnes på siden", () => {
    const d = nameMetaDescription("Andreas", 11, 30, ["Anders"]);
    // Navnesiden har ingen liste over kommende navnedager.
    expect(d).not.toContain("kommende navnedager");
  });

  it("bøyer «sammen med» grammatisk for 1, 2 og 3 delte navn", () => {
    expect(nameMetaDescription("A", 6, 9, ["B"])).toContain("sammen med B.");
    expect(nameMetaDescription("A", 6, 9, ["B", "C"])).toContain(
      "sammen med B og C."
    );
    expect(nameMetaDescription("A", 6, 9, ["B", "C", "D"])).toContain(
      "sammen med B, C og D."
    );
  });

  it("alle 730 navn får en description på 120–155 tegn", () => {
    for (const e of allNames()) {
      const others = relatedNames(e).map((r) => r.name);
      const d = nameMetaDescription(e.name, e.month, e.day, others);
      expect(d.length, `${e.name}: ${d.length} tegn`).toBeGreaterThanOrEqual(120);
      expect(d.length, `${e.name}: ${d.length} tegn`).toBeLessThanOrEqual(155);
    }
  });

  it("håndterer navn med Æ, Ø og Å", () => {
    for (const n of ["Bjørn", "Kåre", "Åsta"]) {
      const e = allNames().find((x) => x.name === n);
      if (!e) continue;
      const d = nameMetaDescription(e.name, e.month, e.day, []);
      expect(d).toContain(n);
    }
  });
});

describe("getNameDayYearInfo – ukedag og ukenummer", () => {
  const today = (y: number, m: number, d: number) => ({ year: y, month: m, day: d });

  it("Andreas 30. november 2026 er en mandag i uke 49", () => {
    const i = getNameDayYearInfo(11, 30, today(2026, 8, 1));
    expect(i.existsThisYear).toBe(true);
    expect(i.weekday).toBe("mandag");
    expect(i.week).toBe(49);
    expect(i.nextIsLaterYear).toBe(false); // ligger fram i tid i år
  });

  it("Bjørn 18. juni 2026 er en torsdag", () => {
    const i = getNameDayYearInfo(6, 18, today(2026, 8, 1));
    expect(i.weekday).toBe("torsdag");
    // datoen er passert -> neste forekomst er 2027
    expect(i.nextIsLaterYear).toBe(true);
    expect(i.nextYear).toBe(2027);
  });

  it("dato som ikke er passert gir neste forekomst i år", () => {
    const i = getNameDayYearInfo(12, 24, today(2026, 8, 1));
    expect(i.nextYear).toBe(2026);
    expect(i.nextIsLaterYear).toBe(false);
  });

  it("årsskifte: 1. januar sett fra 31. desember gir neste år", () => {
    const i = getNameDayYearInfo(1, 1, today(2026, 12, 31));
    expect(i.nextYear).toBe(2027);
    expect(i.nextIsLaterYear).toBe(true);
  });

  it("i dag er navnedagen -> neste forekomst er i år", () => {
    const i = getNameDayYearInfo(8, 1, today(2026, 8, 1));
    expect(i.nextYear).toBe(2026);
    expect(i.nextIsLaterYear).toBe(false);
  });

  it("29. februar finnes ikke i vanlig år, og hopper til neste skuddår", () => {
    const i = getNameDayYearInfo(2, 29, today(2026, 8, 1));
    expect(i.existsThisYear).toBe(false);
    expect(i.nextYear).toBe(2028);
    expect(i.nextIsLaterYear).toBe(true);
  });

  it("29. februar i skuddår finnes og har riktig ukedag", () => {
    const i = getNameDayYearInfo(2, 29, today(2028, 1, 1));
    expect(i.existsThisYear).toBe(true);
    expect(i.weekday).toBe("tirsdag");
    expect(i.nextYear).toBe(2028);
  });

  it("hopper over århundre-unntaket (1900/2100 er ikke skuddår)", () => {
    const i = getNameDayYearInfo(2, 29, today(2096, 3, 1));
    expect(i.nextYear).toBe(2104); // 2100 er ikke skuddår
  });
});
