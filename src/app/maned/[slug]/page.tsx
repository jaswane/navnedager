import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import { DeskCalendar } from "@/components/illustrations";
import { daysInMonthEntries, nameToSlug } from "@/lib/navnedager";
import { MONTHS_NB, monthFromSlug, monthName, monthNameCap, dateSlug } from "@/lib/dates";
import { buildMetadata } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema, itemListSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return MONTHS_NB.map((m) => ({ slug: m }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const month = monthFromSlug(slug);
  if (month === null) return {};
  const name = monthName(month);
  return buildMetadata({
    title: `Navnedager i ${monthNameCap(month)}`,
    description: `Alle navnedager i ${name} – se hvilke navn som har navnedag hver dag gjennom hele ${name} i den norske navnedagskalenderen.`,
    path: `/maned/${name}`,
  });
}

export default async function MonthPage({ params }: Params) {
  const { slug } = await params;
  const month = monthFromSlug(slug);
  if (month === null) notFound();

  const name = monthName(month);
  const days = daysInMonthEntries(month);
  const prevMonth = month === 1 ? 12 : month - 1;
  const nextMonth = month === 12 ? 1 : month + 1;
  const totalNames = days.reduce((sum, d) => sum + d.names.length, 0);

  const crumbs = [
    { name: "Forside", path: "/" },
    { name: "Alle navnedager", path: "/alle-navnedager" },
    { name: monthNameCap(month), path: `/maned/${name}` },
  ];

  const listItems = days.flatMap((d) =>
    d.names.map((n) => ({ name: n, path: `/navn/${nameToSlug(n) ?? ""}` }))
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <JsonLd
        data={[
          webPageSchema({
            name: `Navnedager i ${monthNameCap(month)}`,
            description: `Alle navnedager i ${name}.`,
            path: `/maned/${name}`,
          }),
          breadcrumbSchema(crumbs),
          itemListSchema({ name: `Navnedager i ${name}`, items: listItems }),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="mt-6">
        <PageHeader
          eyebrow="Måned"
          title={monthNameCap(month)}
          lead={`${totalNames} navn har navnedag i løpet av ${name}.`}
          icon={<DeskCalendar className="h-8 w-9" />}
        />
      </div>

      {/* Måned-navigasjon */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <Link
          href={`/maned/${monthName(prevMonth)}`}
          className="rounded-xl border border-line bg-paper px-4 py-2 font-semibold transition-transform hover:-translate-x-0.5"
        >
          ← {monthNameCap(prevMonth)}
        </Link>
        <Link
          href={`/maned/${monthName(nextMonth)}`}
          className="rounded-xl border border-line bg-paper px-4 py-2 font-semibold transition-transform hover:translate-x-0.5"
        >
          {monthNameCap(nextMonth)} →
        </Link>
      </div>

      {/* Dag for dag */}
      <ul className="paper mt-6 divide-y divide-line overflow-hidden">
        {days.map((d) => (
          <li key={d.day} className="flex items-baseline gap-5 px-5 py-3.5">
            <Link
              href={`/dato/${dateSlug(month, d.day)}`}
              className="w-10 shrink-0 text-right font-display text-xl font-bold tabular-nums text-coral-deep hover:underline"
            >
              {d.day}
            </Link>
            <span className="flex flex-wrap gap-x-2 gap-y-1">
              {d.names.length > 0 ? (
                d.names.map((n, i) => (
                  <span key={n}>
                    <Link
                      href={`/navn/${nameToSlug(n)}`}
                      className="font-semibold underline decoration-line decoration-2 underline-offset-4 hover:decoration-coral"
                    >
                      {n}
                    </Link>
                    {i < d.names.length - 1 && (
                      <span className="text-ink-soft">,</span>
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

      {/* Alle måneder */}
      <nav aria-label="Alle måneder" className="mt-10">
        <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-ink-soft">
          Andre måneder
        </h2>
        <ul className="flex flex-wrap justify-center gap-2.5">
          {MONTHS_NB.map((m, i) => (
            <li key={m}>
              <Link
                href={`/maned/${m}`}
                aria-current={i + 1 === month ? "page" : undefined}
                className={`inline-block rounded-full px-4 py-1.5 font-semibold transition-colors ${
                  i + 1 === month
                    ? "bg-ink text-cream"
                    : "border border-line bg-paper hover:border-coral"
                }`}
              >
                {monthNameCap(i + 1)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
