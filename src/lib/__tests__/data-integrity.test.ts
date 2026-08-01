import { describe, it, expect } from "vitest";
import rawData from "@/data/navnedager.json";
import { DAYS_IN_MONTH, dateSlug, parseDateSlug } from "@/lib/dates";
import { allNames, nameBySlug, namesForDate } from "@/lib/navnedager";

const DATA = rawData as Record<string, string[]>;
const keys = Object.keys(DATA);

describe("dataintegritet – kalenderstruktur", () => {
  it("inneholder nøyaktig 366 datoer (inkl. 29. februar)", () => {
    expect(keys).toHaveLength(366);
  });

  it("29. februar finnes", () => {
    expect(DATA["2-29"]).toBeDefined();
  });

  it("alle nøkler har gyldig måned (1–12) og gyldig dag for måneden", () => {
    for (const key of keys) {
      const [m, d] = key.split("-").map(Number);
      expect(Number.isInteger(m)).toBe(true);
      expect(m).toBeGreaterThanOrEqual(1);
      expect(m).toBeLessThanOrEqual(12);
      expect(d).toBeGreaterThanOrEqual(1);
      expect(d, `ugyldig dag i ${key}`).toBeLessThanOrEqual(DAYS_IN_MONTH[m - 1]);
    }
  });

  it("ingen umulige datoer som 31. april eller 31. juni", () => {
    expect(DATA["4-31"]).toBeUndefined();
    expect(DATA["6-31"]).toBeUndefined();
    expect(DATA["2-30"]).toBeUndefined();
  });

  it("alle 366 kalenderdager er dekket, ingen duplikatnøkler", () => {
    const seen = new Set<string>();
    let expected = 0;
    for (let m = 1; m <= 12; m++) {
      for (let d = 1; d <= DAYS_IN_MONTH[m - 1]; d++) {
        expect(DATA[`${m}-${d}`], `mangler ${m}-${d}`).toBeDefined();
        expected++;
      }
    }
    for (const key of keys) {
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
    expect(keys.length).toBe(expected);
  });
});

describe("dataintegritet – navnelister", () => {
  it("hver oppføring er en liste uten tomme eller ujusterte navn", () => {
    for (const key of keys) {
      const names = DATA[key];
      expect(Array.isArray(names)).toBe(true);
      for (const name of names) {
        expect(name.length).toBeGreaterThan(0);
        expect(name, `mellomrom i "${name}" (${key})`).toBe(name.trim());
      }
    }
  });

  it("ingen duplikate navn på samme dato", () => {
    for (const key of keys) {
      const names = DATA[key];
      expect(new Set(names).size, `duplikat i ${key}`).toBe(names.length);
    }
  });
});

describe("dataintegritet – slugs og interne ruter", () => {
  it("alle navn har en unik, oppløsbar slug", () => {
    const entries = allNames();
    const slugs = new Set(entries.map((e) => e.slug));
    expect(slugs.size, "slug-kollisjon").toBe(entries.length);
    for (const e of entries) {
      const resolved = nameBySlug(e.slug);
      expect(resolved, `slug uten rute: ${e.slug}`).toBeDefined();
      expect(resolved!.name).toBe(e.name);
    }
  });

  it("navneindeksen samsvarer med primærdata (genereres fra datolisten)", () => {
    const fromData: string[] = [];
    for (const key of keys) {
      const [m, d] = key.split("-").map(Number);
      fromData.push(...namesForDate(m, d));
    }
    expect(allNames().length).toBe(fromData.length);
  });

  it("alle datoer gir en gyldig, reversibel dato-slug", () => {
    for (const key of keys) {
      const [m, d] = key.split("-").map(Number);
      expect(parseDateSlug(dateSlug(m, d))).toEqual({ month: m, day: d });
    }
  });
});

describe("dataintegritet – rapport (informativ)", () => {
  it("logger fordeling av navn per dato", () => {
    const counts = keys.map((k) => DATA[k].length);
    const zero = counts.filter((c) => c === 0).length;
    const one = counts.filter((c) => c === 1).length;
    const many = counts.filter((c) => c >= 2).length;
    const all = keys.flatMap((k) => DATA[k]);
    const dup = all.length - new Set(all).size;
    console.log(
      `[dataintegritet] datoer=${keys.length} navn=${all.length} unike=${new Set(all).size} ` +
        `| 0 navn=${zero} 1 navn=${one} flere=${many} | navn på flere datoer=${dup}`
    );
    expect(zero + one + many).toBe(keys.length);
  });
});
