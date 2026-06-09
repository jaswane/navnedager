import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { allNames } from "@/lib/navnedager";
import { MONTHS_NB, allDates, dateSlug } from "@/lib/dates";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "/",
    "/i-morgen",
    "/denne-uken",
    "/alle-navnedager",
    "/navn",
    "/om-navnedager",
    "/datakilder",
    "/personvern",
    "/ansvarsfraskrivelse",
    "/om",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  for (const m of MONTHS_NB) {
    entries.push({
      url: `${SITE.url}/maned/${m}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const d of allDates()) {
    entries.push({
      url: `${SITE.url}/dato/${dateSlug(d.month, d.day)}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

  for (const n of allNames()) {
    entries.push({
      url: `${SITE.url}/navn/${n.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

  return entries;
}
