import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import DatePicker from "@/components/DatePicker";
import PageHeader from "@/components/PageHeader";
import JsonLd from "@/components/JsonLd";
import { DatePage } from "@/components/illustrations";
import { MONTHS_NB, monthNameCap } from "@/lib/dates";
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
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
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

      <div className="mt-6">
        <PageHeader
          eyebrow="Dato"
          title="Søk etter dato"
          lead="Velg en dag og måned for å se hvem som har navnedag."
          icon={<DatePage className="h-8 w-8" />}
        />
      </div>

      <div className="paper mx-auto mt-8 max-w-lg p-6">
        <DatePicker />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-ink-soft">
          Eller velg en måned
        </h2>
        <ul className="flex flex-wrap justify-center gap-2.5">
          {MONTHS_NB.map((m, i) => (
            <li key={m}>
              <Link
                href={`/maned/${m}`}
                className="inline-block rounded-full border border-line bg-paper px-4 py-1.5 font-semibold transition-colors hover:border-coral"
              >
                {monthNameCap(i + 1)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
