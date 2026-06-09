import rawData from "@/data/navnedager.json";
import { dateKey, dateSlug, monthName, allDates } from "@/lib/dates";

const DATA = rawData as Record<string, string[]>;

export type NameEntry = {
  name: string;
  slug: string;
  month: number;
  day: number;
};

export type DayEntry = {
  month: number;
  day: number;
  names: string[];
};

/** Transliterer norske/diakritiske tegn til URL-trygg ASCII. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/[éèê]/g, "e")
    .replace(/[áàâ]/g, "a")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Navnene som har navnedag på en gitt dato. */
export function namesForDate(month: number, day: number): string[] {
  return DATA[dateKey(month, day)] ?? [];
}

// ---- Forhåndsbygde indekser (kjøres én gang ved import) ----

const nameIndex: NameEntry[] = (() => {
  const entries: NameEntry[] = [];
  const usedSlugs = new Set<string>();
  for (const { month, day } of allDates()) {
    for (const name of namesForDate(month, day)) {
      let slug = slugify(name);
      // Kollisjonsvakt slik at statiske ruter alltid er unike.
      if (usedSlugs.has(slug)) {
        let i = 2;
        while (usedSlugs.has(`${slug}-${i}`)) i++;
        slug = `${slug}-${i}`;
      }
      usedSlugs.add(slug);
      entries.push({ name, slug, month, day });
    }
  }
  entries.sort((a, b) => a.name.localeCompare(b.name, "nb"));
  return entries;
})();

const slugToEntry = new Map(nameIndex.map((e) => [e.slug, e]));

/** Alle navn (alfabetisk), med slug og dato. */
export function allNames(): NameEntry[] {
  return nameIndex;
}

/** Slå opp ett navn via slug. */
export function nameBySlug(slug: string): NameEntry | undefined {
  return slugToEntry.get(slug);
}

/** Slug for et navn (samme som i indeksen, med kollisjonsvakt). */
export function nameToSlug(name: string): string | undefined {
  return nameIndex.find((e) => e.name === name)?.slug;
}

/** Totalt antall navn i kalenderen. */
export function nameCount(): number {
  return nameIndex.length;
}

/** Alle dager med navn (utelater tomme dager). */
export function allDayEntries(): DayEntry[] {
  return allDates()
    .map(({ month, day }) => ({ month, day, names: namesForDate(month, day) }))
    .filter((d) => d.names.length > 0);
}

/** Alle dager i en gitt måned (også tomme), sortert på dag. */
export function daysInMonthEntries(month: number): DayEntry[] {
  return allDates()
    .filter((d) => d.month === month)
    .map(({ day }) => ({ month, day, names: namesForDate(month, day) }));
}

/** Andre navn som deler samme dato (ekskluderer navnet selv). */
export function relatedNames(entry: NameEntry): NameEntry[] {
  return nameIndex.filter(
    (e) => e.month === entry.month && e.day === entry.day && e.slug !== entry.slug
  );
}

/** Lett datasett til klientsøk: navn + slug + dato-slug + lesbar dato. */
export type SearchItem = {
  n: string; // navn
  s: string; // navn-slug
  d: string; // dato-slug
  l: string; // lesbar dato, f.eks. "9. juni"
};

export function searchIndex(): SearchItem[] {
  return nameIndex.map((e) => ({
    n: e.name,
    s: e.slug,
    d: dateSlug(e.month, e.day),
    l: `${e.day}. ${monthName(e.month)}`,
  }));
}
