import { describe, it, expect } from "vitest";
import {
  osloToday,
  addDays,
  isoWeek,
  weekdayName,
  parseDateSlug,
  dateSlug,
  DAYS_IN_MONTH,
} from "@/lib/dates";

describe("osloToday – norsk dato uavhengig av UTC", () => {
  it("gir riktig norsk dato like før UTC-midnatt (vintertid, +01)", () => {
    // 23:30 UTC 1. jan = 00:30 norsk tid 2. jan
    expect(osloToday(new Date("2026-01-01T23:30:00Z"))).toEqual({
      year: 2026,
      month: 1,
      day: 2,
    });
  });

  it("gir riktig norsk dato like før UTC-midnatt (sommertid, +02)", () => {
    // 22:30 UTC 8. juni = 00:30 norsk tid 9. juni
    expect(osloToday(new Date("2026-06-08T22:30:00Z"))).toEqual({
      year: 2026,
      month: 6,
      day: 9,
    });
  });

  it("holder seg på samme norske dag midt på dagen", () => {
    expect(osloToday(new Date("2026-06-09T10:00:00Z"))).toEqual({
      year: 2026,
      month: 6,
      day: 9,
    });
  });
});

describe("addDays – måneds-, års- og skuddårsskifte", () => {
  it("årsskifte 31.12 -> 1.1", () => {
    expect(addDays(2026, 12, 31, 1)).toEqual({ year: 2027, month: 1, day: 1 });
  });
  it("månedsskifte 31.7 -> 1.8", () => {
    expect(addDays(2026, 7, 31, 1)).toEqual({ year: 2026, month: 8, day: 1 });
  });
  it("skuddår: 28.2.2028 -> 29.2.2028", () => {
    expect(addDays(2028, 2, 28, 1)).toEqual({ year: 2028, month: 2, day: 29 });
  });
  it("vanlig år: 28.2.2026 -> 1.3.2026", () => {
    expect(addDays(2026, 2, 28, 1)).toEqual({ year: 2026, month: 3, day: 1 });
  });
  it("skuddår: 29.2.2028 -> 1.3.2028", () => {
    expect(addDays(2028, 2, 29, 1)).toEqual({ year: 2028, month: 3, day: 1 });
  });
});

describe("isoWeek og weekdayName", () => {
  it("9. juni 2026 er tirsdag i uke 24", () => {
    expect(isoWeek(2026, 6, 9)).toBe(24);
    expect(weekdayName(2026, 6, 9)).toBe("tirsdag");
  });
  it("1. januar 2027 er fredag", () => {
    expect(weekdayName(2027, 1, 1)).toBe("fredag");
  });
});

describe("dato-slug round-trip", () => {
  it("parseDateSlug(dateSlug()) gir tilbake samme dato for hele året", () => {
    for (let m = 1; m <= 12; m++) {
      for (let d = 1; d <= DAYS_IN_MONTH[m - 1]; d++) {
        expect(parseDateSlug(dateSlug(m, d))).toEqual({ month: m, day: d });
      }
    }
  });
  it("avviser ugyldige datoer", () => {
    expect(parseDateSlug("31-april")).toBeNull();
    expect(parseDateSlug("30-februar")).toBeNull();
    expect(parseDateSlug("tull")).toBeNull();
  });
});
