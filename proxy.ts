import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildLlmsMarkdown } from "@/lib/llms";
import { buildPostMarkdown, getPost, postPath } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";

/**
 * Content negotiation for AI agents.
 *
 * (Renamed from `middleware.ts`  Next.js 16 deprecated the Middleware file
 * convention in favour of Proxy. Same behaviour, new name.)
 *
 * Two ways to get Markdown instead of HTML:
 *
 *   1. `Accept: text/markdown` on `/` or on any post URL. Browsers, Googlebot
 *      and social scrapers send an HTML or wildcard Accept and never this, so
 *      they always fall through to the real page and SEO is unaffected.
 *   2. A `.md` suffix on a post URL  `/blog/resume-builder.md`  for anything
 *      that can't set headers, and so the page can link to its own plain-text
 *      twin.
 *
 * These two need DIFFERENT headers, which is why there are two header builders
 * below. See the comment on each; conflating them deindexes the site.
 *
 * `Vary: Accept` is set on the Markdown responses, so a shared cache will never
 * hand a Markdown body to a browser.
 *
 * The reverse direction can't be fixed here: Next 16 rewrites `Vary` on page
 * responses after the proxy runs (to `rsc, next-router-*, Accept-Encoding`),
 * and `headers()` in next.config doesn't survive it either  both were tried.
 * The `.md` suffix is the robust answer, because a distinct URL needs no Vary
 * at all. If a caching CDN is ever put in front of this, prefer linking `.md`
 * over relying on header negotiation.
 */

const BASE_MARKDOWN_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
  Vary: "Accept",
};

/**
 * Markdown served at its own `.md` URL  a byte-for-byte duplicate of an HTML
 * page that lives at a different address.
 *
 * `noindex` keeps it out of search results so it can't compete with the page it
 * duplicates, and the canonical `Link` consolidates any signals onto the HTML.
 *
 * Deliberately NOT a robots.txt `Disallow`: the two are mutually exclusive. A
 * disallowed URL is never fetched, so the crawler never reads this header, and
 * Google can still list the bare URL with no snippet  strictly worse. AEO is
 * unaffected either way, because `noindex` governs *listing*, not *fetching*:
 * ChatGPT-User, Claude-User and Perplexity-User still read this file on demand.
 */
const mdTwinHeaders = (canonical: string) => ({
  ...BASE_MARKDOWN_HEADERS,
  "X-Robots-Tag": "noindex",
  Link: `<${canonical}>; rel="canonical"`,
});

/**
 * Markdown served at the *canonical* URL via Accept negotiation.
 *
 * Carries NO robots directive on purpose. This response shares its URL with the
 * indexable HTML page, so a `noindex` here would deindex the real page for any
 * crawler that happened to send a matching Accept header. Never add one.
 */
const negotiatedHeaders = BASE_MARKDOWN_HEADERS;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const wantsMarkdown = (req.headers.get("accept") || "").includes(
    "text/markdown",
  );

  // /blog/<slug> and /blog/<slug>.md
  if (pathname.startsWith("/blog/")) {
    const raw = pathname.slice("/blog/".length).replace(/\/$/, "");
    const isMdSuffix = raw.endsWith(".md");
    const slug = isMdSuffix ? raw.slice(0, -3) : raw;
    const post = getPost(slug);

    // Unknown slug (including /blog/llms.txt)  let the router handle it.
    if (post && (isMdSuffix || wantsMarkdown)) {
      return new NextResponse(buildPostMarkdown(post, SITE_URL), {
        status: 200,
        headers: isMdSuffix
          ? mdTwinHeaders(`${SITE_URL}${postPath(post.slug)}`)
          : negotiatedHeaders,
      });
    }
  }

  // Homepage. Always the negotiated form  there is no `/.md` twin, so this
  // response only ever shares its URL with the indexable homepage.
  if (pathname === "/" && wantsMarkdown) {
    return new NextResponse(buildLlmsMarkdown(), {
      status: 200,
      headers: negotiatedHeaders,
    });
  }

  const res = NextResponse.next();
  res.headers.set("Vary", "Accept");
  return res;
}

// Scoped to the homepage and the blog. Never intercepts assets, /_next, or the
// dedicated metadata routes (/robots.txt, /sitemap.xml, images).
export const config = {
  matcher: ["/", "/blog/:path*"],
};
