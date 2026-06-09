import Link from "next/link";
import type { Metadata } from "next";
import ContentLayout from "@/components/ContentLayout";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Om Navnedager.no",
  description:
    "Navnedager.no er en enkel, rask og vakker norsk navnedagskalender, laget av Swane Creative.",
  path: "/om",
});

export default function AboutPage() {
  return (
    <ContentLayout
      title="Om Navnedager.no"
      lead="Den enkleste, raskeste og mest minneverdige måten å finne dagens navnedag på."
      path="/om"
      schemaName="Om Navnedager.no"
      schemaDescription="Om nettstedet Navnedager.no og hvem som står bak."
      crumbs={[
        { name: "Forside", path: "/" },
        { name: "Om", path: "/om" },
      ]}
    >
      <h2>Hva er Navnedager.no?</h2>
      <p>
        Navnedager.no svarer på ett spørsmål så raskt som mulig:{" "}
        <strong>hvem har navnedag i dag?</strong> Du får svaret med en gang du
        åpner siden. I tillegg kan du søke etter et navn, slå opp en dato eller bla
        gjennom hele året – måned for måned.
      </p>

      <h2>Tanken bak</h2>
      <p>
        Vi ville lage en navnedagskalender som føles som et lite designprodukt: en
        moderne almanakk med god typografi, mye luft og en leken detalj her og der.
        Ingen rot, ingen innlogging og ingen forstyrrelser – bare et tydelig svar.
      </p>

      <h2>Raskt og uten sporing i veien</h2>
      <p>
        Siden er bygget for å være lynrask. Innholdet er statisk, og vi henter ikke
        data fra eksterne tjenester mens du bruker siden. Det gir god ytelse og
        respekt for personvernet ditt – les mer i{" "}
        <Link href="/personvern">personvernerklæringen</Link>.
      </p>

      <h2>Hvem står bak?</h2>
      <p>
        Navnedager.no er laget og drives av{" "}
        <a href={SITE.publisherUrl} rel="noopener">
          Swane Creative
        </a>
        . Har du innspill, ris eller ros, vil vi gjerne høre fra deg.
      </p>

      <h2>Utforsk videre</h2>
      <ul>
        <li>
          <Link href="/">Hvem har navnedag i dag?</Link>
        </li>
        <li>
          <Link href="/navn">Alle navn fra A til Å</Link>
        </li>
        <li>
          <Link href="/om-navnedager">Hva er egentlig en navnedag?</Link>
        </li>
      </ul>
    </ContentLayout>
  );
}
