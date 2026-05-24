"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/site-config";

const ease = [0.65, 0.01, 0.05, 0.99] as const;

export function Faq() {
  const { background, ink, body, accent, eyebrow, headline, items } =
    siteConfig.faq;
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden px-6 py-[16vh] md:px-12"
      style={{ backgroundColor: background, color: ink }}
    >
      {/* eyebrow */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
        transition={{ duration: 0.7, ease }}
        className="mx-auto flex max-w-[1100px] items-center gap-4"
      >
        <span className="font-departure text-xs uppercase tracking-[0.3em] opacity-70">
          {eyebrow} — 06
        </span>
        <span
          className="h-px flex-1"
          style={{ backgroundColor: ink, opacity: 0.35 }}
        />
      </motion.div>

      {/* headline */}
      <h2
        className="mx-auto mt-10 max-w-[1100px] font-departure font-black uppercase leading-[0.92] tracking-tight"
        style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
      >
        {headline.map((line, i) => (
          <motion.span
            key={line}
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 60, filter: "blur(8px)" }
            }
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
            transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.15 }}
            className="block"
            style={i === headline.length - 1 ? { color: accent } : undefined}
          >
            {line}
          </motion.span>
        ))}
      </h2>

      {/* accordion */}
      <div className="mx-auto mt-14 max-w-[1100px]">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={item.q}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
              transition={{ duration: 0.6, ease, delay: i * 0.05 }}
              style={{ borderTop: `2px solid ${ink}` }}
              className={i === items.length - 1 ? "border-b-2" : undefined}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span
                  className="font-departure font-bold uppercase leading-tight tracking-tight"
                  style={{ fontSize: "clamp(1.1rem, 2.6vw, 1.9rem)" }}
                >
                  {item.q}
                </span>
                <motion.span
                  aria-hidden
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25, ease }}
                  className="shrink-0 font-departure text-3xl leading-none"
                  style={{ color: accent }}
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={reduce ? undefined : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="overflow-hidden"
                  >
                    <p
                      className="max-w-[760px] pb-7 font-mono text-base leading-relaxed md:text-lg"
                      style={{ color: body }}
                    >
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
