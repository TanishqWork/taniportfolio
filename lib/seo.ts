import { siteConfig } from "@/lib/site-config";

/**
 * Single source of SEO truth. The production domain lives here only -
 * update SITE_URL if the domain ever changes.
 */
export const SITE_URL = "https://thetan.in";

const { about, contact, experience, education } = siteConfig;

/** Flat list of every skill/tool, reused for keywords + JSON-LD `knowsAbout`. */
const allSkills: string[] = about.skills.flatMap((category) => category.items);

/** Current employers, derived from experience data → JSON-LD `worksFor`. */
const employers = experience.jobs
  .filter((job) => job.current)
  .map((job) => ({ "@type": "Organization", name: job.company }));

/** Alma mater, derived from education data → JSON-LD `alumniOf`. */
const almaMater = {
  "@type": "CollegeOrUniversity",
  name: education.card.university,
};

export const PERSON = {
  name: "Tanishq Bhosale",
  jobTitle: "Full Stack & AI Engineer",
  description:
    "Full Stack & AI Engineer in Bangalore building production LLM and agentic AI systems with LangGraph, FastAPI, and React Native.",
  email: contact.primary.email,
  locality: "Bangalore",
  region: "Karnataka",
  country: "India",
  image: `${SITE_URL}/Tanishq.webp`,
  sameAs: siteConfig.socials.map((s) => s.href),
  knowsAbout: allSkills,
} as const;

/** Keyword targets for the home page (Google + AI engines). */
export const KEYWORDS: string[] = [
  "Tanishq Bhosale",
  "Full Stack Engineer",
  "AI Engineer",
  "AI Engineer Bangalore",
  "LLM Engineer",
  "LangGraph developer",
  "FastAPI developer",
  "agentic AI",
  "RAG",
  "React Native developer",
  "Full Stack Developer Bangalore",
  "GenAI Engineer India",
];

/** Schema.org Person - powers Google knowledge panels and AI-engine citations. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PERSON.name,
    url: SITE_URL,
    image: PERSON.image,
    jobTitle: PERSON.jobTitle,
    email: `mailto:${PERSON.email}`,
    description: PERSON.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: PERSON.locality,
      addressRegion: PERSON.region,
      addressCountry: PERSON.country,
    },
    worksFor: employers,
    alumniOf: almaMater,
    hasOccupation: {
      "@type": "Occupation",
      name: PERSON.jobTitle,
      occupationLocation: {
        "@type": "City",
        name: PERSON.locality,
      },
    },
    sameAs: PERSON.sameAs,
    knowsAbout: PERSON.knowsAbout,
  };
}

/**
 * ProfilePage wrapper around the Person — the schema.org type AI engines and
 * Google expect for an "about this person" page. Use this as the primary
 * structured-data block; it embeds the full Person entity.
 */
export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateModified: new Date().toISOString(),
    mainEntity: personJsonLd(),
  };
}

/**
 * Schema.org FAQPage — eligible for Google rich results and highly quotable
 * by AI engines (Q&A is the format answer engines extract most readily).
 * Generated from siteConfig.faq so the schema always matches the visible copy.
 */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: siteConfig.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Schema.org WebSite - identifies the site entity to crawlers. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${PERSON.name} - Portfolio`,
    url: SITE_URL,
    author: { "@type": "Person", name: PERSON.name },
    inLanguage: "en",
  };
}
