import Link from "next/link";
import type { Metadata } from "next";
import ContentLayout from "@/components/ContentLayout";
import JsonLd from "@/components/JsonLd";
import FAQ, { type FaqItem } from "@/components/FAQ";
import { CalendarScene } from "@/components/illustrations";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Hva er navnedager?",
  description:
    "Hva er en navnedag, hvor kommer tradisjonen fra, og hvordan brukes den norske navnedagskalenderen i dag? En kort og klar forklaring.",
  path: "/om-navnedager",
});

const FAQS: FaqItem[] = [
  {
    question: "Når ble den norske navnedagskalenderen laget?",
    answer:
      "Den moderne norske navnedagslisten er blitt revidert flere ganger i nyere tid for å inkludere flere vanlige norske navn. Den brukes i dag i almanakker og kalendere.",
  },
  {
    question: "Kan to navn dele samme navnedag?",
    answer:
      "Ja. De fleste datoer har to eller flere navn knyttet til seg, ofte navn som ligner på hverandre eller har samme opphav.",
  },
  {
    question: "Har alle navn en navnedag?",
    answer:
      "Nei. Navnedagskalenderen inneholder et utvalg navn. Mange navn, særlig nyere eller mer uvanlige navn, står ikke oppført.",
  },
];

export default function AboutNameDaysPage() {
  return (
    <ContentLayout
      title="Hva er navnedager?"
      lead="En navnedag er en dag i kalenderen som er knyttet til ett eller flere fornavn – en liten, hyggelig tradisjon med lange røtter."
      path="/om-navnedager"
      schemaName="Hva er navnedager?"
      schemaDescription="Forklaring av hva navnedager er og hvor tradisjonen kommer fra."
      icon={<CalendarScene className="h-10 w-11" />}
      crumbs={[
        { name: "Forside", path: "/" },
        { name: "Hva er navnedager?", path: "/om-navnedager" },
      ]}
    >
      <JsonLd data={faqSchema(FAQS)} />

      <h2>Kort fortalt</h2>
      <p>
        En navnedag er en bestemt dato som er forbundet med ett eller flere navn.
        Hvis du heter Kari, har du for eksempel navnedag den 25. november. Det er
        ingen offisiell merkedag, men en koselig anledning til en hilsen.
      </p>

      <h2>Hvor kommer tradisjonen fra?</h2>
      <p>
        Navnedager stammer fra den kristne helgenkalenderen, der hver dag var
        viet en eller flere helgener. Med tiden ble kalenderen verdslig, og i
        nyere tid er den norske navnedagslisten fornyet slik at den inneholder
        mange vanlige norske navn – ikke bare gamle helgennavn.
      </p>

      <h2>Hvordan brukes navnedager i dag?</h2>
      <p>
        I Norge er ikke navnedager fri- eller helligdager, men de står fortsatt i
        almanakker og veggkalendere. Mange synes det er hyggelig å markere
        navnedagen med en melding, en blomst eller litt kake.
      </p>

      <h2>Slik bruker du Navnedager.no</h2>
      <ul>
        <li>
          Se <Link href="/">hvem som har navnedag i dag</Link> øverst på forsiden.
        </li>
        <li>
          <Link href="/navn">Søk etter et navn</Link> for å finne datoen det har
          navnedag.
        </li>
        <li>
          Åpne en <Link href="/alle-navnedager">måned</Link> for å se alle
          navnedager gjennom året.
        </li>
      </ul>

      <h2>Ofte stilte spørsmål</h2>
      <div className="not-prose">
        <FAQ items={FAQS} />
      </div>
    </ContentLayout>
  );
}
