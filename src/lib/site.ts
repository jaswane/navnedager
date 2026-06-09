export const SITE = {
  name: "Navnedager.no",
  shortName: "Navnedager",
  url: "https://navnedager.no",
  description:
    "Hvem har navnedag i dag? Navnedager.no gir deg dagens navnedag med en gang – søk på navn eller dato i Norges fineste navnedagskalender.",
  locale: "nb_NO",
  publisher: "Swane Creative",
  publisherUrl: "https://swanecreative.no",
} as const;

/** Bygger en absolutt URL fra en sti. */
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
