import Link from "next/link";
import type { Metadata } from "next";
import CalendarStrip from "@/components/CalendarStrip";
import FAQ, { type FaqItem } from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import {
  CalendarScene,
  TagName,
  DatePage,
  Almanakk,
  Today,
} from "@/components/illustrations";
import { monthName, monthNameCap, cap } from "@/lib/dates";
import { getServerNameDayContext } from "@/lib/nameday-context.server";
import { daysFrom } from "@/lib/nameday-context";
import { nameToSlug } from "@/lib/navnedager";
import { nameDaySpotlights } from "@/lib/nameday-spotlight";
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
      "En navnedag er en dato i kalenderen som er knyttet til ett eller flere fornavn. Tradisjonen kommer fra den kristne helgenkalenderen, men den norske navnedagslisten inneholder i dag mange vanlige norske navn.",
  },
  {
    question: "Er navnedager offisielle i Norge?",
    answer:
      "Navnedager er ikke offisielle fri- eller helligdager i Norge, men den norske navnedagskalenderen er en innarbeidet tradisjon som brukes i almanakker og kalendere.",
  },
  {
    question: "Hvordan finner jeg navnedagen til et bestemt navn?",
    answer:
      "Bruk «Alle navn A–Å» og søk, eller åpne en bestemt dato for å se hvilke navn som hører til den dagen.",
  },
];

const CTAS = [
  { href: "/navn", label: "Navn A–Å", Icon: TagName },
  { href: "/dato", label: "Søk etter dato", Icon: DatePage },
  { href: "/alle-navnedager", label: "Alle navnedager", Icon: Almanakk },
];

