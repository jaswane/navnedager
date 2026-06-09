import Link from "next/link";
import type { Metadata } from "next";
import CalendarStrip from "@/components/CalendarStrip";
import NameSearch from "@/components/NameSearch";
import DatePicker from "@/components/DatePicker";
import FAQ, { type FaqItem } from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import { Star, Flower, CalendarMark } from "@/components/illustrations";
import {
  osloToday,
  addDays,
  formatFullDate,
  isoWeek,
  monthName,
  monthNameCap,
  dateSlug,
} from "@/lib/dates";
import { namesForDate, searchIndex } from "@/lib/navnedager";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, webPageSchema, itemListSchema } from "@/lib/schema";

// Oppdateres minst hver time slik at «i dag» alltid stemmer.
export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Hvem har navnedag i dag? – Navnedager.no",
  description:
    "Se hvem som har navnedag i dag. Søk på navn eller dato i Norges fineste navnedagskalender – raskt, gratis og uten innlogging.",
  path: "/",
});

const FAQS: FaqItem[] = [
  {
    question: "Hvem har navnedag i dag?",
    answer:
      "Øverst på Navnedager.no ser du alltid hvilke navn som har navnedag i dag, basert på den norske navnedagskalenderen. Datoen oppdateres automatisk hver dag.",
  },
  {
    question: "Hva er en navnedag?",
    answer:
      "En navnedag er en dato i kalenderen som er knyttet til ett eller flere fornavn. Tradisjonen kommer fra den kristne helgenkalenderen, men den moderne norske navnedagslisten inneholder også mange vanlige norske navn.",
  },
  {
    question: "Er navnedager offisielle i Norge?",
    answer:
      "Navnedager er ikke offisielle fri- eller helligdager i Norge, men den norske navnedagskalenderen er en innarbeidet tradisjon som brukes i almanakker og kalendere.",
  },
  {
    question: "Hvordan finner jeg navnedagen til et bestemt navn?",
    answer:
      "Bruk søkefeltet på forsiden, eller bla gjennom alle navn fra A til Å. Du kan også åpne en bestemt dato for å se hvilke navn som hører til den dagen.",
  },
];

