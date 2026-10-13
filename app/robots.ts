import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Everything here is `Allow: /`. The named groups are declarative rather than
 * functional  `User-Agent: *` already permits every crawler  but naming an
 * agent matters for the ones that are opt-out-by-name (`Google-Extended`,
 * `Applebot-Extended`): an explicit Allow records intent that a future audit,
 * or a future blanket block, has to argue with.
 *
 * Note that a named group *replaces* the wildcard group for that agent rather
 * than adding to it, so each one has to restate `Allow: /`.
 *
 * No `Disallow` for the `.md` twins on purpose: they carry `X-Robots-Tag:
 * noindex` instead. Blocking them here would stop crawlers fetching them at
 * all, which both defeats the point of publishing them and prevents anyone
 * from ever reading the noindex. See proxy.ts.
 */
export default function robots(): MetadataRoute.Robots {
  const allowAll = (userAgent: string) => ({ userAgent, allow: "/" });

  return {
    rules: [
      // Search engines + everything unnamed.
      allowAll("*"),

      // OpenAI  training, search index, and on-demand user fetches.
      allowAll("GPTBot"),
      allowAll("OAI-SearchBot"),
      allowAll("ChatGPT-User"),

      // Anthropic  training, search index, and on-demand user fetches.
      allowAll("ClaudeBot"),
      allowAll("Claude-SearchBot"),
      allowAll("Claude-User"),
      allowAll("anthropic-ai"),

      // Perplexity  index and on-demand.
      allowAll("PerplexityBot"),
      allowAll("Perplexity-User"),

      // Opt-out-by-name agents: stating Allow is the only way to signal intent.
      allowAll("Google-Extended"),
      allowAll("Applebot-Extended"),

      // Other answer engines and model corpora.
      allowAll("meta-externalagent"),
      allowAll("Amazonbot"),
      allowAll("DuckAssistBot"),
      allowAll("cohere-ai"),
      allowAll("YouBot"),
      allowAll("CCBot"),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    // No `host`: Yandex discontinued that directive in 2018 in favour of 301s
    // and rel="canonical", and no other crawler ever read it. The canonical
    // tags on every page already do this job.
  };
}
