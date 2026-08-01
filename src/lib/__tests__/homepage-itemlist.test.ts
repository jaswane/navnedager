import { describe, it, expect } from "vitest";
import { getNameDayContext, daysFrom } from "@/lib/nameday-context";
import { addDays } from "@/lib/dates";
import { nameToSlug, nameBySlug } from "@/lib/navnedager";

// Speiler forsidens logikk: stripen starter 3 dager før i dag og viser 7 dager.
function stripItemsFor(now: Date) {
  const ctx = getNameDayContext(now);
  const s = addDays(ctx.year, ctx.today.month, ctx.today.day, -3);
  const days = daysFrom(s.year, s.month, s.day, 7);
  return {
    days,
    items: days.flatMap((d) =>
      d.names.map((n) => ({ name: n, path: `/navn/${nameToSlug(n) ?? ""}` }))
    ),
  };
}

const at = (iso: string) => new Date(`${iso}T12:00:00Z`);

describe("forsidens ItemList samsvarer med synlig kalenderstripe", () => {
  it("bruker nøyaktig de 7 dagene stripen viser (i dag −3 … +3)", () => {
    const { days } = stripItemsFor(at("2026-08-01"));
    expect(days).toHaveLength(7);
    expect(days[0].isoDate).toBe("2026-07-29");
    expect(days[3].isoDate).toBe("2026-08-01"); // i dag er midtstilt
    expect(days[6].isoDate).toBe("2026-08-04");
  });

  it("inneholder ingen dag utenfor stripen (ingen datoer kun i schema)", () => {
    const { days } = stripItemsFor(at("2026-08-01"));
    const iso = days.map((d) => d.isoDate);
    // Dagene den gamle implementasjonen feilaktig la inn:
    expect(iso).not.toContain("2026-08-05");
    expect(iso).not.toContain("2026-08-06");
    expect(iso).not.toContain("2026-08-07");
  });

  it("ett element per synlig navn, og hvert navn finnes i dagens navneliste", () => {
    const { days, items } = stripItemsFor(at("2026-08-01"));
    const visible = days.flatMap((d) => d.names);
    expect(items.map((i) => i.name)).toEqual(visible);
    expect(items.length).toBe(visible.length);
  });

  it("bruker ingen sammenslåtte etiketter som «Peder, Petra»", () => {
    const { items } = stripItemsFor(at("2026-08-01"));
    for (const i of items) expect(i.name).not.toContain(",");
  });

  it("inkluderer ikke plassholderen «Ingen navnedag» (ikke synlig som navn)", () => {
    const { items } = stripItemsFor(at("2026-01-01")); // 1. jan er tom
    expect(items.map((i) => i.name)).not.toContain("Ingen navnedag");
  });

  it("alle element-URLer peker til en navneside som finnes", () => {
    for (const iso of ["2026-08-01", "2026-12-31", "2028-02-29"]) {
      const { items } = stripItemsFor(at(iso));
      for (const i of items) {
        const slug = i.path.replace("/navn/", "");
        expect(slug, `tom slug for ${i.name}`).not.toBe("");
        expect(nameBySlug(slug), `ukjent rute ${i.path}`).toBeDefined();
      }
    }
  });

  it("håndterer måneds- og årsskifte i stripen", () => {
    const { days } = stripItemsFor(at("2027-01-01"));
    expect(days[0].isoDate).toBe("2026-12-29");
    expect(days[6].isoDate).toBe("2027-01-04");
  });
});
