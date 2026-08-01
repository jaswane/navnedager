// Datadrevet tekstinnhold for forsidens hovedstatus.
// Ren data (ingen server-only), slik at både sider og tester kan bruke den.
import type { NameDaySpotlightKey } from "@/lib/nameday-context";

export interface NameDaySpotlightContent {
  eyebrow: string;
  title: string;
  description: string;
}

export const nameDaySpotlights: Record<
  NameDaySpotlightKey,
  NameDaySpotlightContent
> = {
  "names-today": {
    eyebrow: "Navnedager i dag",
    title: "Disse navnene har navnedag i dag",
    description: "har navnedag i dag",
  },
  "single-name-today": {
    eyebrow: "Navnedag i dag",
    title: "Dagens navn",
    description: "har navnedag i dag",
  },
  "no-names-today": {
    eyebrow: "Navnedager i dag",
    title: "Ingen registrerte navnedager i dag",
    description:
      "Denne datoen har ingen registrerte navnedager i kalenderen vi bruker. Se morgendagens navnedager under.",
  },
  "data-unavailable": {
    eyebrow: "Navnedagskalender",
    title: "Vi mangler navnedagsdata",
    description: "Vi kan ikke vise dagens navnedager akkurat nå.",
  },
};
