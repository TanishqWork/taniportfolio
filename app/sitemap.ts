import type { MetadataRoute } from "next";
import { HOME_LAST_MODIFIED, SITE_URL } from "@/lib/seo";
import { sortedPosts, postPath } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = sortedPosts();
  const newestPost = posts[0]?.updated;

  // The homepage lists posts, so a new post genuinely does change it. Take
  // whichever real content date is newer — never the build clock.
  const homeLastModified = [HOME_LAST_MODIFIED, newestPost]
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1)!;

  return [
    {
      url: SITE_URL,
      lastModified: new Date(homeLastModified),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      // The index is only as fresh as its newest post.
      lastModified: new Date(newestPost ?? HOME_LAST_MODIFIED),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}${postPath(post.slug)}`,
      lastModified: new Date(post.updated),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),

    // Discovery files. There is no standard way to advertise llms.txt — no
    // robots.txt directive, no registered link rel — so listing them here is
    // the one mechanism that reaches crawlers which read sitemaps but don't
    // probe for conventional paths. Low priority: they're wayfinding, not
    // content to rank.
    //
    // The `.md` twins are deliberately absent: they're noindex duplicates, and
    // a sitemap entry for a noindex URL is a contradictory signal.
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified: new Date(homeLastModified),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/blog/llms.txt`,
      lastModified: new Date(newestPost ?? HOME_LAST_MODIFIED),
      changeFrequency: "weekly" as const,
      priority: 0.3,
    },
  ];
}
