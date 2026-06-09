// Deterministisk bygging av navnedager.json fra nummeruke.no (mainstream-liste).
// Parser rå HTML – ingen språkmodell involvert. Engangsskript (ikke del av appen).
import { writeFileSync } from "node:fs";

const MONTHS = [
  ["januar", 1],
  ["februar", 2],
  ["mars", 3],
  ["april", 4],
  ["mai", 5],
  ["juni", 6],
  ["juli", 7],
  ["august", 8],
  ["september", 9],
  ["oktober", 10],
  ["november", 11],
  ["desember", 12],
];

function decode(s) {
  return s
    .replace(/&aelig;/g, "æ").replace(/&AElig;/g, "Æ")
    .replace(/&oslash;/g, "ø").replace(/&Oslash;/g, "Ø")
    .replace(/&aring;/g, "å").replace(/&Aring;/g, "Å")
    .replace(/&amp;/g, "&")
    .trim();
}

const out = {};

for (const [slug, num] of MONTHS) {
  const url = `https://nummeruke.no/navnedager/${slug}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const html = await res.text();

  const rows = html.split(/<tr/).slice(1);
  for (const row of rows) {
    // Datolenke: /navnedager/<slug>/<dag>
    const dm = row.match(new RegExp(`/navnedager/${slug}/(\\d+)`));
    if (!dm) continue;
    const day = Number(dm[1]);
    // Navnelenker: /navnedager/<navnslug> (uten ekstra skråstrek)
    const names = [];
    const re = /<a[^>]*href="\/navnedager\/[^"/]+"[^>]*>([^<]+)<\/a>/g;
    let m;
    while ((m = re.exec(row)) !== null) {
      names.push(decode(m[1]));
    }
    out[`${num}-${day}`] = names;
  }
}

// Sorter kronologisk og sørg for at ALLE 366 dager finnes (tom liste = ingen navnedag)
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const sorted = {};
for (const [, num] of MONTHS) {
  for (let d = 1; d <= DAYS_IN_MONTH[num - 1]; d++) {
    const k = `${num}-${d}`;
    sorted[k] = out[k] ?? [];
  }
}

writeFileSync(
  new URL("../src/data/navnedager.json", import.meta.url),
  JSON.stringify(sorted, null, 2) + "\n"
);

// Oppsummering + stikkprøver
const keys = Object.keys(sorted);
const totalNames = keys.reduce((s, k) => s + sorted[k].length, 0);
console.log("Dager:", keys.length, "Navn totalt:", totalNames);
const spot = ["1-1", "2-14", "5-17", "6-9", "6-24", "7-29", "12-24", "12-25", "12-31", "2-29"];
for (const k of spot) console.log(k, "=>", JSON.stringify(sorted[k]));
