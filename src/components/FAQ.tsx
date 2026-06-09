export type FaqItem = { question: string; answer: string };

/** Tilgjengelig FAQ uten JavaScript (native <details>). */
export default function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border-2 border-ink bg-paper">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-lg font-semibold marker:hidden">
            {item.question}
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-ink text-xl leading-none transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="px-5 pb-5 text-ink-soft">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
