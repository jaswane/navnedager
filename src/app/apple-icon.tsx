import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8F5F0",
          borderRadius: 40,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 64 64">
          <rect
            x="12"
            y="16"
            width="40"
            height="36"
            rx="5"
            fill="none"
            stroke="#2B2523"
            strokeWidth="3.5"
          />
          <path d="M12 26h40" stroke="#2B2523" strokeWidth="3.5" />
          <path
            d="M24 11v10M40 11v10"
            stroke="#D98484"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="32" cy="40" r="7" fill="#D9A441" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
