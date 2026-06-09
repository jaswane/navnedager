type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  icon?: React.ReactNode;
};

/** Sentrert sideoverskrift – felles for undersidene. */
export default function PageHeader({ eyebrow, title, lead, icon }: Props) {
  return (
    <header className="flex flex-col items-center text-center">
      {icon && (
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-mustard/20 text-mustard-deep">
          {icon}
        </div>
      )}
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink-soft">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
        {title}
      </h1>
      {lead && (
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">{lead}</p>
      )}
    </header>
  );
}
