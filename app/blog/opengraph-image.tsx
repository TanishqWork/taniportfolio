import { ImageResponse } from "next/og";
import { sortedPosts } from "@/lib/blog";

/**
 * OG card for the blog index.
 *
 * Defined explicitly rather than inherited from the root `opengraph-image`:
 * `app/blog/page.tsx` declares its own `openGraph` object, and the index was
 * shipping with no image at all — a bare link preview on every share.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Writing — Tanishq Bhosale";

const ACCENT = "#E4FE52";

export default function BlogOgImage() {
  const posts = sortedPosts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0A0A0A",
          padding: "68px 76px",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span>thetan.in/blog</span>
          <span style={{ color: ACCENT }}>
            ● {posts.length} post{posts.length === 1 ? "" : "s"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
              color: "#FFFFFF",
              textTransform: "uppercase",
              maxWidth: 1000,
            }}
          >
            Notes from shipping LLMs to prod
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 27,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.55)",
              maxWidth: 940,
            }}
          >
            Grounding and anti-fabrication, verify-and-repair loops, LLM
            evaluation, and self-hosted AI infrastructure.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          <span>Tanishq Bhosale — Full Stack &amp; AI Engineer</span>
          <span
            style={{
              backgroundColor: ACCENT,
              color: "#0A0A0A",
              padding: "10px 22px",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            thetan.in
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
