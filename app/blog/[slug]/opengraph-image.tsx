import { ImageResponse } from "next/og";
import { POSTS, getPost } from "@/lib/blog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Engineering write-up by Tanishq Bhosale";

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export default async function PostOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  const accent = post?.theme.accent ?? "#E4FE52";
  const headline = post?.headline.join(" ") ?? "Writing";

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
          <span style={{ color: accent }}>
            ● {post?.readingMinutes ?? 10} min read
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: headline.length > 46 ? 76 : 92,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
              color: "#FFFFFF",
              textTransform: "uppercase",
              maxWidth: 1000,
            }}
          >
            {headline}
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
            {post?.description ?? ""}
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
              backgroundColor: accent,
              color: "#0A0A0A",
              padding: "10px 22px",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            {post?.project.displayUrl ?? "thetan.in"}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
