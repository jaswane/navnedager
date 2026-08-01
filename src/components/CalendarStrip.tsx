import Link from "next/link";
import { addDays, dateSlug, monthName, weekdayName, cap } from "@/lib/dates";
import { namesForDate } from "@/lib/navnedager";
import { Today, Tomorrow } from "@/components/illustrations";

type Props = {
  start: { year: number; month: number; day: number };
  count?: number;
  /** Dato som skal markeres som «i dag». */
  highlight?: { month: number; day: number };
  /** Dato som skal markeres som «i morgen» og lenke til /i-morgen. */
  tomorrow?: { month: number; day: number };
  /** Vis ukedag på kortene (brukes når stripen ikke er mandag–søndag). */
  showWeekday?: boolean;
};

/** Visuell kalenderstripe – luftig rad med dagkort, ikke en tabell. */
export default function CalendarStrip({
  start,
  count = 7,
  highlight,
  tomorrow,
  showWeekday = false,
}: Props) {
  const days = Array.from({ length: count }, (_, i) => {
    const d = addDays(start.year, start.month, start.day, i);
    const isToday =
      !!highlight && d.month === highlight.month && d.day === highlight.day;
    const isTomorrow =
      !!tomorrow && d.month === tomorrow.month && d.day === tomorrow.day;
    return {
      ...d,
      names: namesForDate(d.month, d.day),
      weekday: weekdayName(d.year, d.month, d.day),
      isToday,
      isTomorrow,
    };
  });

  const badge =
    "flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest";

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {days.map((d) => (
        <li key={`${d.month}-${d.day}`} className="flex flex-col items-center">
          <Link
            href={`/dato/${dateSlug(d.month, d.day)}`}
            aria-current={d.isToday ? "date" : undefined}
            className={`flex w-full flex-1 flex-col items-center rounded-2xl px-2 py-3.5 text-center transition-transform hover:-translate-y-1 ${
              d.isToday ? "bg-paper ring-2 ring-hero" : "hover:bg-paper"
            }`}
          >
            {showWeekday && (
              <span className="mb-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-ink-soft">
                {cap(d.weekday).slice(0, 3)}
              </span>
            )}
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
            <span className="mt-2 flex flex-col gap-0.5">
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
          </Link>

          {/* Merkelappene ligger utenfor kortlenken, slik at «I morgen»
              kan være en egen lenke til /i-morgen (ingen nøstede lenker). */}
          {d.isToday && (
            <span className={`${badge} mt-2 bg-hero text-cream`}>
              <Today className="h-3 w-3" />I dag
            </span>
          )}
          {d.isTomorrow && (
            <Link
              href="/i-morgen"
              className={`${badge} mt-2 border border-line bg-paper text-ink-soft transition-colors hover:border-coral hover:text-coral-deep`}
            >
              <Tomorrow className="h-3 w-3" />I morgen
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
