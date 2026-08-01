// Ren, testbar dagskontekst for Navnedager.no.
// Bygger utelukkende på det eksisterende datasettet + dato-hjelperne.
// Leser ALDRI miljøvariabler eller systemklokken direkte – dato injiseres.

import {
  osloToday,
  addDays,
  isoWeek,
  weekdayName,
} from "@/lib/dates";
import { namesForDate, nameCount } from "@/lib/navnedager";

export type DayInfo = {
  isoDate: string;
  year: number;
  month: number;
  day: number;
  names: string[];
};

export type NameDaySpotlightKey =
  | "names-today"
  | "single-name-today"
  | "no-names-today"
  | "data-unavailable";

export interface NameDayContext {
  todayIsoDate: string;
  year: number;
  today: DayInfo;
  todayWeekday: string;
  todayWeek: number;
  tomorrow: DayInfo;
  upcomingSevenDays: DayInfo[];
  isLeapDay: boolean;
  dataAvailable: boolean;
  spotlight: NameDaySpotlightKey;
}

function isoDate(year: number, month: number, day: number): string {
  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
}

function dayInfo(year: number, month: number, day: number): DayInfo {
  return { isoDate: isoDate(year, month, day), year, month, day, names: namesForDate(month, day) };
}

/**
 * Dagene en kalenderstripe viser, fra og med (year, month, day).
 * Brukes både til strukturert data og som fasit for hva som faktisk vises,
 * slik at schema og synlig innhold ikke kan komme ut av synk.
 */
export function daysFrom(
  year: number,
  month: number,
  day: number,
  count: number
): DayInfo[] {
  return Array.from({ length: count }, (_, i) => {
    const d = addDays(year, month, day, i);
    return dayInfo(d.year, d.month, d.day);
  });
}

/** Velger forsidens hovedstatus ut fra dagens navn og datatilgjengelighet. */
export function getNameDaySpotlightKey(
  names: string[],
  dataAvailable: boolean
): NameDaySpotlightKey {
  if (!dataAvailable) return "data-unavailable";
  if (names.length === 0) return "no-names-today";
  if (names.length === 1) return "single-name-today";
  return "names-today";
}

/**
 * Bygger dagskonteksten fra en eksplisitt dato (default = nå).
 * Datoen tolkes alltid i Europe/Oslo via osloToday, slik at norsk dato styrer.
 */
export function getNameDayContext(now: Date = new Date()): NameDayContext {
  const dataAvailable = nameCount() > 0;
  const t = osloToday(now);

  const today = dayInfo(t.year, t.month, t.day);
  const tm = addDays(t.year, t.month, t.day, 1);
  const tomorrow = dayInfo(tm.year, tm.month, tm.day);

  const upcomingSevenDays = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(t.year, t.month, t.day, i);
    return dayInfo(d.year, d.month, d.day);
  });

  return {
    todayIsoDate: today.isoDate,
    year: t.year,
    today,
    todayWeekday: weekdayName(t.year, t.month, t.day),
    todayWeek: isoWeek(t.year, t.month, t.day),
    tomorrow,
    upcomingSevenDays,
    isLeapDay: t.month === 2 && t.day === 29,
    dataAvailable,
    spotlight: getNameDaySpotlightKey(today.names, dataAvailable),
  };
}
