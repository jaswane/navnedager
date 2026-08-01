// Tekstmaler for navnesider. Rene funksjoner – enkle å teste.
import { formatDayMonth } from "@/lib/dates";

/** "Anders" · "Anders og Ana" · "A, B og C" */
export function joinNames(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} og ${names[names.length - 1]}`;
}

/**
 * Meta description for en navneside.
 * Direkte svar først, deretter hvem datoen deles med, og til slutt hva siden
 * faktisk viser. Beskriver kun innhold som finnes på siden: ukedag og uke
 * server-rendres, og siden lenker videre inn i navnedagskalenderen.
 */
export function nameMetaDescription(
  name: string,
  month: number,
  day: number,
  others: string[]
): string {
  const date = formatDayMonth(month, day);
  const shared = others.length > 0 ? `, sammen med ${joinNames(others)}` : "";
  return `${name} har navnedag ${date}${shared}. Se hvilken ukedag og uke datoen faller på, og utforsk hele den norske navnedagskalenderen.`;
}
