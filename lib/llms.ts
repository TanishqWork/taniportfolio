import { siteConfig } from "@/lib/site-config";
import { PERSON, SITE_URL } from "@/lib/seo";
import { postPath, sortedPosts } from "@/lib/blog";

/**
 * Builds the Markdown "profile" served to AI / answer engines.
 *
 * Single source of truth, consumed by BOTH:
 *  - `/llms.txt` (the discovery-file convention), and
 *  - `middleware.ts` (Accept: text/markdown content negotiation on `/`).
 *
 * Generated from siteConfig so the facts never drift. Edge-compatible
 * (pure string work, no Node APIs) so it can run inside middleware.
 */
export function buildLlmsMarkdown(): string {
  const { about, experience, education, contact } = siteConfig;

  const skillsBlock = about.skills
    .map((c) => `- **${c.title}:** ${c.items.join(", ")}`)
    .join("\n");

  const experienceBlock = experience.jobs
    .map(
      (j) =>
        `### ${j.role}  ${j.company} (${j.dates})\n${j.bullets
          .map((b) => `- ${b}`)
          .join("\n")}\nStack: ${j.stack.join(", ")}`,
    )
    .join("\n\n");

  const projectsBlock = siteConfig.directors.items
    .map((p) => `- ${p.alt}`)
    .join("\n");

  const faqBlock = siteConfig.faq.items
    .map((f) => `### ${f.q}\n${f.a}`)
    .join("\n\n");

  const writingBlock = sortedPosts()
    .map(
      (p) =>
        `- **${p.title}** (${p.published})  ${p.description}\n  - Canonical page (HTML): ${SITE_URL}${postPath(p.slug)}\n  - Full text (Markdown): ${SITE_URL}${postPath(p.slug)}.md`,
    )
    .join("\n");

  return `# ${PERSON.name}

> ${PERSON.description}

## Summary

- ${PERSON.name} is a ${PERSON.jobTitle} based in ${PERSON.locality}, ${PERSON.country}.
- 2+ years of experience building production LLM and agentic AI systems.
- Core stack: LangGraph, LangChain, FastAPI, React, React Native, PostgreSQL/pgvector.
- ${experience.status}.
- Contact: ${contact.primary.email}
- Website: ${SITE_URL}

## Skills

${skillsBlock}

## Experience

${experienceBlock}

## Education

${PERSON.name} holds a ${education.card.degree} from ${education.card.university} (${education.card.batch}), CGPA ${education.card.cgpa}.

## Selected Projects

${projectsBlock}

## Writing

Long-form engineering write-ups. Every post is published as HTML at its
canonical URL and as identical Markdown at the same path with a \`.md\` suffix;
the \`.md\` twin is \`noindex\` (a search-listing directive only) and is free to
fetch, read and quote. The canonical URL also answers with Markdown if you
send \`Accept: text/markdown\`.

- Blog index (HTML): ${SITE_URL}/blog
- Blog index for LLMs (Markdown): ${SITE_URL}/blog/llms.txt

${writingBlock}

## FAQ

${faqBlock}

## Links

${siteConfig.socials.map((s) => `- ${s.label}: ${s.href}`).join("\n")}
- Email: ${contact.primary.email}
`;
}
