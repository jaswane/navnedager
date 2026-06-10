import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import CurrentYearDate from "@/components/CurrentYearDate";
import LinkCard from "@/components/LinkCard";
import { DatePage, DeskCalendar, Star } from "@/components/illustrations";
import Link from "next/link";
import { allNames, nameBySlug, relatedNames } from "@/lib/navnedager";
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

  const crumbs = [
    { name: "Forside", path: "/" },
    { name: "Navn A–Å", path: "/navn" },
    { name: entry.name, path: `/navn/${entry.slug}` },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
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

      {/* Tittel + kort svar, sentrert */}
      <div className="mt-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink-soft">
          Navnedag
        </p>
        <h1 className="mt-2 font-display text-6xl font-extrabold tracking-tight sm:text-7xl">
          {entry.name}
        </h1>
        <p className="mt-4 text-xl text-ink-soft">
          {entry.name} har navnedag{" "}
          <Link
            href={`/dato/${dateSlug(entry.month, entry.day)}`}
            className="font-semibold text-ink underline decoration-mustard decoration-2 underline-offset-4"
          >
            {date}
          </Link>
          .
        </p>
      </div>

      {/* Rolig informasjonsboks */}
      <p className="infobox mx-auto mt-7 max-w-md text-center text-ink-soft">
        <CurrentYearDate month={entry.month} day={entry.day} />
      </p>

      {related.length > 0 && (
        <p className="mt-5 text-center text-ink-soft">
          Deler navnedagen med{" "}
          {related.map((r, i) => (
            <span key={r.slug}>
              <Link
                href={`/navn/${r.slug}`}
                className="font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-coral"
              >
                {r.name}
              </Link>
              {i < related.length - 2 ? ", " : i === related.length - 2 ? " og " : ""}
            </span>
          ))}
          .
        </p>
      )}

      {/* Maks tre rolige lenkebokser */}
      <div className="mx-auto mt-9 flex max-w-md flex-col gap-3">
        <LinkCard
          href={`/dato/${dateSlug(entry.month, entry.day)}`}
          label={`Se alle navnedager ${date}`}
          icon={<DatePage className="h-5 w-5" />}
        />
        <LinkCard
          href={`/maned/${month}`}
          label={`Bla til ${monthNameCap(entry.month)}`}
          icon={<DeskCalendar className="h-6 w-7" />}
        />
        <LinkCard
          href={`https://navnetoppen.no/navn/${entry.slug}`}
          external
          label={`Se navnestatistikk for ${entry.name}`}
          sublabel="på Navnetoppen.no"
          icon={<Star className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}
