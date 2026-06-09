# Navnedager.no

Norges fineste navnedagskalender. Svarer på ett spørsmål så raskt som mulig:
**hvem har navnedag i dag?**

Bygget som et lite, statisk designprodukt – en moderne almanakk med sterk
typografi, mye luft og et eget illustrasjonssystem.

## Teknisk

- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS v4** (tema definert i `src/app/globals.css`)
- Statisk generert – ingen database, CMS eller eksternt API i drift
- All navnedagsdata ligger lokalt i `src/data/navnedager.json`
- Vercel-kompatibelt

«I dag / i morgen / denne uken» bruker ISR (`revalidate = 3600`) slik at datoen
alltid er korrekt, mens alt annet er forhåndsgenerert som statisk HTML.

## Kom i gang

```bash
npm install
npm run dev      # utvikling på http://localhost:3000
npm run build    # produksjonsbygg
npm run start    # kjør produksjonsbygg
npm run lint     # ESLint
npm run typecheck
```

## Miljøvariabler

| Variabel             | Beskrivelse                                  |
| -------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_GA_ID`  | GA4 måle-ID. Sporing lastes kun når den er satt. |

## Struktur

```
src/
  app/            Ruter (forside, /navn, /dato, /maned, innholdssider, sitemap, robots …)
  components/     Header, Footer, søk, kalenderstripe, illustrasjoner, schema m.m.
  data/           navnedager.json (dato → navn)
  lib/            dato-, data-, SEO- og schema-hjelpere
```

## Datakilde

Navnene følger den moderne norske navnedagskalenderen slik den brukes i norske
almanakker. Ulike utgivere kan ha små forskjeller; se `/datakilder`.

---

Laget og driftet av [Swane Creative](https://swanecreative.no).
