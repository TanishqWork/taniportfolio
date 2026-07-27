"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal, EASE } from "@/components/blog/motion-primitives";

export function CodeBlock({
  code,
  lang,
  caption,
  accent = "#E4FE52",
}: {
  code: string;
  lang: string;
  caption?: string;
  accent?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard is permission-gated; the code is selectable either way.
    }
  };

  return (
    <Reveal className="my-9">
      <figure className="overflow-hidden rounded-xl border border-white/12 bg-white/[0.03]">
        <figcaption className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="flex gap-1.5" aria-hidden>
              {["#FF5A52", "#E4FE52", "#3FCF8E"].map((c) => (
                <span
                  key={c}
                  className="h-2.5 w-2.5 rounded-full opacity-70"
                  style={{ backgroundColor: c }}
                />
              ))}
            </span>
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/45">
              {lang}
            </span>
          </div>

          <button
            type="button"
            onClick={copy}
            className="relative font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white/45 transition-colors hover:text-white"
            aria-label="Copy code to clipboard"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "copied" : "copy"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: EASE }}
                className="block"
                style={copied ? { color: accent } : undefined}
              >
                {copied ? "copied ✓" : "copy"}
              </motion.span>
            </AnimatePresence>
          </button>
        </figcaption>

        <div className="overflow-x-auto">
          <pre className="min-w-full px-4 py-4 font-mono text-[0.82rem] leading-relaxed text-white/85 sm:px-5 sm:text-[0.86rem]">
            <code>{code}</code>
          </pre>
        </div>
      </figure>

      {caption && (
        <p className="mt-2.5 font-mono text-[0.72rem] tracking-wide text-white/40">
          {caption}
        </p>
      )}
    </Reveal>
  );
}
