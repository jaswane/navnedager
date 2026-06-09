import type { Metadata } from "next";
import ContentLayout from "@/components/ContentLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Ansvarsfraskrivelse",
  description:
    "Ansvarsfraskrivelse for Navnedager.no. Om bruk av innholdet og nøyaktigheten av navnedagsdataene.",
  path: "/ansvarsfraskrivelse",
});

export default function DisclaimerPage() {
  return (
    <ContentLayout
      title="Ansvarsfraskrivelse"
      lead="Navnedager.no tilbys som en gratis informasjonstjeneste. Her er det viktigste å vite."
      path="/ansvarsfraskrivelse"
      schemaName="Ansvarsfraskrivelse"
      schemaDescription="Ansvarsfraskrivelse for Navnedager.no."
      crumbs={[
        { name: "Forside", path: "/" },
        { name: "Ansvarsfraskrivelse", path: "/ansvarsfraskrivelse" },
      ]}
    >
      <h2>Informasjon, ikke fasit</h2>
      <p>
        Innholdet på Navnedager.no er ment som nyttig og hyggelig informasjon. Vi
        gjør vårt beste for at navnedagene skal være korrekte, men vi kan ikke
        garantere at all informasjon til enhver tid er fullstendig eller feilfri.
      </p>

      <h2>Ulike kilder kan variere</h2>
      <p>
        Den norske navnedagskalenderen finnes i flere utgaver, og ulike almanakker
        kan ha små forskjeller. Datoene på denne siden følger den vanlige norske
        listen, men kan derfor avvike fra enkelte andre kalendere.
      </p>

      <h2>Bruk på eget ansvar</h2>
      <p>
        Navnedager.no er ikke ansvarlig for beslutninger som tas på grunnlag av
        informasjonen på siden. Bruk av nettstedet skjer på eget ansvar.
      </p>

      <h2>Eksterne lenker</h2>
      <p>
        Siden kan inneholde lenker til andre nettsteder. Vi er ikke ansvarlige for
        innholdet på eksterne sider vi lenker til.
      </p>
    </ContentLayout>
  );
}
