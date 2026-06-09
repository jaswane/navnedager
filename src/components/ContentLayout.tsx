import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { webPageSchema, breadcrumbSchema } from "@/lib/schema";

type Props = {
  title: string;
  lead?: string;
  crumbs: Crumb[];
  schemaName: string;
  schemaDescription: string;
  path: string;
  children: React.ReactNode;
};

/** Felles ramme for redaksjonelle sider med konsistent typografi. */
export default function ContentLayout({
  title,
  lead,
  crumbs,
  schemaName,
  schemaDescription,
  path,
  children,
}: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd
        data={[
          webPageSchema({ name: schemaName, description: schemaDescription, path }),
          breadcrumbSchema(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <h1 className="font-display text-5xl font-semibold leading-[0.98] sm:text-6xl">
        {title}
      </h1>
      {lead && <p className="mt-5 text-xl text-ink-soft">{lead}</p>}
      <div className="prose-content mt-10 space-y-5 text-lg leading-relaxed">
        {children}
      </div>
    </div>
  );
}
