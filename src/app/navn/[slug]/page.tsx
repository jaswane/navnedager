import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import CurrentYearDate from "@/components/CurrentYearDate";
import { NameTag, Star } from "@/components/illustrations";
import {
  allNames,
  nameBySlug,
  relatedNames,
} from "@/lib/navnedager";
import { formatDayMonth, monthName, monthNameCap, dateSlug } from "@/lib/dates";
import { buildMetadata } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return allNames().map((e) => ({ slug: e.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = nameBySlug(slug);
  if (!entry) return {};
  const date = formatDayMonth(entry.month, entry.day);
  return buildMetadata({
    title: `${entry.name} har navnedag ${date}`,
    description: `${entry.name} har navnedag ${date}. Se hvilken dato ${entry.name} har navnedag, og hvilke andre navn som deler dagen.`,
    path: `/navn/${entry.slug}`,
  });
}

export default async function NamePage({ params }: Params) {
  const { slug } = await params;
  const entry = nameBySlug(slug);
  if (!entry) notFound();

  const date = formatDayMonth(entry.month, entry.day);
  const related = relatedNames(entry);
  const month = monthName(entry.month);
  const navnetoppen = `https://navnetoppen.no/navn/${entry.slug}`;

  const crumbs = [
    { name: "Forside", path: "/" },
    { name: "Navn A–Å", path: "/navn" },
    { name: entry.name, path: `/navn/${entry.slug}` },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd
        data={[
          webPageSchema({
            name: `${entry.name} har navnedag ${date}`,
            description: `${entry.name} har navnedag ${date}.`,
            path: `/navn/${entry.slug}`,
          }),
          breadcrumbSchema(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="flex items-center gap-2 text-coral">
        <NameTag className="h-7 w-12" />
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-ink-soft">
          Navnedag
        </span>
      </div>

      {/* Kort svar først – optimalisert for AI-søk og raske svar. */}
      <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.95] sm:text-7xl">
        {entry.name}
      </h1>
      <p className="mt-5 text-2xl text-ink-soft">
        {entry.name} har navnedag{" "}
        <Link
          href={`/dato/${dateSlug(entry.month, entry.day)}`}
          className="font-semibold text-ink underline decoration-mustard decoration-2 underline-offset-4"
        >
          {date}
        </Link>
        .
      </p>

      <div className="mt-6 rounded-2xl border-2 border-line bg-paper p-5">
        <CurrentYearDate month={entry.month} day={entry.day} />
      </div>

      {/* Relaterte navn */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-2xl font-semibold">
            Andre med navnedag {date}
          </h2>
          <ul className="flex flex-wrap gap-2.5">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/navn/${r.slug}`}
                  className="inline-block rounded-full border-2 border-ink bg-cream-deep px-4 py-1.5 font-semibold transition-colors hover:bg-teal"
                >
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Relaterte datoer / utforsk */}
      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold">Utforsk videre</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={`/dato/${dateSlug(entry.month, entry.day)}`}
            className="flex items-center justify-between rounded-2xl border-2 border-ink bg-paper px-5 py-4 font-semibold transition-transform hover:-translate-y-0.5"
          >
            <span>Datoen {date}</span>
            <span aria-hidden>→</span>
          </Link>
          <Link
            href={`/maned/${month}`}
            className="flex items-center justify-between rounded-2xl border-2 border-ink bg-paper px-5 py-4 font-semibold transition-transform hover:-translate-y-0.5"
          >
            <span>Navnedager i {monthNameCap(entry.month)}</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Internlenke til Navnetoppen.no */}
      <aside className="mt-12 flex flex-col items-start gap-3 rounded-3xl border-2 border-ink bg-mustard/15 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Star className="mt-1 h-6 w-6 shrink-0 text-mustard" />
          <p className="text-lg">
            Lurer du på hvor populært navnet{" "}
            <strong>{entry.name}</strong> er? Se statistikk og trender på
            Navnetoppen.
          </p>
        </div>
        <a
          href={navnetoppen}
          rel="noopener"
          className="shrink-0 rounded-xl border-2 border-ink bg-paper px-5 py-2.5 font-bold shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
        >
          {entry.name} på Navnetoppen →
        </a>
      </aside>
    </div>
  );
}
