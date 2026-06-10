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
          <g
            transform="rotate(-3 32 32)"
            fill="none"
            stroke="#2B2523"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 18C18 12.4 23.2 12.4 23.2 18" />
            <path d="M29.4 18C29.4 12.4 34.6 12.4 34.6 18" />
            <path d="M40.8 18C40.8 12.4 46 12.4 46 18" />
            <path d="M16.4 18C13.6 18 12.4 19.6 12.6 22L13.2 45.6C13.4 48.2 14.8 49.4 17.4 49.2L48 49.6C50.6 49.6 51.8 48 51.6 45.4L50.8 21.2C50.6 18.8 49.2 17.8 46.6 18Z" />
            <path d="M14.4 27.2C24 26.2 40 26.2 50 27.6" />
            <path d="M22 49.6 18.8 56.8" />
            <path d="M42 49.8 45.2 56.8" />
          </g>
          <rect
            x="26"
            y="32.8"
            width="12"
            height="10.4"
            rx="2.6"
            fill="#D9A441"
            transform="rotate(-3 32 32)"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
