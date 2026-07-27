import { siteConfig } from "@/lib/site-config";
import { BLOG_PATH, postPath, stripInline, type Post } from "@/lib/blog";

/**
 * Single source of SEO truth. The production domain lives here only -
 * update SITE_URL if the domain ever changes.
 */
export const SITE_URL = "https://thetan.in";

/**
 * When the homepage copy last actually changed. Bump it when you edit the
 * content, not when you deploy.
 *
 * The sitemap used `new Date()`, which made every deploy claim the homepage
 * had changed — including CSS-only ones. Google discounts `lastmod` wholesale
 * once it looks untrustworthy, so an always-fresh timestamp is worth less than
 * an honest stale one.
 */
export const HOME_LAST_MODIFIED = "2026-07-27";

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

/* -------------------------------------------------------------------------- */
/*  Blog                                                                       */
/* -------------------------------------------------------------------------- */

/** The author/publisher entity, referenced by every article. */
const AUTHOR = {
  "@type": "Person",
  name: PERSON.name,
  url: SITE_URL,
  jobTitle: PERSON.jobTitle,
} as const;

/**
 * Schema.org BlogPosting + TechArticle for a post.
 *
 * Dual-typed on purpose: BlogPosting is what Google's article handling expects,
 * TechArticle is the more precise description and is what answer engines use to
 * decide the content is technical documentation rather than marketing copy.
 */
export function blogPostingJsonLd(post: Post) {
  const url = `${SITE_URL}${postPath(post.slug)}`;
  const wordCount = post.sections
    .flatMap((s) => s.blocks)
    .reduce((n, b) => {
      if (b.type === "p" || b.type === "lead" || b.type === "quote") {
        return n + stripInline(b.text).split(/\s+/).length;
      }
      return n;
    }, 0);

  return {
    "@context": "https://schema.org",
    "@type": ["BlogPosting", "TechArticle"],
    "@id": `${url}#article`,
    headline: post.title,
    alternativeHeadline: post.headline.join(" "),
    description: post.description,
    abstract: post.deck,
    image: `${url}/opengraph-image`,
    datePublished: post.published,
    dateModified: post.updated,
    author: AUTHOR,
    publisher: AUTHOR,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en",
    keywords: post.keywords.join(", "),
    articleSection: post.tags,
    wordCount,
    timeRequired: `PT${post.readingMinutes}M`,
    proficiencyLevel: "Expert",
    about: post.tags.map((t) => ({ "@type": "Thing", name: t })),
    mentions: [
      {
        "@type": "SoftwareApplication",
        name: post.project.name,
        url: post.project.url,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: post.project.tagline,
        author: AUTHOR,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Free public demo, no signup, one generation per IP.",
        },
      },
    ],
  };
}

/** Per-post FAQPage — the block answer engines quote most readily. */
export function postFaqJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}${postPath(post.slug)}#faq`,
    mainEntity: post.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Home → Blog → Post. Gives Google the breadcrumb rich result. */
export function breadcrumbJsonLd(
  trail: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: `${SITE_URL}${step.path}`,
    })),
  };
}

/** Schema.org Blog for the index page. */
export function blogJsonLd(posts: Post[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}${BLOG_PATH}#blog`,
    name: `${PERSON.name} — Engineering writing`,
    description:
      "Engineering write-ups on building production LLM systems: grounding and anti-fabrication, verify-and-repair loops, LLM evaluation and self-hosted AI infrastructure.",
    url: `${SITE_URL}${BLOG_PATH}`,
    author: AUTHOR,
    inLanguage: "en",
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: `${SITE_URL}${postPath(p.slug)}`,
      datePublished: p.published,
      dateModified: p.updated,
      author: AUTHOR,
    })),
  };
}
