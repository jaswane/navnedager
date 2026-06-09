"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CalendarMark } from "@/components/illustrations";

const NAV = [
  { href: "/", label: "I dag" },
  { href: "/i-morgen", label: "I morgen" },
  { href: "/denne-uken", label: "Denne uken" },
  { href: "/navn", label: "Navn A–Å" },
  { href: "/alle-navnedager", label: "Alle navnedager" },
  { href: "/om", label: "Om" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <CalendarMark className="h-7 w-7 text-coral" />
          <span className="font-display text-xl font-semibold tracking-tight">
            Navnedager<span className="text-mustard">.no</span>
          </span>
        </Link>

        {/* Desktop-meny */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Hovedmeny">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                isActive(item.href)
                  ? "bg-ink text-cream"
                  : "text-ink-soft hover:bg-cream-deep hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobil-knapp */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobil-meny"
          aria-label={open ? "Lukk meny" : "Åpne meny"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper md:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-ink transition-transform ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-ink transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-ink transition-transform ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobil-meny */}
      {open && (
        <nav
          id="mobil-meny"
          className="border-t border-line bg-cream px-4 pb-4 pt-2 md:hidden"
          aria-label="Mobilmeny"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`block rounded-xl px-4 py-3 text-lg font-semibold ${
                isActive(item.href)
                  ? "bg-ink text-cream"
                  : "text-ink hover:bg-cream-deep"
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
