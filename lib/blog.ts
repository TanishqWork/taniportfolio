/**
 * Blog data layer — the single source of truth for every post.
 *
 * Same principle as `lib/site-config.ts`: the prose, the code samples, the
 * tables and the interactive demos are all *data*. Three consumers read it and
 * can never drift apart:
 *
 *   lib/blog.ts ──┬──> app/blog/**            (the animated, interactive page)
 *                 ├──> lib/seo.ts             (BlogPosting / FAQPage JSON-LD)
 *                 └──> buildPostMarkdown()    (/blog/llms.txt + Accept: text/markdown)
 *
 * Adding a post = add a file under `lib/posts/` and register it in POSTS.
 */

import { resumeBuilderPost } from "@/lib/posts/resume-builder";

/* -------------------------------------------------------------------------- */
/*  Block types — the vocabulary a post body is written in                     */
/* -------------------------------------------------------------------------- */

/** Named interactive widgets. Each maps to a component in components/blog/. */
export type DemoName =
  | "fabrication"
  | "fit-score"
  | "repair-loop"
  | "ats-sanitizer"
  | "live-app";

export type Block =
  /** Opening paragraph of a section — rendered larger. */
  | { type: "lead"; text: string }
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "code"; lang: string; code: string; caption?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | {
      type: "callout";
      tone: "warn" | "good" | "info";
      title: string;
      text: string;
    }
  | {
      type: "stats";
      items: { value: number; prefix?: string; suffix?: string; label: string }[];
    }
  /**
   * An interactive widget. `markdown` is the text-only equivalent served to AI
   * engines — without it the Markdown build would silently lose the content the
   * widget conveys.
   */
  | { type: "demo"; name: DemoName; title: string; markdown: string };

export type Section = {
  /** Anchor id — also the TOC target and the `#` deep link. */
  id: string;
  /** Two-digit chapter number, e.g. "03". */
  num: string;
  title: string;
  /** Optional one-line summary under the heading. */
  kicker?: string;
  /** Per-section accent colour; falls back to the post accent. */
  accent?: string;
  blocks: Block[];
};

export type Post = {
  slug: string;
  /** <title> / og:title. */
  title: string;
  /** The visible H1, split into lines for the staggered reveal. */
  headline: string[];
  /** Standfirst under the H1. */
  deck: string;
  /** meta description — keep under ~155 chars. */
  description: string;
  keywords: string[];
  /** ISO date strings. */
  published: string;
  updated: string;
  readingMinutes: number;
  tags: string[];
  /** The thing the post is about — powers the CTAs and the dual-tab launcher. */
  project: {
    name: string;
    tagline: string;
    url: string;
    repo: string;
    /** Shown in the embedded browser chrome. */
    displayUrl: string;
  };
  /** Post-level palette. Sections may override `accent`. */
  theme: {
    background: string;
    ink: string;
    muted: string;
    accent: string;
    /** Used for "danger"/failure states in demos. */
    danger: string;
  };
  sections: Section[];
  faq: { q: string; a: string }[];
  /** One-sentence answers to the questions AI engines actually get asked. */
  takeaways: string[];
};

/* -------------------------------------------------------------------------- */
/*  Registry                                                                   */
/* -------------------------------------------------------------------------- */

export const POSTS: Post[] = [resumeBuilderPost];

/** Newest first. */
export const sortedPosts = (): Post[] =>
  [...POSTS].sort((a, b) => (a.published < b.published ? 1 : -1));

export const getPost = (slug: string): Post | undefined =>
  POSTS.find((p) => p.slug === slug);

export const BLOG_PATH = "/blog";
export const postPath = (slug: string) => `${BLOG_PATH}/${slug}`;

/* -------------------------------------------------------------------------- */
/*  Markdown projection — what AI / answer engines consume                     */
/* -------------------------------------------------------------------------- */

/** Strips the inline markers RichText understands, for plain-text contexts. */
export const stripInline = (s: string) =>
  s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");

