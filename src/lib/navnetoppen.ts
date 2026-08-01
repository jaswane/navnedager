// Lenking til søstersiden Navnetoppen.no.
//
// Vi antar ALDRI at en dyplenke finnes. Listen over verifiserte navnesider er
// generert fra Navnetoppen.no sitt offentlige sitemap og validert med HTTP 200
// (se scripts/build-navnetoppen-slugs.mjs). Bygget leser bare den ferdige
// JSON-filen og er derfor ikke avhengig av at Navnetoppen.no er oppe.

import verified from "@/data/navnetoppen-slugs.json";

const VERIFIED = new Set((verified as { slugs: string[] }).slugs);

/** Dokumentert oversiktsside brukt når et navn ikke har egen side. */
export const NAVNETOPPEN_OVERVIEW = "https://navnetoppen.no/populaere-navn";
export const NAVNETOPPEN_HOME = "https://navnetoppen.no";

/** Når listen sist ble generert (fra kildefilen). */
export const NAVNETOPPEN_GENERATED = (verified as { _generated: string })._generated;

export type NavnetoppenLink = {
  href: string;
  label: string;
  sublabel: string;
  /** true = verifisert dyplenke til navnets egen side. */
  verified: boolean;
};

/** Finnes det en verifisert Navnetoppen-side for denne slug-en? */
export function hasNavnetoppenPage(slug: string): boolean {
  return VERIFIED.has(slug);
}

/**
 * Lenken som skal vises på en navneside.
 * Verifisert side -> dyplenke. Ellers -> nøytral oversiktslenke.
 */
export function navnetoppenLink(name: string, slug: string): NavnetoppenLink {
  if (hasNavnetoppenPage(slug)) {
    return {
      href: `https://navnetoppen.no/navn/${slug}`,
      label: `Se popularitet og statistikk for ${name}`,
      sublabel: "på Navnetoppen.no",
      verified: true,
    };
  }
  return {
    href: NAVNETOPPEN_OVERVIEW,
    label: "Utforsk populære navn på Navnetoppen.no",
    sublabel: "Vi har ingen egen statistikkside for dette navnet",
    verified: false,
  };
}
