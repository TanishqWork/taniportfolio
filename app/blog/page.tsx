import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/blog-index";
import { sortedPosts } from "@/lib/blog";
import { SITE_URL, blogJsonLd, breadcrumbJsonLd } from "@/lib/seo";

// Kept short on purpose: the root layout appends " | Tanishq Bhosale" (18
// chars), and Google truncates the rendered title around 60. Description aims
// at 120-160 for the same reason.
const TITLE = "Writing  software, attention, and AI";
const DESCRIPTION =
  "Writing on practical software: AI engineering, product decisions, and Tempt, an Android app that helps create a boundary around short-video scrolling.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  keywords: [
    "LLM engineering blog",
    "AI guardrails",
    "LLM grounding",
    "anti-fabrication",
    "FastAPI OpenAI",
    "self-hosted AI",
    "Android digital wellbeing",
    "Tempt app",
    "Tanishq Bhosale blog",
  ],
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Tanishq Bhosale",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function BlogPage() {
  const posts = sortedPosts();

  const jsonLd = [
    blogJsonLd(posts),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Writing", path: "/blog" },
    ]),
  ];

  return (
    <>
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
      <BlogIndex posts={posts} />
    </>
  );
}
