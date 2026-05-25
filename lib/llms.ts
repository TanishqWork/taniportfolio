import { siteConfig } from "@/lib/site-config";
import { PERSON, SITE_URL } from "@/lib/seo";

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
        `### ${j.role} — ${j.company} (${j.dates})\n${j.bullets
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

## FAQ

${faqBlock}

## Links

${siteConfig.socials.map((s) => `- ${s.label}: ${s.href}`).join("\n")}
- Email: ${contact.primary.email}
`;
}