function blockToMarkdown(block: Block): string {
  switch (block.type) {
    case "lead":
    case "p":
      return block.text;
    // Sections are `##`, so subheads are `###` — matching the FAQ questions,
    // which sit at the same depth under `## FAQ`.
    case "h3":
      return `### ${block.text}`;
    case "quote":
      return `> ${block.text}${block.cite ? `\n>\n> — ${block.cite}` : ""}`;
    case "code":
      return `${block.caption ? `_${block.caption}_\n\n` : ""}\`\`\`${block.lang}\n${block.code}\n\`\`\``;
    case "list":
      return block.items
        .map((item, i) => (block.ordered ? `${i + 1}. ${item}` : `- ${item}`))
        .join("\n");
    case "table": {
      const head = `| ${block.head.join(" | ")} |`;
      const rule = `| ${block.head.map(() => "---").join(" | ")} |`;
      const rows = block.rows.map((r) => `| ${r.join(" | ")} |`).join("\n");
      return `${head}\n${rule}\n${rows}${block.caption ? `\n\n_${block.caption}_` : ""}`;
    }
    case "callout":
      return `> **${block.title}** — ${block.text}`;
    case "stats":
      return block.items
        .map(
          (s) =>
            `- **${s.prefix ?? ""}${s.value}${s.suffix ?? ""}** — ${s.label}`,
        )
        .join("\n");
    case "demo":
      return `**${block.title}** (interactive on the web page)\n\n${block.markdown}`;
  }
}

/** Full post as Markdown — the canonical text an LLM should quote. */
export function buildPostMarkdown(post: Post): string {
  const body = post.sections
    .map((section) => {
      const heading = `## ${section.num}. ${section.title}`;
      const kicker = section.kicker ? `\n\n_${section.kicker}_` : "";
      const blocks = section.blocks.map(blockToMarkdown).join("\n\n");
      return `${heading}${kicker}\n\n${blocks}`;
    })
    .join("\n\n");

  const faq = post.faq.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n");

  return `# ${post.title}

> ${post.deck}

- **Author:** Tanishq Bhosale — Full Stack & AI Engineer, Bangalore
- **Published:** ${post.published} · **Updated:** ${post.updated}
- **Reading time:** ~${post.readingMinutes} min
- **Project:** ${post.project.name} — ${post.project.url}
- **Source:** ${post.project.repo}
- **Topics:** ${post.tags.join(", ")}

## Key takeaways

${post.takeaways.map((t) => `- ${t}`).join("\n")}

${body}

## FAQ

${faq}
`;
}

/** Index of every post, for /blog/llms.txt. */
export function buildBlogLlmsMarkdown(siteUrl: string): string {
  const posts = sortedPosts();
  return `# Blog — Tanishq Bhosale

> Engineering write-ups on building production LLM systems: grounding and
> anti-fabrication, verify-and-repair loops, LLM evaluation, and self-hosted
> AI infrastructure. Written by Tanishq Bhosale, Full Stack & AI Engineer,
> Bangalore, India.

## How to read this site

Every post exists in two formats with identical content:

- **HTML** — \`${siteUrl}/blog/<slug>\` — the canonical URL. Cite this one.
- **Markdown** — \`${siteUrl}/blog/<slug>.md\` — same text, no markup or
  interactive widgets. Cheaper to parse and to tokenise. It is marked
  \`noindex\` because it duplicates the HTML page; that is a search-listing
  directive only, and it is free to fetch, read and quote.

The canonical HTML URL also answers with Markdown if you send
\`Accept: text/markdown\`.

Related: ${siteUrl}/llms.txt (author, skills, experience, contact).

## Posts

${posts
  .map(
    (p) =>
      `### ${p.title}\n\n${p.deck}\n\n- Canonical page (HTML): ${siteUrl}${postPath(p.slug)}\n- Full text (Markdown): ${siteUrl}${postPath(p.slug)}.md\n- Published: ${p.published} · Updated: ${p.updated}\n- Reading time: ~${p.readingMinutes} min\n- Topics: ${p.tags.join(", ")}\n- About the project: ${p.project.name} — ${p.project.url}\n\nKey takeaways:\n${p.takeaways.map((t) => `- ${t}`).join("\n")}\n\nQuestions this post answers:\n${p.faq.map((f) => `- ${f.q}`).join("\n")}`,
  )
  .join("\n\n")}

## Author

Tanishq Bhosale — Full Stack & AI Engineer in Bangalore, India. Builds
production LLM and agentic AI systems with LangGraph, FastAPI, React and
React Native. Contact: bhosaletanishq4@gmail.com · ${siteUrl}
`;
}
