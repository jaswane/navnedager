import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import DatePicker from "@/components/DatePicker";
import JsonLd from "@/components/JsonLd";
import { CalendarMark } from "@/components/illustrations";
import { MONTHS_NB } from "@/lib/dates";
import { buildMetadata } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Søk etter dato",
  description:
    "Velg en dato og se hvem som har navnedag den dagen i den norske navnedagskalenderen.",
  path: "/dato",
});

export default function DateSearchPage() {
  const crumbs = [
    { name: "Forside", path: "/" },
    { name: "Søk etter dato", path: "/dato" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd
        data={[
          webPageSchema({
            name: "Søk etter dato",
            description: "Finn navnedagen for en bestemt dato.",
            path: "/dato",
          }),
          breadcrumbSchema(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="flex items-center gap-2 text-teal-deep">
        <CalendarMark className="h-7 w-7" />
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-ink-soft">
          Dato
        </span>
      </div>
      <h1 className="mt-3 font-display text-5xl font-semibold sm:text-7xl">
        Søk etter dato
      </h1>
      <p className="mt-4 max-w-xl text-xl text-ink-soft">
        Velg en dag og måned for å se hvem som har navnedag.
      </p>

      <div className="mt-8 paper p-6 sm:p-8">
        <DatePicker />
      </div>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold">
          Eller velg en måned
        </h2>
        <ul className="flex flex-wrap gap-2.5">
          {MONTHS_NB.map((m) => (
            <li key={m}>
              <Link
                href={`/maned/${m}`}
                className="inline-block rounded-full border-2 border-ink bg-cream-deep px-4 py-1.5 font-semibold capitalize transition-colors hover:bg-teal"
              >
                {m}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
