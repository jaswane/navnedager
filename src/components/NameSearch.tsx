"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import type { SearchItem } from "@/lib/navnedager";
import { slugify, normalizeName } from "@/lib/navnedager";
import { trackSearch } from "@/lib/analytics";

type Props = {
  items: SearchItem[];
  /** Kompakt variant til toppen av forsiden. */
  autoFocus?: boolean;
};

export default function NameSearch({ items, autoFocus }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const matches = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) return [];
    // Primærnøkkel: normalisert navn (bevarer æ/ø/å). Sekundær: tolerant slug.
    const nq = normalizeName(trimmed);
    const sq = slugify(trimmed);
    const exact: SearchItem[] = [];
    const starts: SearchItem[] = [];
    const tolerant: SearchItem[] = [];
    for (const item of items) {
      if (item.k === nq) exact.push(item);
      else if (item.k.startsWith(nq)) starts.push(item);
      else if (sq.length > 0 && (item.s.startsWith(sq) || item.s.includes(sq)))
        tolerant.push(item);
    }
    return [...exact, ...starts, ...tolerant].slice(0, 8);
  }, [items, query]);

  const go = (item: SearchItem) => {
    trackSearch(query.trim(), matches.length);
    router.push(`/navn/${item.s}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!matches.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(matches[active] ?? matches[0]);
    }
  };

  const open = focused && matches.length > 0;

  return (
    <div className="relative">
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-5 py-3.5 shadow-sm transition-colors focus-within:border-coral">
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ink-soft" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onFocus={() => {
            if (blurTimer.current) clearTimeout(blurTimer.current);
            setFocused(true);
          }}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setFocused(false), 120);
          }}
          onKeyDown={onKeyDown}
          placeholder="Søk etter et navn …"
          aria-label="Søk etter navn"
          role="combobox"
          aria-expanded={open}
          aria-controls="navnesok-resultater"
          autoComplete="off"
          className="w-full bg-transparent text-lg outline-none placeholder:text-ink-soft/70"
        />
      </div>

      {open && (
        <ul
          id="navnesok-resultater"
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-line bg-paper shadow-lg"
        >
          {matches.map((item, i) => (
            <li key={item.s} role="option" aria-selected={i === active}>
              <Link
                href={`/navn/${item.s}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => trackSearch(query.trim(), matches.length)}
                className={`flex items-center justify-between px-5 py-3 ${
                  i === active ? "bg-cream-deep" : ""
                }`}
              >
                <span className="font-display text-lg font-semibold">{item.n}</span>
                <span className="text-sm text-ink-soft">{item.l}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
