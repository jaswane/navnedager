import type { Metadata } from "next";
import Link from "next/link";
import CalendarStrip from "@/components/CalendarStrip";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import JsonLd from "@/components/JsonLd";
import { DeskCalendar } from "@/components/illustrations";
import {
  addDays,
  isoWeek,
  weekdayName,
  formatDayMonth,
  cap,
  dateSlug,
} from "@/lib/dates";
import { namesForDate } from "@/lib/navnedager";
import { getServerNameDayContext } from "@/lib/nameday-context.server";
import { buildMetadata } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema, itemListSchema } from "@/lib/schema";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Navnedager denne uken",
  description:
    "Oversikt over alle navnedager denne uken i den norske navnedagskalenderen – dag for dag, mandag til søndag.",
  path: "/denne-uken",
});

export default function ThisWeekPage() {
  const ctx = getServerNameDayContext();
  const today = { year: ctx.year, month: ctx.today.month, day: ctx.today.day };
  const todayDate = new Date(Date.UTC(today.year, today.month - 1, today.day));
  const isoDow = todayDate.getUTCDay() || 7;
  const monday = addDays(today.year, today.month, today.day, 1 - isoDow);
  const sunday = addDays(monday.year, monday.month, monday.day, 6);
  const week = isoWeek(monday.year, monday.month, monday.day);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday.year, monday.month, monday.day, i);
    return {
      ...d,
      names: namesForDate(d.month, d.day),
      weekday: weekdayName(d.year, d.month, d.day),
      isToday:
        d.year === today.year && d.month === today.month && d.day === today.day,
    };
  });

  const listItems = days.flatMap((d) =>
    d.names.map((n) => ({ name: n, path: `/dato/${dateSlug(d.month, d.day)}` }))
  );

  const crumbs = [
    { name: "Forside", path: "/" },
    { name: "Denne uken", path: "/denne-uken" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd
        data={[
          webPageSchema({
            name: "Navnedager denne uken",
            description: "Alle navnedager denne uken.",
            path: "/denne-uken",
          }),
          breadcrumbSchema(crumbs),
          itemListSchema({ name: `Navnedager i uke ${week}`, items: listItems }),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="mt-6">
        <PageHeader
          eyebrow={`Uke ${week}`}
          title="Navnedager denne uken"
          lead={`Fra mandag ${formatDayMonth(monday.month, monday.day)} til søndag ${formatDayMonth(sunday.month, sunday.day)}.`}
          icon={<DeskCalendar className="h-8 w-8" />}
        />
      </div>

      <section className="mt-10">
        <CalendarStrip
          start={monday}
          count={7}
          highlight={{ month: today.month, day: today.day }}
        />
      </section>

      {/* Dag for dag */}
      <section className="mt-12">
        <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-ink-soft">
          Dag for dag
        </h2>
        <ul className="paper divide-y divide-line overflow-hidden">
          {days.map((d) => (
            <li
              key={`${d.month}-${d.day}`}
              className={`flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
                d.isToday ? "bg-mustard/10" : ""
              }`}
            >
              <Link
                href={`/dato/${dateSlug(d.month, d.day)}`}
                className="font-semibold"
              >
                {cap(d.weekday)} {formatDayMonth(d.month, d.day)}
                {d.isToday && (
                  <span className="ml-2 rounded-full bg-hero px-2 py-0.5 text-xs font-bold text-cream">
                    I dag
                  </span>
                )}
              </Link>
              <span className="text-lg">
                {d.names.length > 0 ? (
                  d.names.map((n, i) => (
                    <span key={n}>
                      <Link
                        href={`/dato/${dateSlug(d.month, d.day)}`}
                        className="font-semibold underline decoration-line decoration-2 underline-offset-4 hover:decoration-coral"
                      >
                        {n}
                      </Link>
                      {i < d.names.length - 1 && (
                        <span className="text-ink-soft">, </span>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="italic text-ink-soft">Ingen navnedag</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
