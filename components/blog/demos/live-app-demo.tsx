"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/components/blog/motion-primitives";

type Viewport = "desktop" | "mobile";

/**
 * Live embed of the real app inside a fake browser chrome.
 *
 * The iframe is not mounted until the reader asks for it. An embedded app is a
 * whole second page load — mounting it eagerly would wreck this page's LCP and
 * hand a third-party frame every reader who never scrolls this far.
 *
 * On overlays: a cross-origin frame tells us almost nothing, and `onLoad` is
 * not reliable (a cached frame can finish before the handler is attached). An
 * earlier version treated "no load event within 12s" as failure and covered the
 * frame with an opaque error — which hid a perfectly working app whenever the
 * signal was missed. So the rule here is: **never let a missing signal hide
 * content.** The loading veil lifts after a short grace period whether or not
 * `onLoad` fired, and the escape hatch is a permanent, non-blocking bar under
 * the frame rather than a modal error state.
 */
const LOADING_GRACE_MS = 6000;
export function LiveAppDemo({
  url,
  displayUrl,
  repo,
  accent,
}: {
  url: string;
  displayUrl: string;
  repo: string;
  accent: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [graceElapsed, setGraceElapsed] = useState(false);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [nonce, setNonce] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lift the veil after the grace period regardless of whether `onLoad` fired.
  // Worst case the reader sees a blank frame with a visible way out; that beats
  // covering a working app with a spinner forever.
  useEffect(() => {
    if (!mounted) return;
    timer.current = setTimeout(() => setGraceElapsed(true), LOADING_GRACE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [mounted, nonce]);

  const reload = () => {
    setLoaded(false);
    setGraceElapsed(false);
    setNonce((n) => n + 1);
  };

  const veiled = mounted && !loaded && !graceElapsed;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.03]">
      {/* browser chrome */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-white/[0.03] px-3 py-2.5 sm:px-4">
        <span className="flex gap-1.5" aria-hidden>
          {["#FF5A52", "#E4FE52", "#3FCF8E"].map((c) => (
            <span
              key={c}
              className="h-2.5 w-2.5 rounded-full opacity-70"
              style={{ backgroundColor: c }}
            />
          ))}
        </span>

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
            aria-hidden
            className="shrink-0"
          >
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <span className="truncate font-mono text-[0.72rem] text-white/60">
            {displayUrl}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div
            className="hidden rounded-full border border-white/10 p-0.5 sm:flex"
            role="group"
            aria-label="Preview width"
          >
            {(["desktop", "mobile"] as Viewport[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setViewport(v)}
                aria-pressed={viewport === v}
                className="relative rounded-full px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] transition-colors"
                style={{ color: viewport === v ? "#0A0A0A" : "rgba(255,255,255,0.5)" }}
              >
                {viewport === v && (
                  <motion.span
                    layoutId="viewport-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: accent }}
                    transition={{ duration: 0.28, ease: EASE }}
                  />
                )}
                <span className="relative">{v === "desktop" ? "wide" : "phone"}</span>
              </button>
            ))}
          </div>

          {mounted && (
            <button
              type="button"
              onClick={reload}
              aria-label="Reload preview"
              className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/50 transition-colors hover:border-white/35 hover:text-white"
            >
              ↻
            </button>
          )}

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-3 py-1.5 font-departure text-[0.62rem] uppercase tracking-[0.14em]"
            style={{ backgroundColor: accent, color: "#0A0A0A" }}
          >
            Open ↗
          </a>
        </div>
      </div>

      {/* stage */}
      <div className="relative bg-black/40">
        <div
          className="mx-auto transition-[max-width] duration-500"
          style={{ maxWidth: viewport === "mobile" ? 420 : "100%" }}
        >
          <div className="relative h-[min(78vh,680px)] w-full">
            {!mounted && (
              <button
                type="button"
                onClick={() => setMounted(true)}
                className="group absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
              >
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: accent, color: "#0A0A0A" }}
                  aria-hidden
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="font-departure text-lg uppercase tracking-tight text-white">
                  Load the live app
                </span>
                <span className="max-w-sm font-mono text-[0.74rem] leading-relaxed text-white/45">
                  Runs the real pipeline — free, no signup, one generation per IP.
                  Loaded on demand so it doesn&apos;t slow this page down.
                </span>
              </button>
            )}

            {mounted && (
              <>
                <iframe
                  key={nonce}
                  src={url}
                  title="ResumeOS — live application preview"
                  onLoad={() => {
                    setLoaded(true);
                    if (timer.current) clearTimeout(timer.current);
                  }}
                  referrerPolicy="strict-origin-when-cross-origin"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
                  className="h-full w-full border-0 bg-white"
                />

                <AnimatePresence>
                  {veiled && (
                    <motion.div
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0A0A0A]"
                    >
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                        className="font-mono text-[0.75rem] uppercase tracking-[0.2em]"
                        style={{ color: accent }}
                      >
                        booting resumeos…
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer doubles as the permanent escape hatch: if a browser extension
          or a slow network leaves the frame blank, the way out is always
          visible rather than hidden behind a failure state we can't detect. */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
        <p className="font-mono text-[0.7rem] text-white/40">
          Live instance — not a recording.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {mounted && (
            <button
              type="button"
              onClick={reload}
              className="font-mono text-[0.7rem] text-white/40 underline underline-offset-4 transition-colors hover:text-white"
            >
              Frame blank? Reload it
            </button>
          )}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.7rem] underline underline-offset-4 transition-colors hover:text-white"
            style={{ color: accent }}
          >
            Open {displayUrl} ↗
          </a>
          <a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.7rem] text-white/50 underline underline-offset-4 transition-colors hover:text-white"
          >
            Source ↗
          </a>
        </div>
      </div>
    </div>
  );
}
