import Link from "next/link";
import { addDays, dateSlug, monthName, weekdayName } from "@/lib/dates";
import { namesForDate } from "@/lib/navnedager";
import { Today } from "@/components/illustrations";

type Props = {
  start: { year: number; month: number; day: number };
  count?: number;
  /** Dato som skal markeres som «i dag». */
  highlight?: { month: number; day: number };
};

/** Visuell kalenderstripe – luftig rad med dagkort, ikke en tabell. */
export default function CalendarStrip({ start, count = 7, highlight }: Props) {
  const days = Array.from({ length: count }, (_, i) => {
    const d = addDays(start.year, start.month, start.day, i);
    return {
      ...d,
      names: namesForDate(d.month, d.day),
      weekday: weekdayName(d.year, d.month, d.day),
      isToday:
        !!highlight && d.month === highlight.month && d.day === highlight.day,
    };
  });

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {days.map((d) => (
        <li key={`${d.month}-${d.day}`}>
          <Link
            href={`/dato/${dateSlug(d.month, d.day)}`}
            aria-current={d.isToday ? "date" : undefined}
            className={`group flex h-full flex-col items-center rounded-2xl px-2 py-4 text-center transition-transform hover:-translate-y-1 ${
              d.isToday
                ? "bg-paper ring-2 ring-hero"
                : "hover:bg-paper"
            }`}
          >
            <span
              className={`font-display text-4xl font-bold leading-none ${
                d.isToday ? "text-hero-deep" : "text-coral-deep"
              }`}
            >
              {d.day}
            </span>
            <span className="mt-1 text-[0.7rem] font-bold uppercase tracking-widest text-ink-soft">
              {monthName(d.month)}
            </span>
            <span className="mt-2.5 flex flex-col gap-0.5">
              {d.names.length > 0 ? (
                d.names.map((n) => (
                  <span
                    key={n}
                    className={`text-sm font-semibold leading-tight ${
                      d.isToday ? "text-hero-deep" : "text-ink"
                    }`}
                  >
                    {n}
                  </span>
                ))
              ) : (
                <span className="text-xs italic text-ink-soft">—</span>
              )}
            </span>
            {d.isToday && (
              <span className="mt-2 flex items-center gap-1 rounded-full bg-hero px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-cream">
                <Today className="h-3 w-3" />
                I dag
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
