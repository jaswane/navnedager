type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Skriver ut JSON-LD strukturert data i en <script>-tag. */
export default function JsonLd({ data }: JsonLdProps) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
