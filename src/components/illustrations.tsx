/**
 * Navnedager.no – eget håndtegnet illustrasjonssystem.
 *
 * Felles språk: én strektykkelse, runde hjørner (linecap/linejoin = round),
 * lett skjeve linjer, fungerer i én farge (currentColor) og i små størrelser.
 * Ikke generiske ikonbiblioteker – alt ser ut som tegnet av samme hånd.
 */

type IconProps = {
  className?: string;
  title?: string;
};

// Felles strek for ikon-skala (32-rutenett).
const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const solid = { fill: "currentColor", stroke: "none" };

function a11y(title?: string) {
  return {
    role: title ? ("img" as const) : ("presentation" as const),
    "aria-hidden": title ? undefined : true,
  };
}

/* ------------------------------------------------------------------ */
/* Hovedmerke: håndtegnet bordkalender (logo, favicon, OG)            */
/* ------------------------------------------------------------------ */

export function DeskCalendar({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" {...line} className={className} {...a11y(title)}>
      {title && <title>{title}</title>}
      <g transform="rotate(-3 16 16)">
        {/* spiralringer */}
        <path d="M9 9C9 6.1 11.6 6.1 11.6 9" />
        <path d="M14.7 9C14.7 6.1 17.3 6.1 17.3 9" />
        <path d="M20.4 9C20.4 6.1 23 6.1 23 9" />
        {/* kalenderark – litt skjevt */}
        <path d="M8.2 9C6.8 9 6.2 9.8 6.3 11L6.6 22.8C6.7 24.1 7.4 24.7 8.7 24.6L24 24.8C25.3 24.8 25.9 24 25.8 22.7L25.4 10.6C25.3 9.4 24.6 8.9 23.3 9Z" />
        {/* måned-stripe */}
        <path d="M7.2 13.6C12 13.1 20 13.1 25 13.8" />
        {/* markert dag */}
        <rect x="13" y="16.4" width="5.8" height="5.1" rx="1.4" {...solid} />
        {/* bein */}
        <path d="M11 24.8 9.4 28.4" />
        <path d="M21 24.9 22.6 28.4" />
      </g>
    </svg>
  );
}

