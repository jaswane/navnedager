import type { Metadata } from "next";
import ContentLayout from "@/components/ContentLayout";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Personvern",
  description:
    "Personvernerklæring for Navnedager.no. Slik håndterer vi data og personvern – kort og tydelig.",
  path: "/personvern",
});

export default function PrivacyPage() {
  return (
    <ContentLayout
      title="Personvern"
      lead="Vi samler inn så lite som mulig. Her er hvordan Navnedager.no håndterer personvern."
      path="/personvern"
      schemaName="Personvern"
      schemaDescription="Personvernerklæring for Navnedager.no."
      crumbs={[
        { name: "Forside", path: "/" },
        { name: "Personvern", path: "/personvern" },
      ]}
    >
      <h2>Kort oppsummert</h2>
      <p>
        Navnedager.no krever ingen innlogging, og vi ber deg aldri om
        personopplysninger. Søkene dine etter navn og datoer skjer i nettleseren
        din og sendes ikke til oss som personopplysninger.
      </p>

      <h2>Statistikk</h2>
      <p>
        For å forstå hvordan siden brukes, og for å gjøre den bedre, kan vi bruke
        anonymisert besøksstatistikk. Slik statistikk er aggregert og brukes ikke
        til å identifisere enkeltpersoner.
      </p>

      <h2>Informasjonskapsler</h2>
      <p>
        Siden fungerer uten unødvendige informasjonskapsler. Eventuelle
        kapsler som brukes til statistikk, settes på en personvernvennlig måte
        med anonymisering.
      </p>

      <h2>Dine rettigheter</h2>
      <p>
        Du har rett til innsyn i, og sletting av, eventuelle personopplysninger.
        Siden vi i praksis ikke lagrer personopplysninger om besøkende, vil dette
        sjelden være aktuelt.
      </p>

      <h2>Kontakt</h2>
      <p>
        Navnedager.no drives av {SITE.publisher}. Har du spørsmål om personvern,
        kan du ta kontakt via{" "}
        <a href={SITE.publisherUrl} rel="noopener">
          {SITE.publisherUrl.replace("https://", "")}
        </a>
        .
      </p>
    </ContentLayout>
  );
}
