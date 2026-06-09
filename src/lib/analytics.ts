export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Generell hendelsessporing (no-op uten GA4-id). */
export function trackEvent(name: string, params: GtagParams = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/** Sporing av søk i navnedagskalenderen. */
export function trackSearch(query: string, results: number): void {
  trackEvent("search", { search_term: query, results });
}

/** Sporing av klikk på viktige handlinger (CTA). */
export function trackCta(label: string, location: string): void {
  trackEvent("cta_click", { cta_label: label, cta_location: location });
}