export default function HomePage() {
  const today = osloToday();
  const tomorrow = addDays(today.year, today.month, today.day, 1);
  const todayNames = namesForDate(today.month, today.day);
  const tomorrowNames = namesForDate(tomorrow.month, tomorrow.day);
  const week = isoWeek(today.year, today.month, today.day);
  const items = searchIndex();

  const next7 = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today.year, today.month, today.day, i);
    return {
      name: namesForDate(d.month, d.day).join(", ") || "Ingen navnedag",
      path: `/dato/${dateSlug(d.month, d.day)}`,
    };
  });

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            name: "Hvem har navnedag i dag?",
            description:
              "Se hvem som har navnedag i dag i den norske navnedagskalenderen.",
            path: "/",
          }),
          faqSchema(FAQS),
          itemListSchema({ name: "Navnedager de neste 7 dagene", items: next7 }),
        ]}
      />

      {/* HERO – som en plakat */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pt-20">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-ink-soft">
            <CalendarMark className="h-5 w-5 text-coral" />
            {formatFullDate(today.year, today.month, today.day)} · Uke {week}
          </p>

          <h1 className="mt-6 font-display font-semibold leading-[0.92] tracking-tight">
            {todayNames.length === 0 ? (
              <span className="block text-5xl sm:text-7xl">
                Ingen har navnedag i dag
              </span>
            ) : (
              <span className="block">
                {todayNames.map((n, i) => (
                  <span key={n} className="block">
                    <span
                      className="block text-6xl sm:text-8xl lg:text-9xl"
                      style={{
                        color:
                          i % 2 === 0
                            ? "var(--color-ink)"
                            : "var(--color-coral-deep)",
                      }}
                    >
                      {n}
                    </span>
                    {i < todayNames.length - 1 && (
                      <span className="block text-3xl font-normal italic text-mustard sm:text-5xl">
                        &amp;
                      </span>
                    )}
                  </span>
                ))}
              </span>
            )}
          </h1>

          <p className="mt-7 max-w-xl text-xl text-ink-soft">
            {todayNames.length > 0 ? (
              <>
                har navnedag i dag,{" "}
                <strong className="text-ink">
                  {today.day}. {monthName(today.month)}
                </strong>
                .
              </>
            ) : (
              <>
                Det er ingen navn i den norske navnedagskalenderen den{" "}
                {today.day}. {monthName(today.month)}.
              </>
            )}
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border-2 border-line bg-paper px-5 py-3">
            <Star className="h-5 w-5 text-mustard" />
            <span className="text-base">
              I morgen:{" "}
              <Link
                href={`/dato/${dateSlug(tomorrow.month, tomorrow.day)}`}
                className="font-display text-lg font-semibold underline decoration-mustard decoration-2 underline-offset-4"
              >
                {tomorrowNames.join(" & ") || "Ingen navnedag"}
              </Link>
            </span>
          </div>

          <Flower className="pointer-events-none absolute -right-10 top-10 hidden h-48 w-48 text-teal/30 lg:block" />
        </div>
      </section>

      {/* NESTE 7 DAGER */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow="Kalenderstripe"
          title="De neste 7 dagene"
          href="/denne-uken"
          linkLabel="Se hele uken"
        />
        <CalendarStrip start={today} count={7} />
      </section>

      {/* SØK – navn + dato */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="paper p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold">Søk etter navn</h2>
            <p className="mt-2 text-ink-soft">
              Skriv inn et navn og se hvilken dato det har navnedag.
            </p>
            <div className="mt-5">
              <NameSearch items={items} />
            </div>
            <Link
              href="/navn"
              className="mt-4 inline-block text-sm font-semibold text-coral-deep underline underline-offset-4"
            >
              Bla gjennom alle navn A–Å →
            </Link>
          </div>

          <div className="paper p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold">Søk etter dato</h2>
            <p className="mt-2 text-ink-soft">
              Velg en dag og måned for å se hvem som har navnedag.
            </p>
            <div className="mt-5">
              <DatePicker />
            </div>
            <Link
              href="/alle-navnedager"
              className="mt-4 inline-block text-sm font-semibold text-teal-deep underline underline-offset-4"
            >
              Se alle navnedager gjennom året →
            </Link>
          </div>
        </div>
      </section>

      {/* DENNE MÅNEDEN */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border-2 border-ink bg-forest/15 p-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-forest-deep">
              Denne måneden
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold">
              Navnedager i {monthNameCap(today.month)}
            </h2>
            <p className="mt-2 max-w-md text-ink-soft">
              Se alle navnene som har navnedag gjennom hele {monthName(today.month)}.
            </p>
          </div>
          <Link
            href={`/maned/${monthName(today.month)}`}
            className="shrink-0 rounded-xl border-2 border-ink bg-mustard px-6 py-3 text-lg font-bold text-ink shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
          >
            Åpne {monthName(today.month)}
          </Link>
        </div>
      </section>

      {/* FORKLARING */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-3xl font-semibold">Hva er en navnedag?</h2>
        <p className="mt-4 text-lg text-ink-soft">
          En navnedag er en dag i kalenderen som er knyttet til ett eller flere
          fornavn. Tradisjonen stammer fra den gamle helgenkalenderen, men den
          norske navnedagslisten er fornyet flere ganger og inneholder i dag
          mange vanlige norske navn. Å feire navnedagen er en hyggelig, liten
          tradisjon – en ekstra anledning til en hilsen eller en kake.
        </p>
        <Link
          href="/om-navnedager"
          className="mt-4 inline-block font-semibold text-coral-deep underline underline-offset-4"
        >
          Les mer om navnedager →
        </Link>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 font-display text-3xl font-semibold">
          Ofte stilte spørsmål
        </h2>
        <FAQ items={FAQS} />
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-ink-soft">
          {eyebrow}
        </p>
        <h2 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
          {title}
        </h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="hidden shrink-0 font-semibold text-coral-deep underline underline-offset-4 sm:block"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
