import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import CurrentYearDate from "@/components/CurrentYearDate";
import LinkCard from "@/components/LinkCard";
import { DeskCalendar } from "@/components/illustrations";
import { namesForDate, nameToSlug } from "@/lib/navnedager";
import {
  allDates,
  parseDateSlug,
  dateSlug,
  formatDayMonth,
  monthName,
  monthNameCap,
  addDays,
} from "@/lib/dates";
import { buildMetadata } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema, itemListSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return allDates().map((d) => ({ slug: dateSlug(d.month, d.day) }));
}

type Params = { params: Promise<{ slug: string }> };

/** "Kolbein og Kolbjørn" / "A, B og C". */
function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} og ${names[names.length - 1]}`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseDateSlug(slug);
  if (!parsed) return {};
  const date = formatDayMonth(parsed.month, parsed.day);
  const names = namesForDate(parsed.month, parsed.day);
  const list = names.length > 0 ? joinNames(names) : "ingen navn";
  return buildMetadata({
    title: `Navnedag ${date}`,
    description: `${date}: ${list} har navnedag. Se hvem som har navnedag den ${date} i den norske navnedagskalenderen.`,
    path: `/dato/${dateSlug(parsed.month, parsed.day)}`,
  });
}

// Fast skuddårsreferanse for nabodatoer (håndterer 29. februar).
const REF_YEAR = 2024;

export default async function DatePage({ params }: Params) {
  const { slug } = await params;
  const parsed = parseDateSlug(slug);
  if (!parsed) notFound();

  const { month, day } = parsed;
  const date = formatDayMonth(month, day);
  const names = namesForDate(month, day);
  const prev = addDays(REF_YEAR, month, day, -1);
  const next = addDays(REF_YEAR, month, day, 1);

  const crumbs = [
    { name: "Forside", path: "/" },
    { name: "Alle navnedager", path: "/alle-navnedager" },
    { name: date, path: `/dato/${dateSlug(month, day)}` },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <JsonLd
        data={[
          webPageSchema({
            name: `Navnedag ${date}`,
            description: `Navnedager den ${date}.`,
            path: `/dato/${dateSlug(month, day)}`,
          }),
          breadcrumbSchema(crumbs),
          itemListSchema({
            name: `Navnedager ${date}`,
            items: names.map((n) => ({
              name: n,
              path: `/navn/${nameToSlug(n) ?? ""}`,
            })),
          }),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      {/* Tittel + kort svar, sentrert */}
      <div className="mt-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink-soft">
          Dato
        </p>
        <h1 className="mt-2 font-display text-6xl font-extrabold tracking-tight sm:text-7xl">
          {date}
        </h1>
        <p className="mt-4 text-xl text-ink-soft">
          {names.length > 0 ? (
            <>
              <span className="font-semibold text-ink">{joinNames(names)}</span>{" "}
              har navnedag {date}.
            </>
          ) : (
            <>Ingen navn har navnedag den {date}.</>
          )}
        </p>
      </div>

      {/* Datoboks */}
      <p className="infobox mx-auto mt-7 max-w-md text-center font-semibold text-ink">
        <CurrentYearDate month={month} day={day} variant="stamp" />
      </p>

      {/* Navnebrikker */}
      {names.length > 0 && (
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {names.map((n) => (
            <Link
              key={n}
              href={`/navn/${nameToSlug(n)}`}
              className="rounded-full border border-line bg-paper px-6 py-2.5 font-display text-lg font-bold transition-colors hover:border-coral hover:text-coral-deep"
            >
              {n}
            </Link>
          ))}
        </div>
      )}

      {/* Naviger i kalenderen */}
      <div className="mx-auto mt-9 flex max-w-md flex-col gap-3">
        <LinkCard
          href={`/dato/${dateSlug(prev.month, prev.day)}`}
          label="Forrige dag"
          sublabel={formatDayMonth(prev.month, prev.day)}
          icon={<span className="text-lg">‹</span>}
        />
        <LinkCard
          href={`/dato/${dateSlug(next.month, next.day)}`}
          label="Neste dag"
          sublabel={formatDayMonth(next.month, next.day)}
          icon={<span className="text-lg">›</span>}
        />
        <LinkCard
          href={`/maned/${monthName(month)}`}
          label={`Hele ${monthNameCap(month)}`}
          sublabel="Alle navnedager i måneden"
          icon={<DeskCalendar className="h-6 w-7" />}
        />
      </div>
    </div>
  );
}
