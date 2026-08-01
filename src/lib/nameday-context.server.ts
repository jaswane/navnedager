// Tynt serverlag: kobler faktisk klokke / preview-dato til den rene dagskonteksten.
// "server-only" hindrer at dette (og env-lesing) havner i klientbundelen.
import "server-only";
import { getNameDayContext, type NameDayContext } from "@/lib/nameday-context";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Server-only preview-dato via NAVNEDAGER_PREVIEW_DATE=YYYY-MM-DD.
 * - Ignoreres på produksjonsdomenet (VERCEL_ENV === "production").
 * - Fungerer lokalt og i Vercel Preview.
 * - Ugyldig format eller ikke-eksisterende dato faller trygt tilbake til null.
 */
export function getPreviewDate(): Date | undefined {
  if (process.env.VERCEL_ENV === "production") return undefined;

  const value = process.env.NAVNEDAGER_PREVIEW_DATE;
  if (!value || !ISO_DATE_PATTERN.test(value)) return undefined;

  const [year, month, day] = value.split("-").map(Number);
  // Kl. 12 UTC unngår midnattskant ved konvertering til Oslo-tid.
  const date = new Date(Date.UTC(year, month - 1, day, 12));

  // Valider at datoen faktisk finnes (avviser f.eks. 2026-02-30).
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return undefined;
  }

  console.warn(`[Navnedager] Preview-dato aktiv: ${value}`);
  return date;
}

/** Dagskontekst for serverkomponenter: preview-dato hvis satt, ellers nå. */
export function getServerNameDayContext(): NameDayContext {
  return getNameDayContext(getPreviewDate() ?? new Date());
}
