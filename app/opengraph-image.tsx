import { ImageResponse } from "next/og";
import { PERSON } from "@/lib/seo";

// Route segment config
export const alt = `${PERSON.name} - ${PERSON.jobTitle}, Bangalore`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette (mirrors siteConfig.hero)
const BG = "#FF5A52";
const WORDMARK = "#FFC9C5";
const ACCENT = "#E4FE52";

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
          backgroundColor: BG,
          padding: "72px 80px",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: WORDMARK,
          }}
        >
          <span>thetan.in</span>
          <span style={{ color: ACCENT }}>● available</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 130,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -2,
              color: WORDMARK,
            }}
          >
            TANISHQ
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 40,
              fontWeight: 700,
              color: "#0A0A0A",
            }}
          >
            {PERSON.jobTitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: WORDMARK,
          }}
        >
          LangGraph · FastAPI · React Native · Agentic AI · Bangalore, IN
        </div>
      </div>
    ),
    { ...size },
  );
}
