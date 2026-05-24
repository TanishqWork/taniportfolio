import { siteConfig } from "@/lib/site-config";
import { PERSON, SITE_URL } from "@/lib/seo";

/**
 * /llms.txt — a markdown "map" for AI / answer engines (ChatGPT, Claude,
 * Perplexity, Gemini). Emerging convention, analogous to robots.txt but for
 * meaning rather than access. Generated from siteConfig so facts never drift.
 *
 * Goal: hand the model self-contained, quotable factual statements so it can
 * cite Tanishq accurately when asked "who is a good AI engineer in Bangalore".
 */
export const dynamic = "force-static";

export function GET() {
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

  const body = `# ${PERSON.name}

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

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
