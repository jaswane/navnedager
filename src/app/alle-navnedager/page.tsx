import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import JsonLd from "@/components/JsonLd";
import { Almanakk } from "@/components/illustrations";
import { MONTHS_NB, monthNameCap } from "@/lib/dates";
import { daysInMonthEntries, nameCount } from "@/lib/navnedager";
import { buildMetadata } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema, itemListSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Alle navnedager gjennom året",
  description:
    "Hele den norske navnedagskalenderen, måned for måned. Velg en måned for å se alle navnedager fra 1. januar til 31. desember.",
  path: "/alle-navnedager",
});

export default function AllNameDaysPage() {
  const months = MONTHS_NB.map((m, i) => {
    const month = i + 1;
    const days = daysInMonthEntries(month);
    const count = days.reduce((s, d) => s + d.names.length, 0);
    const preview = days.flatMap((d) => d.names).slice(0, 4).join(", ");
    return { month, name: m, count, preview };
  });

  const crumbs = [
    { name: "Forside", path: "/" },
    { name: "Alle navnedager", path: "/alle-navnedager" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <JsonLd
        data={[
          webPageSchema({
            name: "Alle navnedager gjennom året",
            description: "Hele den norske navnedagskalenderen, måned for måned.",
            path: "/alle-navnedager",
          }),
          breadcrumbSchema(crumbs),
          itemListSchema({
            name: "Måneder",
            items: MONTHS_NB.map((m) => ({ name: m, path: `/maned/${m}` })),
          }),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="mt-6">
        <PageHeader
          eyebrow="Hele året"
          title="Alle navnedager"
          lead={`Den norske navnedagskalenderen med ${nameCount()} navn, fra 1. januar til 31. desember. Velg en måned.`}
          icon={<Almanakk className="h-8 w-8" />}
        />
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {months.map((m) => (
          <li key={m.name}>
            <Link
              href={`/maned/${m.name}`}
              className="flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-transform hover:-translate-y-1 hover:border-coral"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-2xl font-extrabold">
                  {monthNameCap(m.month)}
                </h2>
                <span className="font-display text-xl font-bold text-ink-soft">
                  {String(m.month).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 text-sm text-ink-soft">{m.preview} …</p>
              <p className="mt-auto pt-4 text-sm font-bold uppercase tracking-widest text-coral-deep">
                {m.count} navn →
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
