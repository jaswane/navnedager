/**
 * Lite illustrasjonssystem – håndtegnet SVG, ingen stockfoto.
 * Alle bruker currentColor slik at de tar farge fra teksten.
 */

type IconProps = {
  className?: string;
  title?: string;
};

function base(title?: string) {
  return {
    role: title ? ("img" as const) : ("presentation" as const),
    "aria-hidden": title ? undefined : true,
  };
}

export function CalendarMark({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} {...base(title)}>
      {title && <title>{title}</title>}
      <rect
        x="6"
        y="12"
        width="52"
        height="46"
        rx="6"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path d="M6 24h52" stroke="currentColor" strokeWidth="3" />
      <path d="M20 6v12M44 6v12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="42" r="7" fill="currentColor" />
    </svg>
  );
}

export function Star({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} {...base(title)}>
      {title && <title>{title}</title>}
      <path
        d="M32 4c1.6 12.4 7.2 18 19.6 19.6C39.2 25.2 33.6 30.8 32 43.2 30.4 30.8 24.8 25.2 12.4 23.6 24.8 22 30.4 16.4 32 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function NameTag({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 72 48" fill="none" className={className} {...base(title)}>
      {title && <title>{title}</title>}
      <path
        d="M4 8h40l24 16-24 16H4z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="14" cy="24" r="3.5" fill="currentColor" />
    </svg>
  );
}

export function Flower({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} {...base(title)}>
      {title && <title>{title}</title>}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="18"
          rx="7"
          ry="13"
          fill="currentColor"
          opacity="0.9"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="7" fill="var(--color-cream)" />
    </svg>
  );
}

export function PaperCorner({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} {...base(title)}>
      {title && <title>{title}</title>}
      <path d="M0 0h32L48 16v32H0z" fill="currentColor" opacity="0.18" />
      <path d="M32 0v16h16" stroke="currentColor" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

export function Sun({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} {...base(title)}>
      {title && <title>{title}</title>}
      <circle cx="32" cy="32" r="12" fill="currentColor" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x1 = 32 + Math.cos(a) * 18;
        const y1 = 32 + Math.sin(a) * 18;
        const x2 = 32 + Math.cos(a) * 26;
        const y2 = 32 + Math.sin(a) * 26;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export function AtoZ({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} {...base(title)}>
      {title && <title>{title}</title>}
      <text
        x="6"
        y="30"
        fontFamily="var(--font-sans)"
        fontSize="26"
        fontWeight="800"
        fill="currentColor"
      >
        A
      </text>
      <text
        x="32"
        y="54"
        fontFamily="var(--font-sans)"
        fontSize="26"
        fontWeight="800"
        fill="currentColor"
      >
        Å
      </text>
      <path
        d="M24 18l8 0M24 18l3-3M24 18l3 3"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40 46l-8 0M40 46l-3-3M40 46l-3 3"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Håndtegnet bordkalender til introseksjoner/header. */
export function DeskCalendar({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 96 80" fill="none" className={className} {...base(title)}>
      {title && <title>{title}</title>}
      {/* stativ */}
      <path
        d="M14 64h68l-6 8H20z"
        fill="currentColor"
        opacity="0.18"
      />
      {/* kalenderark */}
      <rect
        x="20"
        y="18"
        width="56"
        height="46"
        rx="5"
        fill="var(--color-cream)"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path d="M20 30h56" stroke="currentColor" strokeWidth="3" />
      {/* ringer */}
      <path
        d="M32 12v10M48 12v10M64 12v10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* dag-markering */}
      <circle cx="48" cy="47" r="9" fill="currentColor" opacity="0.85" />
      <path
        d="M30 44h8M58 44h8M30 54h36"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

export function Leaf({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} {...base(title)}>
      {title && <title>{title}</title>}
      <path
        d="M52 12C28 12 12 28 12 52c24 0 40-16 40-40Z"
        fill="currentColor"
      />
      <path
        d="M20 44C30 34 38 26 46 20"
        stroke="var(--color-cream)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
