import { buildBlogLlmsMarkdown } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";

/**
 * /blog/llms.txt  a section-scoped discovery file.
 *
 * The site-level /llms.txt describes the person; this one describes the
 * writing, and points at the per-post `.md` twins so an engine can pull the
 * full text of an article without parsing the animated page.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(buildBlogLlmsMarkdown(SITE_URL), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      // Indexable on purpose  see the note in app/llms.txt/route.ts.
      "X-Robots-Tag": "all",
    },
  });
}
