import { ImageResponse } from "next/og";

export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F8F5F0",
          padding: 80,
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 90,
            right: 90,
            width: 120,
            height: 120,
            borderRadius: 60,
            background: "#73C4C8",
            opacity: 0.5,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 120,
            right: 200,
            width: 70,
            height: 70,
            borderRadius: 35,
            background: "#D9A441",
            opacity: 0.55,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* håndtegnet bordkalender (bygget av divs for OG) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: "rotate(-3deg)",
            }}
          >
            <div style={{ display: "flex", gap: 7, marginBottom: -5 }}>
              <div style={{ width: 6, height: 12, borderRadius: 3, border: "3px solid #2B2523" }} />
              <div style={{ width: 6, height: 12, borderRadius: 3, border: "3px solid #2B2523" }} />
              <div style={{ width: 6, height: 12, borderRadius: 3, border: "3px solid #2B2523" }} />
            </div>
            <div
              style={{
                width: 60,
                height: 54,
                borderRadius: 12,
                border: "4px solid #2B2523",
                background: "#FFFDF9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 24, height: 20, borderRadius: 5, background: "#D9A441" }} />
            </div>
          </div>
          <span style={{ fontSize: 34, color: "#2B2523", fontWeight: 700 }}>
            Navnedager.no
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 40, color: "#6B615B" }}>
            Hvem har navnedag i dag?
          </span>
          <span
            style={{
              fontSize: 150,
              color: "#2B2523",
              fontWeight: 700,
              lineHeight: 1,
              marginTop: 8,
            }}
          >
            Navnedager
            <span style={{ color: "#D9A441" }}>.no</span>
          </span>
          <span style={{ fontSize: 36, color: "#C96B6B", marginTop: 24 }}>
            Norges fineste navnedagskalender
          </span>
        </div>

        <span style={{ fontSize: 28, color: "#6B615B" }}>
          Søk på navn eller dato · Raskt og gratis
        </span>
      </div>
    ),
    { ...size }
  );
}
