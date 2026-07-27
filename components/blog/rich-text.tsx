import type { ReactNode } from "react";

/**
 * A deliberately tiny inline formatter for post copy.
 *
 * Supports `**bold**`, `*italic*`, `` `code` `` and `[label](href)` and nothing
 * else. It builds React nodes rather than HTML strings, so there is no
 * dangerouslySetInnerHTML anywhere in the blog and no injection surface.
 */

const TOKEN =
  /(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(`[^`]+`)|(\*[^*\n]+\*)/g;

type Props = {
  text: string;
  /** Colour used for inline code + links. */
  accent?: string;
};

export function RichText({ text, accent = "#E4FE52" }: Props) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    const token = match[0];

    if (token.startsWith("[")) {
      const split = token.indexOf("](");
      const label = token.slice(1, split);
      const href = token.slice(split + 2, -1);
      const external = /^https?:\/\//.test(href);
      nodes.push(
        <a
          key={key++}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
          style={{ color: accent, textDecorationColor: accent }}
        >
          {label}
        </a>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key++} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key++}
          className="rounded border border-white/15 bg-white/[0.06] px-[0.35em] py-[0.1em] font-mono text-[0.85em]"
          style={{ color: accent }}
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(
        <em key={key++} className="italic opacity-90">
          {token.slice(1, -1)}
        </em>,
      );
    }

    last = index + token.length;
  }

  if (last < text.length) nodes.push(text.slice(last));

  return <>{nodes}</>;
}
