import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { Flower } from "@/components/illustrations";
import { daysInMonthEntries, nameToSlug } from "@/lib/navnedager";
import { MONTHS_NB, monthFromSlug, monthName, dateSlug } from "@/lib/dates";
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
    title: `Navnedager i ${name}`,
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
    { name: name.charAt(0).toUpperCase() + name.slice(1), path: `/maned/${name}` },
  ];

  const listItems = days.flatMap((d) =>
    d.names.map((n) => ({ name: n, path: `/navn/${nameToSlug(n) ?? ""}` }))
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <JsonLd
        data={[
          webPageSchema({
            name: `Navnedager i ${name}`,
            description: `Alle navnedager i ${name}.`,
            path: `/maned/${name}`,
          }),
          breadcrumbSchema(crumbs),
          itemListSchema({ name: `Navnedager i ${name}`, items: listItems }),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="relative overflow-hidden rounded-3xl border-2 border-ink bg-forest/15 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-forest-deep">
          Måned
        </p>
        <h1 className="mt-2 font-display text-6xl font-semibold capitalize leading-none sm:text-7xl">
          {name}
        </h1>
        <p className="mt-4 max-w-md text-lg text-ink-soft">
          {totalNames} navn har navnedag i løpet av {name}.
        </p>
        <Flower className="pointer-events-none absolute -bottom-8 -right-6 h-40 w-40 text-forest/25" />
      </div>

      {/* Måned-navigasjon */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <Link
          href={`/maned/${monthName(prevMonth)}`}
          className="rounded-xl border-2 border-ink bg-paper px-4 py-2 font-semibold capitalize transition-transform hover:-translate-y-0.5"
        >
          ← {monthName(prevMonth)}
        </Link>
        <Link
          href={`/maned/${monthName(nextMonth)}`}
          className="rounded-xl border-2 border-ink bg-paper px-4 py-2 font-semibold capitalize transition-transform hover:-translate-y-0.5"
        >
          {monthName(nextMonth)} →
        </Link>
      </div>

      {/* Dag for dag */}
      <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border-2 border-ink bg-paper">
        {days.map((d) => (
          <li
            key={d.day}
            className="flex items-baseline gap-4 px-5 py-3.5 sm:gap-6"
          >
            <Link
              href={`/dato/${dateSlug(month, d.day)}`}
              className="w-12 shrink-0 font-display text-2xl font-semibold tabular-nums hover:text-coral-deep"
            >
              {d.day}.
            </Link>
            <span className="flex flex-wrap gap-x-2 gap-y-1">
              {d.names.length > 0 ? (
                d.names.map((n, i) => (
                  <span key={n}>
                    <Link
                      href={`/navn/${nameToSlug(n)}`}
                      className="font-display text-lg font-semibold underline decoration-line decoration-2 underline-offset-4 hover:decoration-coral"
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
      <nav aria-label="Alle måneder" className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold">Andre måneder</h2>
        <ul className="flex flex-wrap gap-2.5">
          {MONTHS_NB.map((m, i) => (
            <li key={m}>
              <Link
                href={`/maned/${m}`}
                aria-current={i + 1 === month ? "page" : undefined}
                className={`inline-block rounded-full border-2 border-ink px-4 py-1.5 font-semibold capitalize transition-colors ${
                  i + 1 === month
                    ? "bg-ink text-cream"
                    : "bg-cream-deep hover:bg-teal"
                }`}
              >
                {m}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
