// Norske dato-hjelpere. Ingen eksterne avhengigheter.

export const MONTHS_NB = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
] as const;

export const WEEKDAYS_NB = [
  "søndag",
  "mandag",
  "tirsdag",
  "onsdag",
  "torsdag",
  "fredag",
  "lørdag",
] as const;

/** Antall dager i hver måned (skuddår-trygt for visning – februar = 29). */
export const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export type DateKey = `${number}-${number}`; // "M-D" uten ledende nuller, f.eks. "6-9"

/** Lager nøkkelen "M-D" som matcher datafilen. */
export function dateKey(month: number, day: number): string {
  return `${month}-${day}`;
}

/** Navnet på måneden, f.eks. 6 -> "juni". */
export function monthName(month: number): string {
  return MONTHS_NB[month - 1] ?? "";
}

/** Stor forbokstav, f.eks. "juni" -> "Juni". */
export function cap(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Måned med stor forbokstav, f.eks. 6 -> "Juni". */
export function monthNameCap(month: number): string {
  return cap(monthName(month));
}

/** Måned-slug -> månednummer, f.eks. "juni" -> 6. Returnerer null hvis ukjent. */
export function monthFromSlug(slug: string): number | null {
  const idx = MONTHS_NB.indexOf(slug.toLowerCase() as (typeof MONTHS_NB)[number]);
  return idx === -1 ? null : idx + 1;
}

/** Dato-slug, f.eks. (6, 9) -> "9-juni". */
export function dateSlug(month: number, day: number): string {
  return `${day}-${monthName(month)}`;
}

/** Parser en dato-slug som "9-juni" til { month, day }, eller null. */
export function parseDateSlug(slug: string): { month: number; day: number } | null {
  const match = slug.match(/^(\d{1,2})-([a-zæøå]+)$/i);
  if (!match) return null;
  const day = Number(match[1]);
  const month = monthFromSlug(match[2]);
  if (month === null) return null;
  if (day < 1 || day > DAYS_IN_MONTH[month - 1]) return null;
  return { month, day };
}

/** Lang, lesbar dato: (6, 9) -> "9. juni". */
export function formatDayMonth(month: number, day: number): string {
  return `${day}. ${monthName(month)}`;
}

/** Full dato med år: (2026, 6, 9) -> "9. juni 2026". */
export function formatFullDate(year: number, month: number, day: number): string {
  return `${day}. ${monthName(month)} ${year}`;
}

/** ISO-ukenummer for en gitt dato. */
export function isoWeek(year: number, month: number, day: number): number {
  const d = new Date(Date.UTC(year, month - 1, day));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Ukedag (norsk) for en gitt dato. */
export function weekdayName(year: number, month: number, day: number): string {
  const d = new Date(Date.UTC(year, month - 1, day));
  return WEEKDAYS_NB[d.getUTCDay()];
}

/**
 * Dagens dato i Europa/Oslo, uavhengig av brukerens/serverens tidssone.
 * Tar valgfri `date` slik at logikken kan testes deterministisk og
 * en preview-dato kan injiseres. Bruker aldri UTC-datoen som norsk dag.
 */
export function osloToday(
  date: Date = new Date()
): { year: number; month: number; day: number } {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/** Legger til et antall dager og returnerer { year, month, day }. */
export function addDays(
  year: number,
  month: number,
  day: number,
  amount: number
): { year: number; month: number; day: number } {
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() + amount);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/** Alle (måned, dag)-par i kalenderåret, inkludert 29. februar. */
export function allDates(): { month: number; day: number }[] {
  const out: { month: number; day: number }[] = [];
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= DAYS_IN_MONTH[m - 1]; d++) {
      out.push({ month: m, day: d });
    }
  }
  return out;
}
