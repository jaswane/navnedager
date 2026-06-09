import Link from "next/link";
import { addDays, dateSlug, monthName, weekdayName } from "@/lib/dates";
import { namesForDate } from "@/lib/navnedager";

type Props = {
  start: { year: number; month: number; day: number };
  count?: number;
  /** Marker første kort som «i dag». */
  highlightFirst?: boolean;
};

const ACCENTS = [
  "text-coral",
  "text-mustard-deep",
  "text-teal-deep",
  "text-forest",
];

/** En visuell kalenderstripe – ikke en tabell, men en rad med dagkort. */
export default function CalendarStrip({
  start,
  count = 7,
  highlightFirst = true,
}: Props) {
  const days = Array.from({ length: count }, (_, i) => {
    const d = addDays(start.year, start.month, start.day, i);
    return {
      ...d,
      names: namesForDate(d.month, d.day),
      weekday: weekdayName(d.year, d.month, d.day),
    };
  });

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
      {days.map((d, i) => {
        const isToday = highlightFirst && i === 0;
        return (
          <li key={`${d.month}-${d.day}`}>
            <Link
              href={`/dato/${dateSlug(d.month, d.day)}`}
              className={`group flex h-full flex-col rounded-2xl border-2 p-3.5 transition-transform hover:-translate-y-1 ${
                isToday
                  ? "border-ink bg-ink text-cream shadow-[4px_4px_0_0_var(--color-mustard)]"
                  : "border-line bg-paper"
              }`}
            >
              <span
                className={`text-[0.7rem] font-bold uppercase tracking-widest ${
                  isToday ? "text-mustard" : "text-ink-soft"
                }`}
              >
                {isToday ? "I dag" : d.weekday.slice(0, 3)}
              </span>
              <span className="mt-1 font-display text-3xl font-semibold leading-none">
                {d.day}.
              </span>
              <span
                className={`text-xs ${isToday ? "text-cream/70" : "text-ink-soft"}`}
              >
                {monthName(d.month)}
              </span>
              <span className="mt-3 flex flex-col gap-0.5">
                {d.names.length > 0 ? (
                  d.names.slice(0, 3).map((n, j) => (
                    <span
                      key={n}
                      className={`font-display text-base font-semibold leading-tight ${
                        isToday ? "text-cream" : ACCENTS[j % ACCENTS.length]
                      }`}
                    >
                      {n}
                    </span>
                  ))
                ) : (
                  <span
                    className={`text-sm italic ${
                      isToday ? "text-cream/60" : "text-ink-soft"
                    }`}
                  >
                    Ingen navnedag
                  </span>
                )}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
