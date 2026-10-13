import { buildLlmsMarkdown } from "@/lib/llms";

/**
 * /llms.txt  the discovery-file convention for AI / answer engines
 * (ChatGPT, Claude, Perplexity, Gemini). Content comes from buildLlmsMarkdown()
 * so it stays in sync with the Accept: text/markdown response in middleware.ts.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsMarkdown(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      // Deliberately indexable. This is a discovery index, not a duplicate of
      // any single page, so the `noindex` that guards the `.md` twins must NOT
      // be applied here  suppressing it would hide the main AEO surface.
      // Stated explicitly so a future blanket rule can't quietly bury it.
      "X-Robots-Tag": "all",
    },
  });
}