export default function HomePage() {
  // Én sentral, preview-bevisst dagskontekst styrer all dagsavhengig visning.
  const ctx = getServerNameDayContext();
  const today = { year: ctx.year, month: ctx.today.month, day: ctx.today.day };
  const tomorrow = { month: ctx.tomorrow.month, day: ctx.tomorrow.day };
  const todayNames = ctx.today.names;
  const week = ctx.todayWeek;
  const weekday = ctx.todayWeekday;
  const spotlight = nameDaySpotlights[ctx.spotlight];

  // Kalenderstripe: de neste 7 dagene – i dag til og med dag +6.
  const stripStart = today;

  // Strukturert data bygges fra NØYAKTIG de dagene stripen viser, og ett
  // listeelement per synlig navn. Ingen navn eller datoer kun i schema.
  const stripDays = daysFrom(stripStart.year, stripStart.month, stripStart.day, 7);
  const stripItems = stripDays.flatMap((d) =>
    d.names.map((n) => ({
      name: n,
      path: `/navn/${nameToSlug(n) ?? ""}`,
    }))
  );

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
          itemListSchema({ name: "De neste 7 dagene", items: stripItems }),
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Stabil H1 – endrer seg ikke med dagens navn (SEO + tilgjengelighet). */}
        <h1 className="mt-4 text-center font-display text-2xl font-semibold text-ink sm:text-3xl">
          Hvem har navnedag i dag?
        </h1>

        {/* HERO – plakat */}
        <section className="relative mt-3 overflow-hidden rounded-[2rem] bg-hero text-cream shadow-[0_20px_50px_-25px_rgba(36,111,115,0.7)]">
          {/* dekor */}
          <span className="absolute right-6 top-5 z-10 text-xs font-bold uppercase tracking-[0.2em] text-cream/80">
            Uke {week}
          </span>
          <div
            aria-hidden
            className="dot-grid absolute right-7 top-14 hidden h-24 w-28 text-cream/40 sm:block"
          />
          <div
            aria-hidden
            className="absolute right-0 top-0 h-0 w-0 border-l-[46px] border-t-[46px] border-l-transparent border-t-cream/25"
          />

          <div className="relative flex flex-col items-center gap-5 p-5 sm:gap-6 sm:p-7 md:flex-row md:items-center md:gap-8">
            {/* Datoblokk */}
            <div className="w-fit shrink-0 rounded-2xl bg-cream px-5 py-4 text-center text-hero-deep">
              <div className="text-sm font-bold tracking-[0.2em]">{today.year}</div>
              <div className="text-sm font-bold uppercase tracking-[0.2em]">
                {monthName(today.month).slice(0, 3)}
              </div>
              <div className="font-display text-6xl font-black leading-none">
                {String(today.day).padStart(2, "0")}
              </div>
              <div className="mt-1 text-sm font-bold uppercase tracking-[0.2em]">
                {weekday.slice(0, 3)}
              </div>
            </div>

            {/* Navn */}
            <div className="flex-1 text-center md:text-left">
              <p className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-cream/80 md:justify-start">
                <Today className="h-4 w-4" />
                {today.day}. {monthName(today.month)}
              </p>
              {/* Dagens navn – semantisk h2 under den stabile h1. */}
              <h2
                className="mt-2 font-display font-black uppercase leading-[0.9] tracking-tight"
                aria-label={
                  todayNames.length > 0
                    ? todayNames.join(" og ")
                    : spotlight.title
                }
              >
                {todayNames.length > 0 ? (
                  todayNames.map((n, i) => (
                    <span key={n} className="block text-5xl sm:text-7xl lg:text-8xl">
                      {n}
                      {i < todayNames.length - 1 && (
                        <span className="font-normal text-cream/70"> &amp;</span>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="block text-4xl sm:text-6xl">
                    {spotlight.title}
                  </span>
                )}
              </h2>
              <p className="mt-4 text-xl font-semibold text-cream/95">
                {todayNames.length > 0 ? "har navnedag i dag" : spotlight.description}
              </p>
              <p className="mt-1 text-sm text-cream/80">
                {cap(weekday)} {today.day}. {monthName(today.month)} {today.year} · Uke{" "}
                {week}
              </p>
            </div>
          </div>

          {/* CTA-er inne i hero */}
          <div className="relative grid grid-cols-1 divide-y divide-cream/20 border-t border-cream/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {CTAS.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-center gap-3 px-4 py-4 text-sm font-bold uppercase tracking-[0.12em] text-cream transition-colors hover:bg-white/10"
              >
                <Icon className="h-6 w-6 text-cream" />
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* NESTE DAGER */}
        <section className="pb-12 pt-7">
          <div className="flex items-center justify-center gap-4">
            <span className="hidden h-px flex-1 bg-line sm:block" />
            <h2 className="text-center font-display text-2xl font-semibold uppercase tracking-[0.15em] sm:text-3xl">
              De neste 7 dagene
            </h2>
            <span className="hidden h-px flex-1 bg-line sm:block" />
          </div>

          {/* Fast oversikt i dag → +6. Ingen datonavigasjon her: morgendagen
              er allerede kort nr. 2, og «forrige dag» hører hjemme på
              datosidene. */}
          <div className="mt-6">
            <CalendarStrip
              start={stripStart}
              count={7}
              highlight={today}
              tomorrow={tomorrow}
              showWeekday
            />
          </div>

          <p className="mt-6 text-center">
            <Link
              href="/denne-uken"
              className="font-semibold text-coral-deep underline underline-offset-4"
            >
              Se hele denne uken →
            </Link>
          </p>
        </section>

        {/* HVA ER NAVNEDAG */}
        <section className="grid items-center gap-8 border-t border-line py-14 sm:grid-cols-[auto_1fr] sm:gap-12">
          <div className="mx-auto grid h-32 w-32 place-items-center rounded-3xl bg-mustard/20 sm:h-40 sm:w-40">
            <CalendarScene className="h-20 w-24 text-mustard-deep sm:h-24 sm:w-28" />
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Hva er navnedag?
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              En navnedag er en dag i kalenderen der ett eller flere bestemte
              fornavn markeres. Mange liker å sjekke hvem som har navnedag i dag,
              se kommende navn og finne datoen til sitt eget navn – en liten,
              hyggelig tradisjon med lange røtter.
            </p>
            <Link
              href="/om-navnedager"
              className="mt-4 inline-block font-semibold text-coral-deep underline underline-offset-4"
            >
              Les mer om navnedager →
            </Link>
          </div>
        </section>

        {/* DENNE MÅNEDEN */}
        <section className="border-t border-line py-14">
          <div className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-line bg-forest/12 p-7 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-forest-deep">
                Denne måneden
              </p>
              <h2 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
                Navnedager i {monthNameCap(today.month)}
              </h2>
            </div>
            <Link href={`/maned/${monthName(today.month)}`} className="btn-soft shrink-0">
              Åpne {monthNameCap(today.month)}
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-line py-14">
          <h2 className="mb-6 text-center font-display text-3xl font-semibold">
            Ofte stilte spørsmål
          </h2>
          <div className="mx-auto max-w-3xl">
            <FAQ items={FAQS} />
          </div>
        </section>
      </div>
    </>
  );
}
