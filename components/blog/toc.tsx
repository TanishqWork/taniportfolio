"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { EASE } from "@/components/blog/motion-primitives";
import type { Section } from "@/lib/blog";

/**
 * Scroll-spy contents. Sticky rail on large screens, a floating sheet on
 * small ones. Navigation goes through the shared Lenis instance so the smooth
 * scroll matches the rest of the site instead of fighting it.
 */
export function Toc({
  sections,
  accent,
}: {
  sections: Section[];
  accent: string;
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    // A band across the middle of the viewport: whichever section is crossing
    // it is "the one you're reading".
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const go = useCallback(
    (id: string) => {
      setOpen(false);
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -80 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Keep the URL shareable at the section level.
      history.replaceState(null, "", `#${id}`);
    },
    [lenis],
  );

  const list = (
    <ol className="space-y-1">
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => go(s.id)}
              aria-current={isActive ? "true" : undefined}
              className="group relative flex w-full items-start gap-3 rounded-md px-2 py-1.5 text-left transition-colors"
            >
              {isActive && (
                <motion.span
                  layoutId="toc-active"
                  transition={{ duration: 0.35, ease: EASE }}
                  className="absolute inset-0 rounded-md"
                  style={{ backgroundColor: `${accent}14` }}
                />
              )}
              <span
                className="relative mt-[3px] font-mono text-[0.62rem] tabular-nums transition-opacity"
                style={{
                  color: isActive ? accent : undefined,
                  opacity: isActive ? 1 : 0.4,
                }}
              >
                {s.num}
              </span>
              <span
                className="relative text-[0.82rem] leading-snug transition-opacity"
                style={{
                  color: isActive ? accent : undefined,
                  opacity: isActive ? 1 : 0.55,
                }}
              >
                {s.title}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      {/* Desktop rail */}
      <nav
        aria-label="Table of contents"
        className="sticky top-28 hidden max-h-[calc(100vh-9rem)] overflow-y-auto pr-2 lg:block"
      >
        <p className="mb-4 px-2 font-departure text-[0.65rem] uppercase tracking-[0.28em] opacity-45">
          Contents
        </p>
        {list}
      </nav>

      {/* Mobile sheet */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Table of contents"
          className="fixed bottom-5 right-5 z-50 flex h-12 items-center gap-2 rounded-full px-5 font-departure text-[0.68rem] uppercase tracking-[0.18em] shadow-lg"
          style={{ backgroundColor: accent, color: "#0A0A0A" }}
        >
          <motion.span animate={{ rotate: open ? 45 : 0 }} aria-hidden>
            {open ? "✕" : "☰"}
          </motion.span>
          {sections.find((s) => s.id === active)?.num ?? "01"}
        </button>

        <AnimatePresence>
          {open && (
            <>
              <motion.button
                type="button"
                aria-label="Close contents"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40 cursor-default bg-black/70 backdrop-blur-sm"
              />
              <motion.nav
                aria-label="Table of contents"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.4, ease: EASE }}
                className="fixed inset-x-0 bottom-0 z-40 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-white/10 bg-[#101010] px-4 pb-24 pt-6"
              >
                <p className="mb-4 px-2 font-departure text-[0.65rem] uppercase tracking-[0.28em] opacity-45">
                  Contents
                </p>
                {list}
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
