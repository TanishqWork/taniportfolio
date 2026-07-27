import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostArticle } from "@/components/blog/post-article";
import { POSTS, getPost, postPath } from "@/lib/blog";
import {
  SITE_URL,
  blogPostingJsonLd,
  breadcrumbJsonLd,
  postFaqJsonLd,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

/** Every post is known at build time, so every post is statically rendered. */
export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `${SITE_URL}${postPath(post.slug)}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: postPath(post.slug),
      types: {
        // The Markdown twin, advertised to anything that prefers plain text.
        "text/markdown": `${postPath(post.slug)}.md`,
      },
    },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.published,
      modifiedTime: post.updated,
      authors: ["Tanishq Bhosale"],
      tags: post.tags,
      siteName: "Tanishq Bhosale",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = [
    blogPostingJsonLd(post),
    postFaqJsonLd(post),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Writing", path: "/blog" },
      { name: post.title, path: postPath(post.slug) },
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
      <PostArticle post={post} />
    </>
  );
}