/** Større variant av bordkalenderen til introseksjoner. */
export function CalendarScene({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 60 56" {...line} strokeWidth={2.2} className={className} {...a11y(title)}>
      {title && <title>{title}</title>}
      {/* liten gnist for sjarm */}
      <path
        d="M52 7C52.4 11 52.8 12.6 56.8 13C52.8 13.4 52.4 15 52 19C51.6 15 51.2 13.4 47.2 13C51.2 12.6 51.6 11 52 7Z"
        {...solid}
      />
      <g transform="rotate(-2 30 30)">
        {/* spiralringer */}
        <path d="M16 15C16 9.5 21 9.5 21 15" />
        <path d="M25.5 15C25.5 9.5 30.5 9.5 30.5 15" />
        <path d="M35 15C35 9.5 40 9.5 40 15" />
        {/* kalenderark */}
        <path d="M13 15C10.6 15 9.7 16.4 9.9 18.6L10.3 43C10.5 45.3 11.8 46.4 14.1 46.2L47 46.6C49.3 46.6 50.5 45.2 50.3 42.9L49.6 18C49.4 15.9 48 15.1 45.7 15.3Z" />
        {/* måned-stripe */}
        <path d="M12.5 24C22 23 38 23 47.5 24.3" />
        {/* rutelinjer */}
        <path d="M16 31.5 30 31.5" />
        <path d="M16 38 26 38" />
        {/* markert dag */}
        <rect x="33.5" y="29" width="12.5" height="11.5" rx="2.2" {...solid} />
        {/* stativ */}
        <path d="M20 46.2 16.6 52.4" />
        <path d="M40 46.6 43.4 52.4" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Ikonsett – samme hånd                                              */
/* ------------------------------------------------------------------ */

/** Navn A–Å: håndtegnet navnelapp med en skrevet navne-strek. */
export function TagName({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" {...line} className={className} {...a11y(title)}>
      {title && <title>{title}</title>}
      <path d="M12.6 7.6 25 7.8C26.5 7.8 27.3 8.6 27.3 10.1L27.3 21.7C27.3 23.2 26.5 24.1 25 24L12.6 23.8 5.3 16.3C4.9 15.9 4.9 15.9 5.3 15.5Z" />
      <circle cx="10.6" cy="15.9" r="1.5" {...solid} />
      <path d="M14.2 16.3C16 14.8 17.4 17.6 19.4 16.2 21 15.1 22.6 15.2 24 16.4" />
    </svg>
  );
}

/** Dato: ett kalenderark med brettet hjørne og markert dag. */
export function DatePage({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" {...line} className={className} {...a11y(title)}>
      {title && <title>{title}</title>}
      <path d="M8.6 7 20 7 25 12 25 23.4C25 24.7 24.3 25.5 23 25.5L9 25.5C7.7 25.5 7 24.8 7 23.5L7 8.5C7 7.7 7.6 7 8.6 7Z" />
      <path d="M20 7 20 12 25 12" />
      <path d="M11 14.6C14 14.1 18 14.1 21 14.7" />
      <rect x="13.4" y="17.4" width="5.2" height="5.1" rx="1.3" {...solid} />
    </svg>
  );
}

/** Alle navnedager: en liten stabel med kalenderark (almanakk). */
export function Almanakk({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" {...line} className={className} {...a11y(title)}>
      {title && <title>{title}</title>}
      {/* arket bak som titter fram */}
      <path d="M10.6 9.2 21 9C22.3 9 23 9.7 23 11L23 21" />
      {/* fremste ark */}
      <path d="M8 11.6 18 11.6C19.3 11.6 20 12.3 20 13.6L20 23.4C20 24.7 19.3 25.4 18 25.4L8 25.4C6.7 25.4 6 24.7 6 23.4L6 13.6C6 12.3 6.7 11.6 8 11.6Z" />
      <path d="M9.5 16.2 16.4 16.2" />
      <path d="M9.5 19.6 14 19.6" />
      <circle cx="16.4" cy="20.4" r="1.5" {...solid} />
    </svg>
  );
}

/** I dag: en liten sol. */
export function Today({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" {...line} className={className} {...a11y(title)}>
      {title && <title>{title}</title>}
      <circle cx="16" cy="16" r="4.6" />
      <path d="M22.6 16 26 16" />
      <path d="M20.6 20.6 23.1 23.1" />
      <path d="M16 22.6 16 26" />
      <path d="M11.4 20.6 8.9 23.1" />
      <path d="M9.4 16 6 16" />
      <path d="M11.4 11.4 8.9 8.9" />
      <path d="M16 9.4 16 6" />
      <path d="M20.6 11.4 23.1 8.9" />
    </svg>
  );
}

/** I morgen: en månesigd med en liten gnist. */
export function Tomorrow({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" {...line} className={className} {...a11y(title)}>
      {title && <title>{title}</title>}
      <path d="M19.5 6.5C14 7 9.8 11.6 9.8 17.1 9.8 22.6 14 27.2 19.5 27.6 15.4 25.1 13.2 21.3 13.2 17.1 13.2 12.9 15.4 9 19.5 6.5Z" />
      <path d="M24 7.5C24.3 10.2 24.6 11.4 27.5 11.7 24.6 12 24.3 13.2 24 15.9 23.7 13.2 23.4 12 20.5 11.7 23.4 11.4 23.7 10.2 24 7.5Z" {...solid} />
    </svg>
  );
}

/** Liten gnist/stjerne – aksent (Navnetoppen, footer). */
export function Star({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" {...line} className={className} {...a11y(title)}>
      {title && <title>{title}</title>}
      <path d="M16 4C16.6 10.4 17.6 13.4 24 14 17.6 14.6 16.6 17.6 16 24 15.4 17.6 14.4 14.6 8 14 14.4 13.4 15.4 10.4 16 4Z" {...solid} />
    </svg>
  );
}
