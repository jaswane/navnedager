import Link from "next/link";
import type { Metadata } from "next";
import CalendarStrip from "@/components/CalendarStrip";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import {
  osloToday,
  addDays,
  isoWeek,
  monthName,
  cap,
  weekdayName,
  dateSlug,
} from "@/lib/dates";
import { Tomorrow } from "@/components/illustrations";
import { namesForDate } from "@/lib/navnedager";
import { buildMetadata } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Hvem har navnedag i morgen?",
  description:
    "Se hvem som har navnedag i morgen i den norske navnedagskalenderen. Planlegg en hilsen eller en overraskelse i tide.",
  path: "/i-morgen",
});

export default function TomorrowPage() {
  const today = osloToday();
  const tomorrow = addDays(today.year, today.month, today.day, 1);
  const names = namesForDate(tomorrow.month, tomorrow.day);
  const week = isoWeek(tomorrow.year, tomorrow.month, tomorrow.day);
  const weekday = weekdayName(tomorrow.year, tomorrow.month, tomorrow.day);

  const crumbs = [
    { name: "Forside", path: "/" },
    { name: "I morgen", path: "/i-morgen" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <JsonLd
        data={[
          webPageSchema({
            name: "Hvem har navnedag i morgen?",
            description: "Navnedager i morgen i den norske navnedagskalenderen.",
            path: "/i-morgen",
          }),
          breadcrumbSchema(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      {/* Kort svar først, sentrert */}
      <div className="mt-6 text-center">
        <div className="mb-4 flex justify-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mustard/20 text-mustard-deep">
            <Tomorrow className="h-7 w-7" />
          </span>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink-soft">
          I morgen · {cap(weekday)} {tomorrow.day}. {monthName(tomorrow.month)} · Uke{" "}
          {week}
        </p>
        <h1 className="mt-3 font-display text-5xl font-extrabold uppercase tracking-tight sm:text-7xl">
          {names.length > 0 ? names.join(" & ") : "Ingen navnedag i morgen"}
        </h1>
        <p className="mt-4 text-xl text-ink-soft">
          {names.length > 0
            ? `har navnedag i morgen, ${tomorrow.day}. ${monthName(tomorrow.month)}.`
            : `Ingen navn står oppført den ${tomorrow.day}. ${monthName(tomorrow.month)}.`}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl border border-line bg-paper px-5 py-2.5 font-semibold transition-transform hover:-translate-y-0.5"
          >
            Hvem har navnedag i dag?
          </Link>
          <Link
            href={`/dato/${dateSlug(tomorrow.month, tomorrow.day)}`}
            className="btn-soft"
          >
            Mer om {tomorrow.day}. {monthName(tomorrow.month)}
          </Link>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-ink-soft">
          De neste dagene
        </h2>
        <CalendarStrip
          start={today}
          count={7}
          highlight={{ month: today.month, day: today.day }}
        />
      </section>
    </div>
  );
}
