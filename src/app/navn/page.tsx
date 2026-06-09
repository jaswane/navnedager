import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import NameSearch from "@/components/NameSearch";
import JsonLd from "@/components/JsonLd";
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

  // Grupper alfabetisk (norsk rekkefølge er allerede ivaretatt av sorteringen).
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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
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

      <h1 className="font-display text-5xl font-semibold sm:text-7xl">Navn A–Å</h1>
      <p className="mt-4 max-w-xl text-xl text-ink-soft">
        {nameCount()} navn i den norske navnedagskalenderen. Søk eller bla deg
        nedover.
      </p>

      <div className="mt-7 max-w-xl">
        <NameSearch items={items} />
      </div>

      {/* Bokstav-navigasjon */}
      <nav aria-label="Hopp til bokstav" className="mt-8 flex flex-wrap gap-2">
        {letters.map((l) => (
          <a
            key={l}
            href={`#bokstav-${l}`}
            className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-paper font-display font-bold transition-colors hover:bg-mustard"
          >
            {l}
          </a>
        ))}
      </nav>

      {/* Grupper */}
      <div className="mt-12 space-y-12">
        {letters.map((letter) => (
          <section key={letter} id={`bokstav-${letter}`} className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-3 font-display text-4xl font-semibold">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-coral text-ink">
                {letter}
              </span>
            </h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
              {groups.get(letter)!.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/navn/${entry.slug}`}
                    className="flex items-baseline justify-between gap-2 border-b border-line py-1.5 hover:border-coral"
                  >
                    <span className="font-display text-lg font-semibold">
                      {entry.name}
                    </span>
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
