import { ImageResponse } from "next/og";

export const alt = "Navnedager.no – Hvem har navnedag i dag?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
        {/* dekor-prikker */}
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

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              border: "5px solid #2B2523",
              display: "flex",
            }}
          />
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
