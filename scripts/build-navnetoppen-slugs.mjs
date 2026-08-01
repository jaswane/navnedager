// Genererer listen over VERIFISERTE navnesider på Navnetoppen.no.
//
// Kilde:   https://navnetoppen.no/sitemap.xml (offentlig sitemap)
// Metode:  hent sitemap -> plukk ut /navn/<slug> -> snitt mot våre egne navn
//          -> valider at hver lagrede destinasjon svarer 200.
// Utdata:  src/data/navnetoppen-slugs.json
//
// Kjøres MANUELT (`node scripts/build-navnetoppen-slugs.mjs`). Selve bygget
// leser kun den ferdige JSON-filen, og er derfor ikke avhengig av at
// Navnetoppen.no er tilgjengelig.

import { readFileSync, writeFileSync } from "node:fs";

const SITEMAP = "https://navnetoppen.no/sitemap.xml";
const CONCURRENCY = 12;

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .replace(/ä/g, "ae").replace(/ö/g, "o").replace(/ü/g, "u")
    .replace(/[éèê]/g, "e").replace(/[áàâ]/g, "a").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const dataUrl = new URL("../src/data/navnedager.json", import.meta.url);
const outUrl = new URL("../src/data/navnetoppen-slugs.json", import.meta.url);

// 1) Hent sitemap
const res = await fetch(SITEMAP);
if (!res.ok) throw new Error(`Sitemap ${SITEMAP} -> ${res.status}`);
const xml = await res.text();

const sitemapSlugs = new Set(
  [...xml.matchAll(/<loc>https:\/\/navnetoppen\.no\/navn\/([^<\/]+)<\/loc>/g)].map(
    (m) => m[1].trim()
  )
);
console.log(`Sitemap: ${sitemapSlugs.size} navnesider på Navnetoppen.no`);

// 2) Snitt mot våre egne navn
const data = JSON.parse(readFileSync(dataUrl, "utf8"));
const ourNames = [...new Set(Object.values(data).flat())];
const candidates = [...new Set(ourNames.map(slugify))]
  .filter((s) => sitemapSlugs.has(s))
  .sort();
console.log(
  `Våre navn: ${ourNames.length} – kandidater med side: ${candidates.length}`
);

// 3) Valider at hver lagrede destinasjon faktisk svarer 200
const verified = [];
const failed = [];
let i = 0;
async function worker() {
  while (i < candidates.length) {
    const slug = candidates[i++];
    const url = `https://navnetoppen.no/navn/${slug}`;
    try {
      const r = await fetch(url, { method: "HEAD", redirect: "follow" });
      if (r.status === 200) verified.push(slug);
      else failed.push(`${slug} (${r.status})`);
    } catch (err) {
      failed.push(`${slug} (${err.message})`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
verified.sort();

console.log(`Validert 200: ${verified.length}`);
if (failed.length) console.log(`Feilet (utelatt): ${failed.length} – ${failed.slice(0, 10).join(", ")}`);

// 4) Skriv fil med kildedokumentasjon
const payload = {
  _source: SITEMAP,
  _method:
    "Slugs hentet fra Navnetoppen.no sitt offentlige sitemap, snittet mot navnene i navnedager.json, deretter validert med HTTP 200.",
  _generated: new Date().toISOString().slice(0, 10),
  _count: verified.length,
  _script: "scripts/build-navnetoppen-slugs.mjs",
  slugs: verified,
};
writeFileSync(outUrl, JSON.stringify(payload, null, 2) + "\n");
console.log(`Skrev ${verified.length} verifiserte slugs til src/data/navnetoppen-slugs.json`);
