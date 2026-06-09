import Link from "next/link";
import type { Metadata } from "next";
import CalendarStrip from "@/components/CalendarStrip";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { Star } from "@/components/illustrations";
import {
  osloToday,
  addDays,
  formatFullDate,
  isoWeek,
  monthName,
  dateSlug,
} from "@/lib/dates";
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JsonLd
        data={[
          webPageSchema({
            name: "Hvem har navnedag i morgen?",
            description: "Navnedager i morgen i den norske navnedagskalenderen.",
            path: "/i-morgen",
          }),
          breadcrumbSchema([
            { name: "Forside", path: "/" },
            { name: "I morgen", path: "/i-morgen" },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Forside", path: "/" },
          { name: "I morgen", path: "/i-morgen" },
        ]}
      />

      <p className="text-sm font-bold uppercase tracking-[0.2em] text-ink-soft">
        I morgen · {formatFullDate(tomorrow.year, tomorrow.month, tomorrow.day)} ·
        Uke {week}
      </p>

      {/* Kort svar først – for både folk og AI. */}
      <h1 className="mt-5 font-display font-semibold leading-[0.95]">
        {names.length > 0 ? (
          <span className="block text-5xl sm:text-7xl lg:text-8xl">
            {names.join(" & ")}
          </span>
        ) : (
          <span className="block text-4xl sm:text-6xl">
            Ingen har navnedag i morgen
          </span>
        )}
      </h1>
      <p className="mt-6 max-w-xl text-xl text-ink-soft">
        {names.length > 0 ? (
          <>
            har navnedag i morgen,{" "}
            <strong className="text-ink">
              {tomorrow.day}. {monthName(tomorrow.month)}
            </strong>
            .
          </>
        ) : (
          <>
            Ingen navn står oppført den {tomorrow.day}. {monthName(tomorrow.month)}.
          </>
        )}
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-paper px-5 py-2.5 font-semibold"
        >
          <Star className="h-4 w-4 text-mustard" /> Se hvem som har navnedag i dag
        </Link>
        <Link
          href={`/dato/${dateSlug(tomorrow.month, tomorrow.day)}`}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-teal px-5 py-2.5 font-semibold shadow-[4px_4px_0_0_var(--color-ink)]"
        >
          Mer om {tomorrow.day}. {monthName(tomorrow.month)}
        </Link>
      </div>

      <section className="mt-14">
        <h2 className="mb-6 font-display text-3xl font-semibold">
          De neste dagene
        </h2>
        <CalendarStrip start={today} count={7} />
      </section>
    </div>
  );
}
