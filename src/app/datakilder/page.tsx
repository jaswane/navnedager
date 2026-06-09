import type { Metadata } from "next";
import ContentLayout from "@/components/ContentLayout";
import { buildMetadata } from "@/lib/seo";
import { nameCount } from "@/lib/navnedager";

export const metadata: Metadata = buildMetadata({
  title: "Datakilder",
  description:
    "Slik er navnedagsdataene på Navnedager.no satt sammen, og hvordan vi jobber for at de skal være korrekte.",
  path: "/datakilder",
});

export default function SourcesPage() {
  return (
    <ContentLayout
      title="Datakilder"
      lead="Navnedager.no bygger på den innarbeidede norske navnedagskalenderen. Her forklarer vi datagrunnlaget."
      path="/datakilder"
      schemaName="Datakilder"
      schemaDescription="Datagrunnlaget bak navnedagene på Navnedager.no."
      crumbs={[
        { name: "Forside", path: "/" },
        { name: "Datakilder", path: "/datakilder" },
      ]}
    >
      <h2>Navnedagskalenderen</h2>
      <p>
        Navnene som vises er hentet fra den moderne norske navnedagslisten, slik
        den brukes i norske almanakker og kalendere. Listen inneholder{" "}
        {nameCount()} navn fordelt på årets dager.
      </p>

      <h2>Slik er dataene lagret</h2>
      <p>
        All navnedagsdata ligger lokalt i prosjektet som en strukturert liste der
        hver dato er koblet til navnene sine. Vi bruker ingen ekstern database
        eller tredjeparts-API for å vise navnedagene. Det gjør siden rask, stabil
        og uavhengig.
      </p>

      <h2>Nøyaktighet</h2>
      <p>
        Vi etterstreber at dataene skal være korrekte og oppdaterte. Ulike
        almanakker og kalenderutgivere kan i enkelte tilfeller ha små forskjeller
        i navnedagslisten. Finner du en feil eller et navn som mangler, setter vi
        pris på tilbakemelding.
      </p>

      <h2>Endringer over tid</h2>
      <p>
        Den norske navnedagskalenderen er revidert flere ganger for å gjøre den
        mer i tråd med navn som faktisk er i bruk. Vi oppdaterer listen dersom det
        kommer endringer.
      </p>
    </ContentLayout>
  );
}
