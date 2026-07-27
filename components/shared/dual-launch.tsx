"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Magnetic } from "@/components/blog/motion-primitives";

/**
 * One click, two tabs: the write-up and the live project.
 *
 * The reliability trick matters here. Browsers allow a link's own
 * `target="_blank"` navigation unconditionally, but a *programmatic*
 * `window.open()` only inside a trusted gesture — and some browsers still
 * block the second one. So:
 *
 *   - the anchor carries the blog post (guaranteed to open), and
 *   - the live app is opened programmatically.
 *
 * That ordering also gives the best degraded experience: if the popup is
 * blocked, the reader still lands on the post, which links to the app anyway.
 * We detect the block (`window.open` returns null) and surface a direct link
 * instead of failing silently.
 */
export function DualLaunch({
  blogHref,
  projectHref,
  projectLabel,
  children,
  className,
  accent = "#E4FE52",
  ink = "#0A0A0A",
}: {
  blogHref: string;
  projectHref: string;
  projectLabel: string;
  children: ReactNode;
  className?: string;
  accent?: string;
  ink?: string;
}) {
  const [blocked, setBlocked] = useState(false);

  return (
    <div className="flex flex-col items-start gap-3">
      <Magnetic strength={0.18}>
        <motion.a
          href={blogHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            const win = window.open(projectHref, "_blank", "noopener,noreferrer");
            setBlocked(win === null);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.65, 0.01, 0.05, 0.99] }}
          className={
            className ??
            "group relative inline-flex items-center gap-3 rounded-full px-7 py-4 font-departure text-sm uppercase tracking-[0.18em]"
          }
          style={{ backgroundColor: accent, color: ink }}
        >
          {children}
          <span
            aria-hidden
            className="inline-flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </span>
        </motion.a>
      </Magnetic>

      <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] opacity-55">
        Opens two tabs — the write-up and {projectLabel}
      </p>

      {blocked && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[0.72rem]"
          style={{ color: accent }}
          role="status"
        >
          Your browser blocked the second tab —{" "}
          <a
            href={projectHref}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            open {projectLabel} directly
          </a>
        </motion.p>
      )}
    </div>
  );
}
