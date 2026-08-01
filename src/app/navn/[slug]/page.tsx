import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import LinkCard from "@/components/LinkCard";
import { DatePage, DeskCalendar, Star } from "@/components/illustrations";
import Link from "next/link";
import { allNames, nameBySlug, relatedNames } from "@/lib/navnedager";
import { navnetoppenLink } from "@/lib/navnetoppen";
import { formatDayMonth, monthName, monthNameCap, dateSlug } from "@/lib/dates";
import { getNameDayYearInfo } from "@/lib/nameday-context";
import { getServerNameDayContext } from "@/lib/nameday-context.server";
import { nameMetaDescription } from "@/lib/name-description";
import { buildMetadata } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema } from "@/lib/schema";

export const dynamicParams = false;

// Ukedag/ukenummer er årsavhengig og server-rendres. ISR sørger for at
// sidene fornyes, slik at teksten ikke blir stående på fjorårets ukedag.
export const revalidate = 3600;

export function generateStaticParams() {
  return allNames().map((e) => ({ slug: e.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = nameBySlug(slug);
  if (!entry) return {};
  const date = formatDayMonth(entry.month, entry.day);
  const others = relatedNames(entry).map((r) => r.name);
  return buildMetadata({
    title: `${entry.name} har navnedag ${date}`,
    description: nameMetaDescription(
      entry.name,
      entry.month,
      entry.day,
      others
    ),
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
  const navnetoppen = navnetoppenLink(entry.name, entry.slug);

  // Årsavhengig info server-rendres (Europe/Oslo via dagskonteksten).
  const ctx = getServerNameDayContext();
  const yearInfo = getNameDayYearInfo(entry.month, entry.day, {
    year: ctx.year,
    month: ctx.today.month,
    day: ctx.today.day,
  });

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

      {/* Rolig informasjonsboks – server-rendret, finnes i HTML før klient-JS */}
      <div className="infobox mx-auto mt-7 max-w-md text-center text-ink-soft">
        {yearInfo.existsThisYear ? (
          <p>
            I {yearInfo.currentYear} faller {date} på en{" "}
            <strong className="text-ink">{yearInfo.weekday}</strong>, i uke{" "}
            <strong className="text-ink">{yearInfo.week}</strong>.
          </p>
        ) : (
          <p>
            {date} finnes ikke i {yearInfo.currentYear} – det er ikke skuddår.
          </p>
        )}
        {yearInfo.nextIsLaterYear && (
          <p className="mt-1">
            Neste navnedag er {yearInfo.nextWeekday} {date} {yearInfo.nextYear},
            i uke {yearInfo.nextWeek}.
          </p>
        )}
      </div>

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
        {/* Kun verifiserte Navnetoppen-sider dyplenkes; ellers nøytral oversikt. */}
        <LinkCard
          href={navnetoppen.href}
          external
          label={navnetoppen.label}
          sublabel={navnetoppen.sublabel}
          icon={<Star className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}
