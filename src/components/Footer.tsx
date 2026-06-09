import Link from "next/link";
import { Star } from "@/components/illustrations";
import { SITE } from "@/lib/site";

const COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Navnedager",
    links: [
      { href: "/", label: "I dag" },
      { href: "/i-morgen", label: "I morgen" },
      { href: "/denne-uken", label: "Denne uken" },
      { href: "/alle-navnedager", label: "Alle navnedager" },
      { href: "/navn", label: "Navn A–Å" },
    ],
  },
  {
    title: "Om siden",
    links: [
      { href: "/om", label: "Om Navnedager.no" },
      { href: "/om-navnedager", label: "Hva er navnedager?" },
      { href: "/datakilder", label: "Datakilder" },
    ],
  },
  {
    title: "Juridisk",
    links: [
      { href: "/personvern", label: "Personvern" },
      { href: "/ansvarsfraskrivelse", label: "Ansvarsfraskrivelse" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-line bg-cream-deep">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-mustard" />
              <span className="font-display text-lg font-semibold">
                Navnedager<span className="text-mustard">.no</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-soft">
              Norges fineste navnedagskalender. Finn ut hvem som har navnedag i
              dag – søk på navn eller dato.
            </p>
            <p className="mt-4 max-w-xs text-sm text-ink-soft">
              Se også{" "}
              <a
                href="https://navnetoppen.no"
                rel="noopener"
                className="font-semibold text-ink underline decoration-mustard decoration-2 underline-offset-4 hover:text-coral-deep"
              >
                Navnetoppen.no
              </a>{" "}
              for navnestatistikk og de mest populære navnene i Norge.
            </p>
          </div>

          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-ink-soft">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm font-semibold text-ink transition-colors hover:text-coral-deep"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}
          </p>
          <p>
            Laget av{" "}
            <a
              href={SITE.publisherUrl}
              className="font-semibold text-ink transition-colors hover:text-coral-deep"
              rel="noopener"
            >
              SwaneCreative.no
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
