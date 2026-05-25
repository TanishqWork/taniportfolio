import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildLlmsMarkdown } from "@/lib/llms";

/**
 * Content negotiation for AI agents.
 *
 * When a client explicitly asks for Markdown (`Accept: text/markdown`), serve a
 * lean Markdown profile instead of the full HTML page — saving tokens and
 * giving AI engines clean, quotable content. Everyone else (browsers, Googlebot,
 * social scrapers — which send an HTML or wildcard Accept, never text/markdown)
 * gets the normal HTML untouched, so SEO is unaffected.
 *
 * `Vary: Accept` is set on both branches so caches/CDNs never serve the wrong
 * format to the wrong client.
 */
export function middleware(req: NextRequest) {
  const accept = req.headers.get("accept") || "";

  // Only trigger on an explicit Markdown request. Browsers and search crawlers
  // never send this, so they always fall through to HTML.
  if (accept.includes("text/markdown")) {
    return new NextResponse(buildLlmsMarkdown(), {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        Vary: "Accept",
      },
    });
  }

  const res = NextResponse.next();
  res.headers.set("Vary", "Accept");
  return res;
}

// Scope strictly to the homepage. Never intercept assets, /_next, or the
// dedicated metadata routes (/llms.txt, /robots.txt, /sitemap.xml, images).
export const config = {
  matcher: "/",
};
