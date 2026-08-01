import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { getNameDayContext, daysFrom } from "@/lib/nameday-context";
import { nameToSlug, nameBySlug } from "@/lib/navnedager";

// Speiler forsidens logikk: stripen starter I DAG og viser 7 dager.
function strip(now: Date) {
  const ctx = getNameDayContext(now);
  const days = daysFrom(ctx.year, ctx.today.month, ctx.today.day, 7);
  return {
    ctx,
    days,
    items: days.flatMap((d) =>
      d.names.map((n) => ({ name: n, path: `/navn/${nameToSlug(n) ?? ""}` }))
    ),
  };
}

const at = (iso: string) => new Date(`${iso}T12:00:00Z`);
const page = readFileSync(
  new URL("../../app/page.tsx", import.meta.url),
  "utf8"
);
const calendarStrip = readFileSync(
  new URL("../../components/CalendarStrip.tsx", import.meta.url),
  "utf8"
);

describe("forsiden viser i dag til og med dag +6", () => {
  it("første dag er i dag, siste er dag +6", () => {
    const { days } = strip(at("2026-08-01"));
    expect(days).toHaveLength(7);
    expect(days[0].isoDate).toBe("2026-08-01");
    expect(days[1].isoDate).toBe("2026-08-02");
    expect(days[6].isoDate).toBe("2026-08-07");
  });

  it("inneholder ingen tidligere dager", () => {
    const { ctx, days } = strip(at("2026-08-01"));
    for (const d of days) {
      expect(d.isoDate >= ctx.todayIsoDate, `${d.isoDate} er før i dag`).toBe(true);
    }
    expect(days.map((d) => d.isoDate)).not.toContain("2026-07-31");
    expect(days.map((d) => d.isoDate)).not.toContain("2026-07-29");
  });

  it("dag 2 i stripen er alltid morgendagen", () => {
    for (const iso of ["2026-08-01", "2026-12-31", "2028-02-28", "2026-01-31"]) {
      const { ctx, days } = strip(at(iso));
      expect(days[1].isoDate).toBe(ctx.tomorrow.isoDate);
    }
  });

  it("håndterer månedsskifte", () => {
    const { days } = strip(at("2026-07-31"));
    expect(days[0].isoDate).toBe("2026-07-31");
    expect(days[1].isoDate).toBe("2026-08-01");
    expect(days[6].isoDate).toBe("2026-08-06");
  });

  it("håndterer årsskifte", () => {
    const { days } = strip(at("2026-12-31"));
    expect(days[0].isoDate).toBe("2026-12-31");
    expect(days[1].isoDate).toBe("2027-01-01");
    expect(days[6].isoDate).toBe("2027-01-06");
  });

  it("håndterer skuddår", () => {
    const { days } = strip(at("2028-02-28"));
    expect(days[1].isoDate).toBe("2028-02-29");
    expect(days[2].isoDate).toBe("2028-03-01");
    // vanlig år hopper rett til 1. mars
    expect(strip(at("2026-02-28")).days[1].isoDate).toBe("2026-03-01");
  });
});

describe("ItemList matcher de synlige syv dagene", () => {
  it("ett element per synlig navn, i samme rekkefølge", () => {
    const { days, items } = strip(at("2026-08-01"));
    expect(items.map((i) => i.name)).toEqual(days.flatMap((d) => d.names));
  });

  it("ingen tidligere dager og ingen dager kun i schema", () => {
    const { ctx, days, items } = strip(at("2026-08-01"));
    const visible = new Set(days.flatMap((d) => d.names));
    for (const i of items) expect(visible.has(i.name)).toBe(true);
    expect(days[0].isoDate).toBe(ctx.todayIsoDate);
  });

  it("alle URLer peker til en navneside som finnes", () => {
    for (const iso of ["2026-08-01", "2026-12-31", "2028-02-29"]) {
      for (const i of strip(at(iso)).items) {
        expect(nameBySlug(i.path.replace("/navn/", ""))).toBeDefined();
      }
    }
  });

  it("bruker ingen sammenslåtte etiketter som «Peder, Petra»", () => {
    for (const i of strip(at("2026-08-01")).items) {
      expect(i.name).not.toContain(",");
    }
  });

  it("inkluderer ikke plassholderen «Ingen navnedag»", () => {
    // 1. januar er tom i datasettet
    const names = strip(at("2026-01-01")).items.map((i) => i.name);
    expect(names).not.toContain("Ingen navnedag");
  });
});

describe("forsidens markup", () => {
  it("stripen starter i dag (ikke tre dager tilbake)", () => {
    expect(page).toContain("const stripStart = today;");
    expect(page).not.toContain("today.day, -3");
  });

  it("overskriften er «De neste 7 dagene»", () => {
    expect(page).toContain("De neste 7 dagene");
    expect(page).not.toContain("Navnedager denne uken");
  });

  it("den gamle «I morgen»-boksen er fjernet fra heroen", () => {
    expect(page).not.toContain("border-cream/40");
    expect(page).not.toContain("tomorrowNames");
  });

  it("lenker fortsatt til /denne-uken med presis tekst", () => {
    expect(page).toContain('href="/denne-uken"');
    expect(page).toContain("Se hele denne uken");
  });

  it("kalenderstripen får både i dag- og i morgen-markering", () => {
    expect(page).toContain("tomorrow={tomorrow}");
    expect(page).toContain("highlight={today}");
  });

  it("datonavigasjonspilene er fjernet fra forsiden", () => {
    expect(page).not.toContain('aria-label="Forrige dag"');
    expect(page).not.toContain('aria-label="Neste dag"');
    expect(page).not.toContain("‹");
    expect(page).not.toContain("›");
  });

  it("forrige/neste finnes fortsatt på de permanente datosidene", () => {
    const datePage = readFileSync(
      new URL("../../app/dato/[slug]/page.tsx", import.meta.url),
      "utf8"
    );
    expect(datePage).toContain("Forrige dag");
    expect(datePage).toContain("Neste dag");
  });
});

describe("«I morgen»-merket lenker til /i-morgen", () => {
  it("CalendarStrip rendrer en lenke til /i-morgen for morgendagen", () => {
    expect(calendarStrip).toContain('href="/i-morgen"');
    expect(calendarStrip).toContain("I morgen");
    expect(calendarStrip).toContain("I dag");
  });

  it("merkelappene ligger utenfor kortlenken (ingen nøstede lenker)", () => {
    const cardLink = calendarStrip.indexOf("href={`/dato/");
    const closeCard = calendarStrip.indexOf("</Link>", cardLink);
    const tomorrowLink = calendarStrip.indexOf('href="/i-morgen"');
    expect(tomorrowLink).toBeGreaterThan(closeCard);
  });
});
