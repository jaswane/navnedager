"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CalendarMark } from "@/components/illustrations";

const LEFT = [
  { href: "/", label: "I dag" },
  { href: "/navn", label: "Alle navn" },
];
const RIGHT = [
  { href: "/dato", label: "Søk på dato" },
  { href: "/om-navnedager", label: "Om navnedager" },
];
// Full meny på mobil
const ALL = [
  { href: "/", label: "I dag" },
  { href: "/i-morgen", label: "I morgen" },
  { href: "/denne-uken", label: "Denne uken" },
  { href: "/navn", label: "Alle navn A–Å" },
  { href: "/dato", label: "Søk på dato" },
  { href: "/alle-navnedager", label: "Alle navnedager" },
  { href: "/om-navnedager", label: "Om navnedager" },
];

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2.5" aria-label="Navnedager.no – forside">
      <CalendarMark className="h-8 w-8 text-coral" />
      <span className="rounded-lg bg-mustard px-3 py-1 font-display text-lg font-bold uppercase tracking-wide text-ink">
        Navnedager<span className="text-ink/70">.no</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLink = (item: { href: string; label: string }) => (
    <Link
      key={item.href}
      href={item.href}
      aria-current={isActive(item.href) ? "page" : undefined}
      className={`text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
        isActive(item.href)
          ? "text-ink underline decoration-mustard decoration-2 underline-offset-8"
          : "text-ink-soft hover:text-ink"
      }`}
    >
      {item.label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-sm">
      {/* Desktop: sentrert logo med delt meny */}
      <div className="mx-auto hidden max-w-6xl grid-cols-3 items-center px-6 py-4 md:grid">
        <nav className="flex items-center gap-7" aria-label="Hovedmeny venstre">
          {LEFT.map(navLink)}
        </nav>
        <div className="flex justify-center">
          <Logo />
        </div>
        <nav className="flex items-center justify-end gap-7" aria-label="Hovedmeny høyre">
          {RIGHT.map(navLink)}
        </nav>
      </div>

      {/* Mobil: logo + hamburger */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:hidden">
        <Logo onClick={() => setOpen(false)} />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobil-meny"
          aria-label={open ? "Lukk meny" : "Åpne meny"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper"
        >
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 block h-0.5 w-5 bg-ink transition-transform ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-ink transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 block h-0.5 w-5 bg-ink transition-transform ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </div>

      {open && (
        <nav id="mobil-meny" className="border-t border-line bg-cream px-4 pb-4 pt-2 md:hidden" aria-label="Mobilmeny">
          {ALL.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`block rounded-xl px-4 py-3 text-lg font-semibold ${
                isActive(item.href) ? "bg-ink text-cream" : "text-ink hover:bg-cream-deep"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
