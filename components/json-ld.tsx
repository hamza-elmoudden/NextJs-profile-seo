/**
 * Server-rendered JSON-LD. `<` is escaped so string content (titles,
 * descriptions from Sanity) can never close the script tag early.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
