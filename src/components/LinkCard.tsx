import Link from "next/link";

type Props = {
  href: string;
  label: string;
  sublabel?: string;
  external?: boolean;
  icon?: React.ReactNode;
};

/** Rolig, konsekvent lenkeboks – brukes på navn-, dato- og månedssider. */
export default function LinkCard({ href, label, sublabel, external, icon }: Props) {
  const inner = (
    <>
      {icon && (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream-deep text-coral-deep">
          {icon}
        </span>
      )}
      <span className="flex-1">
        <span className="block font-semibold leading-snug">{label}</span>
        {sublabel && (
          <span className="block text-sm text-ink-soft">{sublabel}</span>
        )}
      </span>
      <span aria-hidden className="text-ink-soft">
        →
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} rel="noopener" className="linkrow">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className="linkrow">
      {inner}
    </Link>
  );
}
