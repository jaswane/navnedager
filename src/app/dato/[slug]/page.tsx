import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import CurrentYearDate from "@/components/CurrentYearDate";
import { CalendarMark } from "@/components/illustrations";
import { namesForDate, nameToSlug } from "@/lib/navnedager";
import {
  allDates,
  parseDateSlug,
  dateSlug,
  formatDayMonth,
  monthName,
  addDays,
} from "@/lib/dates";
import { buildMetadata } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema, itemListSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return allDates().map((d) => ({ slug: dateSlug(d.month, d.day) }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseDateSlug(slug);
  if (!parsed) return {};
  const date = formatDayMonth(parsed.month, parsed.day);
  const names = namesForDate(parsed.month, parsed.day);
  const list =
    names.length > 0 ? names.join(", ") : "ingen navn i navnedagskalenderen";
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
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

      <div className="flex items-center gap-2 text-teal-deep">
        <CalendarMark className="h-7 w-7" />
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-ink-soft">
          Dato
        </span>
      </div>

      <h1 className="mt-4 font-display text-6xl font-semibold leading-none sm:text-8xl">
        {date}
      </h1>

      {/* Kort svar først */}
      <p className="mt-6 text-2xl text-ink-soft">
        {names.length > 0 ? (
          <>
            <strong className="text-ink">{names.join(", ")}</strong> har navnedag{" "}
            {date}.
          </>
        ) : (
          <>Ingen navn har navnedag den {date}.</>
        )}
      </p>

      <div className="mt-6 rounded-2xl border-2 border-line bg-paper p-5">
        <CurrentYearDate month={month} day={day} />
      </div>

      {/* Navnene */}
      {names.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-2xl font-semibold">
            Navn med navnedag {date}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {names.map((n, i) => {
              const s = nameToSlug(n);
              const accent = ["bg-coral", "bg-mustard", "bg-teal", "bg-forest"][
                i % 4
              ];
              return (
                <li key={n}>
                  <Link
                    href={`/navn/${s}`}
                    className="flex items-center gap-4 rounded-2xl border-2 border-ink bg-paper p-4 transition-transform hover:-translate-y-0.5"
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${accent} font-display text-xl font-bold text-ink`}
                    >
                      {n.charAt(0)}
                    </span>
                    <span className="font-display text-xl font-semibold">{n}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Relaterte datoer + måned */}
      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold">Bla i kalenderen</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href={`/dato/${dateSlug(prev.month, prev.day)}`}
            className="rounded-2xl border-2 border-ink bg-paper px-5 py-4 transition-transform hover:-translate-y-0.5"
          >
            <span className="block text-xs font-bold uppercase tracking-widest text-ink-soft">
              Forrige dag
            </span>
            <span className="font-display text-lg font-semibold">
              {formatDayMonth(prev.month, prev.day)}
            </span>
          </Link>
          <Link
            href={`/maned/${monthName(month)}`}
            className="rounded-2xl border-2 border-ink bg-mustard/20 px-5 py-4 transition-transform hover:-translate-y-0.5"
          >
            <span className="block text-xs font-bold uppercase tracking-widest text-ink-soft">
              Hele måneden
            </span>
            <span className="font-display text-lg font-semibold capitalize">
              {monthName(month)}
            </span>
          </Link>
          <Link
            href={`/dato/${dateSlug(next.month, next.day)}`}
            className="rounded-2xl border-2 border-ink bg-paper px-5 py-4 text-right transition-transform hover:-translate-y-0.5"
          >
            <span className="block text-xs font-bold uppercase tracking-widest text-ink-soft">
              Neste dag
            </span>
            <span className="font-display text-lg font-semibold">
              {formatDayMonth(next.month, next.day)}
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
