import type { Metadata } from "next";
import ContentLayout from "@/components/ContentLayout";
import { buildMetadata } from "@/lib/seo";
import { nameCount } from "@/lib/navnedager";
import { CalendarScene } from "@/components/illustrations";

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
      icon={<CalendarScene className="h-10 w-11" />}
      crumbs={[
        { name: "Forside", path: "/" },
        { name: "Datakilder", path: "/datakilder" },
      ]}
    >
      <h2>Hvilken liste bruker vi?</h2>
      <p>
        Navnene følger den tradisjonelle norske navnedagslisten slik den er
        gjengitt hos vanlige norske navnedagskilder. Listen vår er på linje med
        blant annet nummeruke.no, navnedag.nu, Store norske leksikon og
        Navneguiden, og inneholder {nameCount()} navn fordelt på årets dager – som
        regel to navn per dag.
      </p>

      <h2>Ikke den offisielle Almanakkforlaget-listen</h2>
      <p>
        Den offisielle navnedagsrekkefølgen eies og utgis av Almanakkforlaget, i
        samarbeid med navneforskere ved Universitetet i Oslo. Vi bruker{" "}
        <strong>ikke</strong> denne offisielle listen direkte, og Navnedager.no er
        verken tilknyttet eller godkjent av Almanakkforlaget. Vi gjengir den
        alminnelige, mye brukte navnedagslisten.
      </p>

      <h2>Navnedagslister kan variere</h2>
      <p>
        Det finnes flere utgaver av den norske navnedagskalenderen, og ulike
        almanakker og nettsteder kan ha forskjeller. Noen lister oppgir to navn
        per dag, andre tre. Enkelte datoer har også ulike navn i ulike kilder – for
        eksempel kan 12. januar oppgis både som «Reinhard, Reinert» og «Nataniel,
        Nelly». Vi har valgt én konsekvent liste, men avvik fra din almanakk kan
        derfor forekomme.
      </p>

      <h2>Slik er dataene lagret</h2>
      <p>
        All navnedagsdata ligger lokalt i prosjektet som en strukturert liste der
        hver dato er koblet til navnene sine. Vi bruker ingen ekstern database
        eller tredjeparts-API for å vise navnedagene. Det gjør siden rask, stabil
        og uavhengig.
      </p>

      <h2>Fant du en feil?</h2>
      <p>
        Vi etterstreber at dataene skal være korrekte. Finner du en feil eller et
        navn som mangler, setter vi pris på tilbakemelding, så oppdaterer vi
        listen.
      </p>
    </ContentLayout>
  );
}
