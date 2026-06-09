import { SITE, absoluteUrl } from "@/lib/site";

type Json = Record<string, unknown>;

export function organizationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    logo: absoluteUrl("/icon.svg"),
    founder: {
      "@type": "Organization",
      name: SITE.publisher,
      url: SITE.publisherUrl,
    },
  };
}

export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: "nb-NO",
    description: SITE.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/navn?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function webPageSchema(opts: {
  name: string;
  description: string;
  path: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    inLanguage: "nb-NO",
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function itemListSchema(opts: {
  name: string;
  items: { name: string; path: string }[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}
