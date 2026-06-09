"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MONTHS_NB, DAYS_IN_MONTH, dateSlug } from "@/lib/dates";
import { trackCta } from "@/lib/analytics";

/** Velg måned og dag for å hoppe rett til en dato-side. */
export default function DatePicker() {
  const router = useRouter();
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);

  const maxDay = DAYS_IN_MONTH[month - 1];
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    trackCta("dato-sok", "forside");
    router.push(`/dato/${dateSlug(month, Math.min(day, maxDay))}`);
  };

  const selectClass =
    "w-full appearance-none rounded-xl border-2 border-ink bg-paper px-4 py-3 text-lg font-semibold outline-none";

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="flex-1">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">
          Dag
        </span>
        <select
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          className={selectClass}
          aria-label="Velg dag"
        >
          {days.map((d) => (
            <option key={d} value={d}>
              {d}.
            </option>
          ))}
        </select>
      </label>
      <label className="flex-[2]">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">
          Måned
        </span>
        <select
          value={month}
          onChange={(e) => {
            const m = Number(e.target.value);
            setMonth(m);
            if (day > DAYS_IN_MONTH[m - 1]) setDay(DAYS_IN_MONTH[m - 1]);
          }}
          className={selectClass}
          aria-label="Velg måned"
        >
          {MONTHS_NB.map((m, i) => (
            <option key={m} value={i + 1}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="rounded-xl border-2 border-ink bg-teal px-6 py-3 text-lg font-bold text-ink shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
      >
        Vis dato
      </button>
    </form>
  );
}
