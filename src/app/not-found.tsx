import Link from "next/link";
import { DeskCalendar, Star } from "@/components/illustrations";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <div className="relative">
        <DeskCalendar className="h-24 w-24 text-coral" />
        <Star className="absolute -right-6 -top-4 h-10 w-10 text-mustard" />
      </div>
      <p className="mt-8 font-display text-7xl font-extrabold">404</p>
      <h1 className="mt-2 font-display text-3xl font-bold">
        Denne dagen fant vi ikke
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        Siden du leter etter finnes ikke – men noen har garantert navnedag i dag.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-soft">
          Hvem har navnedag i dag?
        </Link>
        <Link
          href="/navn"
          className="rounded-xl border border-line bg-paper px-6 py-3 font-bold transition-transform hover:-translate-y-0.5"
        >
          Søk etter navn
        </Link>
      </div>
    </div>
  );
}
