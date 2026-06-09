import type { Metadata } from "next";
import { SITE, absoluteUrl } from "@/lib/site";

type BuildMeta = {
  title: string;
  description: string;
  path: string;
  /** Sett til false for å unngå indeksering (f.eks. dynamiske «i dag»-sider). */
  index?: boolean;
};

/** Felles metadata-bygger med canonical, Open Graph og Twitter. */
export function buildMetadata({
  title,
  description,
  path,
  index = true,
}: BuildMeta): Metadata {
  const url = absoluteUrl(path);
  const fullTitle =
    path === "/" ? title : `${title} – ${SITE.shortName}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: SITE.locale,
      title: fullTitle,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
