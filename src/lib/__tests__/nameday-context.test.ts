import { describe, it, expect } from "vitest";
import {
  getNameDayContext,
  getNameDaySpotlightKey,
} from "@/lib/nameday-context";

// Preview-datoer tolkes kl. 12 UTC (som i serverlaget) -> stabil norsk dag.
const at = (iso: string) => new Date(`${iso}T12:00:00Z`);

describe("getNameDayContext – dagens navn", () => {
  it("flere navn i dag (9. juni = Kolbein og Kolbjørn)", () => {
    const ctx = getNameDayContext(at("2026-06-09"));
    expect(ctx.today.month).toBe(6);
    expect(ctx.today.day).toBe(9);
    expect(ctx.today.names).toEqual(["Kolbein", "Kolbjørn"]);
    expect(ctx.spotlight).toBe("names-today");
    expect(ctx.todayIsoDate).toBe("2026-06-09");
  });

  it("dato uten navn (1. januar) gir ærlig tomtilstand", () => {
    const ctx = getNameDayContext(at("2026-01-01"));
    expect(ctx.today.names).toEqual([]);
    expect(ctx.spotlight).toBe("no-names-today");
  });

  it("morgendagen etter en tom dag er korrekt (2. januar)", () => {
    const ctx = getNameDayContext(at("2026-01-01"));
    expect(ctx.tomorrow.month).toBe(1);
    expect(ctx.tomorrow.day).toBe(2);
    expect(ctx.tomorrow.names.length).toBeGreaterThan(0);
  });
});

describe("getNameDayContext – morgendag og neste syv dager", () => {
  it("morgendag ved månedsskifte (31.7 -> 1.8)", () => {
    const ctx = getNameDayContext(at("2026-07-31"));
    expect(ctx.tomorrow.isoDate).toBe("2026-08-01");
    expect(ctx.tomorrow.names).toEqual(["Peder", "Petra"]);
  });

  it("morgendag ved årsskifte (31.12 -> 1.1 neste år)", () => {
    const ctx = getNameDayContext(at("2026-12-31"));
    expect(ctx.tomorrow.isoDate).toBe("2027-01-01");
    expect(ctx.tomorrow.year).toBe(2027);
  });

  it("neste syv dager inkluderer i dag og krysser årsskiftet", () => {
    const ctx = getNameDayContext(at("2026-12-31"));
    expect(ctx.upcomingSevenDays).toHaveLength(7);
    expect(ctx.upcomingSevenDays[0].isoDate).toBe("2026-12-31");
    expect(ctx.upcomingSevenDays[1].isoDate).toBe("2027-01-01");
    expect(ctx.upcomingSevenDays[6].year).toBe(2027);
  });
});

describe("getNameDayContext – skuddår", () => {
  it("28.2.2026 er ikke skuddagen", () => {
    expect(getNameDayContext(at("2026-02-28")).isLeapDay).toBe(false);
  });
  it("29.2.2028 markeres som skuddag", () => {
    const ctx = getNameDayContext(at("2028-02-29"));
    expect(ctx.isLeapDay).toBe(true);
    expect(ctx.today.month).toBe(2);
    expect(ctx.today.day).toBe(29);
  });
  it("1.3.2028 er ikke skuddagen", () => {
    expect(getNameDayContext(at("2028-03-01")).isLeapDay).toBe(false);
  });
});

describe("getNameDaySpotlightKey", () => {
  it("data utilgjengelig", () => {
    expect(getNameDaySpotlightKey([], false)).toBe("data-unavailable");
  });
  it("ingen navn", () => {
    expect(getNameDaySpotlightKey([], true)).toBe("no-names-today");
  });
  it("ett navn", () => {
    expect(getNameDaySpotlightKey(["Kari"], true)).toBe("single-name-today");
  });
  it("flere navn", () => {
    expect(getNameDaySpotlightKey(["Kari", "Kaia"], true)).toBe("names-today");
  });
});
