"use client";

import { useEffect, useState } from "react";
import { isoWeek, weekdayName, osloToday, formatDayMonth, cap } from "@/lib/dates";

type Props = {
  month: number;
  day: number;
  /** "sentence" = navneside, "stamp" = datoside. */
  variant?: "sentence" | "stamp";
};

/**
 * Viser ukedag og uke for en fast dato i inneværende år.
 * Holder sidene statiske mens denne ene detaljen alltid er oppdatert.
 */
export default function CurrentYearDate({ month, day, variant = "sentence" }: Props) {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(osloToday().year);
  }, []);

  if (year === null) {
    // Plassholder med samme høyde for å unngå layout-hopp.
    return <span className="inline-block h-[1.5em]" aria-hidden />;
  }

  const weekday = weekdayName(year, month, day);
  const week = isoWeek(year, month, day);

  if (variant === "stamp") {
    return (
      <>
        {cap(weekday)} {formatDayMonth(month, day)} {year} · uke {week}
      </>
    );
  }

  return (
    <>
      I {year} faller {formatDayMonth(month, day)} på en{" "}
      <strong className="text-ink">{weekday}</strong>, i uke{" "}
      <strong className="text-ink">{week}</strong>.
    </>
  );
}
