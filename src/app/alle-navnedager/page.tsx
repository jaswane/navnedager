import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { CalendarMark } from "@/components/illustrations";
import { MONTHS_NB, monthName } from "@/lib/dates";
import { daysInMonthEntries, nameCount } from "@/lib/navnedager";
import { buildMetadata } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema, itemListSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Alle navnedager gjennom året",
  description:
    "Hele den norske navnedagskalenderen, måned for måned. Velg en måned for å se alle navnedager fra 1. januar til 31. desember.",
  path: "/alle-navnedager",
});

const ACCENTS = [
  "bg-coral/20",
  "bg-mustard/20",
  "bg-teal/20",
  "bg-forest/20",
];

export default function AllNameDaysPage() {
  const months = MONTHS_NB.map((m, i) => {
    const month = i + 1;
    const days = daysInMonthEntries(month);
    const count = days.reduce((s, d) => s + d.names.length, 0);
    const preview = days
      .flatMap((d) => d.names)
      .slice(0, 4)
      .join(", ");
    return { month, name: m, count, preview };
  });

  const crumbs = [
    { name: "Forside", path: "/" },
    { name: "Alle navnedager", path: "/alle-navnedager" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
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
            items: MONTHS_NB.map((m) => ({
              name: m,
              path: `/maned/${m}`,
            })),
          }),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="flex items-center gap-3 text-teal-deep">
        <CalendarMark className="h-8 w-8" />
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-ink-soft">
          Hele året
        </span>
      </div>
      <h1 className="mt-3 font-display text-5xl font-semibold sm:text-7xl">
        Alle navnedager
      </h1>
      <p className="mt-4 max-w-xl text-xl text-ink-soft">
        Den norske navnedagskalenderen med {nameCount()} navn, fra 1. januar til
        31. desember. Velg en måned.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {months.map((m, i) => (
          <li key={m.name}>
            <Link
              href={`/maned/${m.name}`}
              className={`flex h-full flex-col rounded-3xl border-2 border-ink p-6 transition-transform hover:-translate-y-1 ${
                ACCENTS[i % ACCENTS.length]
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-3xl font-semibold capitalize">
                  {monthName(m.month)}
                </h2>
                <span className="font-display text-2xl font-semibold text-ink-soft">
                  {String(m.month).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 text-sm text-ink-soft">{m.preview} …</p>
              <p className="mt-auto pt-4 text-sm font-bold uppercase tracking-widest text-ink-soft">
                {m.count} navn →
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
