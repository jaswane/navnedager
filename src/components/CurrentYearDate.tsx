"use client";

import { useEffect, useState } from "react";
import { isoWeek, weekdayName, osloToday } from "@/lib/dates";

/**
 * Viser hvilken ukedag og uke en fast dato faller på i inneværende år.
 * Holder dato-sidene statiske mens denne ene detaljen alltid er oppdatert.
 */
export default function CurrentYearDate({
  month,
  day,
}: {
  month: number;
  day: number;
}) {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(osloToday().year);
  }, []);

  if (year === null) return null;

  const weekday = weekdayName(year, month, day);
  const week = isoWeek(year, month, day);

  return (
    <p className="text-ink-soft">
      I {year} faller datoen på en <strong className="text-ink">{weekday}</strong>,
      i uke <strong className="text-ink">{week}</strong>.
    </p>
  );
}
