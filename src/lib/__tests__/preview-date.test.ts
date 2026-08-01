import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getPreviewDate } from "@/lib/nameday-context.server";
import { osloToday } from "@/lib/dates";

const ORIGINAL = {
  preview: process.env.NAVNEDAGER_PREVIEW_DATE,
  vercel: process.env.VERCEL_ENV,
};

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  delete process.env.NAVNEDAGER_PREVIEW_DATE;
  delete process.env.VERCEL_ENV;
});

afterEach(() => {
  vi.restoreAllMocks();
  if (ORIGINAL.preview === undefined) delete process.env.NAVNEDAGER_PREVIEW_DATE;
  else process.env.NAVNEDAGER_PREVIEW_DATE = ORIGINAL.preview;
  if (ORIGINAL.vercel === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = ORIGINAL.vercel;
});

describe("getPreviewDate", () => {
  it("gyldig previewdato tolkes som riktig norsk dag", () => {
    process.env.NAVNEDAGER_PREVIEW_DATE = "2028-02-29";
    const date = getPreviewDate();
    expect(date).toBeInstanceOf(Date);
    expect(osloToday(date!)).toEqual({ year: 2028, month: 2, day: 29 });
  });

  it("ugyldig format faller trygt tilbake (undefined)", () => {
    process.env.NAVNEDAGER_PREVIEW_DATE = "2028/02/29";
    expect(getPreviewDate()).toBeUndefined();
  });

  it("dato som ikke finnes avvises (2026-02-30)", () => {
    process.env.NAVNEDAGER_PREVIEW_DATE = "2026-02-30";
    expect(getPreviewDate()).toBeUndefined();
  });

  it("ignoreres på produksjonsdomenet (VERCEL_ENV=production)", () => {
    process.env.VERCEL_ENV = "production";
    process.env.NAVNEDAGER_PREVIEW_DATE = "2028-02-29";
    expect(getPreviewDate()).toBeUndefined();
  });

  it("uten variabel returneres undefined", () => {
    expect(getPreviewDate()).toBeUndefined();
  });
});
