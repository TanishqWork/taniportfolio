"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { siteConfig } from "@/lib/site-config";

export function Directors() {
  const { background, textColor, accentColor, items } = siteConfig.directors;
  const N = items.length;
  const rotateAmount = 360 / N;
  const zTranslateFactor = 2 * Math.tan((rotateAmount / 2) * (Math.PI / 180));

  // tile dimensions are controlled via CSS vars set on the perspective wrapper
  // so they can adapt across breakpoints (portrait mobile vs landscape desktop)
  const radius = `calc(var(--tile-w) / ${zTranslateFactor} + var(--tile-gap))`;
  const negRadius = `calc(var(--tile-w) / -${zTranslateFactor} - var(--tile-gap))`;
  const perspective = `calc(var(--tile-w) / ${zTranslateFactor} + var(--tile-gap))`;

  const trackRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const ringRotate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(360 - rotateAmount)],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.round(v * (N - 1))));
    if (i !== activeIndex) setActiveIndex(i);
  });

  return (
    <section
      id="directors"
      ref={trackRef}
      className="relative w-full"
      style={{ backgroundColor: background, height: `${N * 100}vh` }}
    >
      {/* layer 0 - sticky 3D ring + sticky arrows + counter */}
      <div className="sticky top-0 z-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <div
          className="relative h-full w-full [--tile-gap:14vw] [--tile-h:calc(var(--tile-w)*5/4)] [--tile-w:72vw] sm:[--tile-gap:30vw] sm:[--tile-h:calc(var(--tile-w)*9/16)] sm:[--tile-w:50vw]"
          style={{ perspective }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2"
            style={{
              x: "-50%",
              y: "-50%",
              transformStyle: "preserve-3d",
              rotateY: ringRotate,
              translateZ: negRadius,
            }}
          >
            {items.map((item, i) => {
              const tileStyle = {
                width: "var(--tile-w)",
                height: "var(--tile-h)",
                marginLeft: "calc(var(--tile-w) / -2)",
                marginTop: "calc(var(--tile-h) / -2)",
                transform: `rotateY(${rotateAmount * i}deg) translateZ(${radius})`,
                backfaceVisibility: "hidden" as const,
                background:
                  "linear-gradient(135deg, rgba(42,24,16,0.12), rgba(42,24,16,0.04))",
                outline: "1px solid rgba(42,24,16,0.18)",
              };
              const tileClass =
                "absolute left-1/2 top-1/2 flex flex-col overflow-hidden";
              const inner = (
                <div className="relative w-full flex-1">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 72vw"
                    className="object-cover"
                    loading="lazy"
                    unoptimized
                  />
                </div>
              );
              return item.href ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={tileClass}
                  style={tileStyle}
                >
                  {inner}
                </a>
              ) : (
                <div key={item.name} className={tileClass} style={tileStyle}>
                  {inner}
                </div>
              );
            })}
          </motion.div>
        </div>


        <div
          className="pointer-events-none absolute right-6 top-6 font-departure text-xs uppercase tracking-[0.2em]"
          style={{ color: textColor }}
        >
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(N).padStart(2, "0")}
        </div>
      </div>

      {/* layer 1 - stacked text panels (one per item, each 100vh).
          Absolute over the section so they scroll past the sticky ring. */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex h-screen w-full flex-col items-center justify-end px-6 pb-[10vh] text-center"
          >
            <h2
              className="font-departure font-black uppercase leading-none tracking-tight"
              style={{
                color: textColor,
                fontSize: "clamp(2.5rem, 7vw, 6.5rem)",
              }}
            >
              {item.name}
            </h2>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto mt-6 inline-flex items-center justify-center rounded-full px-6 py-2 text-xs uppercase tracking-[0.2em] transition-colors"
                style={{
                  border: `1px solid ${accentColor}`,
                  color: accentColor,
                }}
              >
                view project
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
