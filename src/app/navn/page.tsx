import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import NameSearch from "@/components/NameSearch";
import PageHeader from "@/components/PageHeader";
import JsonLd from "@/components/JsonLd";
import { TagName } from "@/components/illustrations";
import { allNames, searchIndex, nameCount } from "@/lib/navnedager";
import { formatDayMonth } from "@/lib/dates";
import { buildMetadata } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Alle navn A–Å",
  description:
    "Bla gjennom alle navn i den norske navnedagskalenderen fra A til Å, eller søk for å finne navnedagen til et bestemt navn.",
  path: "/navn",
});

export default function NamesIndexPage() {
  const names = allNames();
  const items = searchIndex();

  const groups = new Map<string, typeof names>();
  for (const entry of names) {
    const letter = entry.name.charAt(0).toUpperCase();
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter)!.push(entry);
  }
  const letters = Array.from(groups.keys());

  const crumbs = [
    { name: "Forside", path: "/" },
    { name: "Navn A–Å", path: "/navn" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <JsonLd
        data={[
          webPageSchema({
            name: "Alle navn A–Å",
            description: "Alle navn i den norske navnedagskalenderen.",
            path: "/navn",
          }),
          breadcrumbSchema(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="mt-6">
        <PageHeader
          eyebrow="Navneregister"
          title="Navn A–Å"
          lead={`${nameCount()} navn i den norske navnedagskalenderen. Søk eller bla deg nedover.`}
          icon={<TagName className="h-8 w-8" />}
        />
      </div>

      <div className="mx-auto mt-7 max-w-xl">
        <NameSearch items={items} />
      </div>

      {/* Bokstav-navigasjon */}
      <nav
        aria-label="Hopp til bokstav"
        className="mt-8 flex flex-wrap justify-center gap-2"
      >
        {letters.map((l) => (
          <a
            key={l}
            href={`#bokstav-${l}`}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-paper font-bold transition-colors hover:border-coral hover:text-coral-deep"
          >
            {l}
          </a>
        ))}
      </nav>

      {/* Grupper */}
      <div className="mt-12 space-y-10">
        {letters.map((letter) => (
          <section key={letter} id={`bokstav-${letter}`} className="scroll-mt-24">
            <h2 className="mb-3 flex items-center gap-3">
              <span className="font-display text-3xl font-extrabold text-coral-deep">
                {letter}
              </span>
              <span className="h-px flex-1 bg-line" />
            </h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3 lg:grid-cols-4">
              {groups.get(letter)!.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/navn/${entry.slug}`}
                    className="flex items-baseline justify-between gap-2 border-b border-line py-1.5 transition-colors hover:border-coral"
                  >
                    <span className="font-semibold">{entry.name}</span>
                    <span className="text-xs text-ink-soft">
                      {formatDayMonth(entry.month, entry.day)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
