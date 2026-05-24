"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { siteConfig } from "@/lib/site-config";

const ease = [0.65, 0.01, 0.05, 0.99] as const;
const auraEase = [0.25, 0.4, 0.3, 1] as const;

/* ───── aura halo primitive ───── */

function Aura({
  color,
  delay = 0,
  duration = 1.6,
  size = "lg",
  intensity = 0.7,
  blur = 80,
}: {
  color: string;
  delay?: number;
  duration?: number;
  size?: "sm" | "md" | "lg" | "xl";
  intensity?: number;
  blur?: number;
}) {
  const reduce = useReducedMotion();
  const scales = {
    sm: { from: 0.4, peak: 1.15, end: 0.85 },
    md: { from: 0.5, peak: 1.35, end: 1.0 },
    lg: { from: 0.6, peak: 1.55, end: 1.1 },
    xl: { from: 0.7, peak: 1.8, end: 1.2 },
  }[size];

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        zIndex: -1,
        background: `radial-gradient(circle at center, ${color} 0%, ${color}33 30%, transparent 65%)`,
        filter: `blur(${blur}px)`,
        willChange: "transform, opacity",
      }}
      initial={
        reduce ? { opacity: 0 } : { opacity: 0, scale: scales.from }
      }
      whileInView={{
        opacity: [0, intensity, intensity * 0.35],
        scale: [scales.from, scales.peak, scales.end],
      }}
      viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
      transition={{
        duration,
        ease: auraEase,
        delay,
        times: [0, 0.55, 1],
      }}
    />
  );
}

/* ───── small SVG primitives ───── */

function Crest({ color }: { color: string }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 60 60"
      fill="none"
      stroke={color}
      strokeWidth="1.4"
      aria-hidden
    >
      <circle cx="30" cy="30" r="26" />
      <circle cx="30" cy="30" r="22" />
      <path d="M 22 16 L 38 16 L 38 32 Q 38 40 30 44 Q 22 40 22 32 Z" />
      <line x1="26" y1="24" x2="34" y2="24" />
      <line x1="26" y1="28" x2="34" y2="28" />
      <line x1="26" y1="32" x2="34" y2="32" />
      <path d="M 13 30 Q 17 36 21 30" />
      <path d="M 39 30 Q 43 36 47 30" />
    </svg>
  );
}

function PhotoPlaceholder({ color }: { color: string }) {
  return (
    <div
      className="relative h-[78px] w-[60px] shrink-0 overflow-hidden rounded-sm sm:h-[120px] sm:w-[96px]"
      style={{
        backgroundColor: `${color}10`,
        border: `1px solid ${color}30`,
      }}
    >
      <img
        src="/Tanishq.webp"
        alt="Tanishq Bhosale"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "grayscale(0.15) contrast(1.05)" }}
      />
      <span
        aria-hidden
        className="absolute bottom-1 right-1 font-departure text-[0.45rem] uppercase tracking-[0.2em]"
        style={{ color: `${color}66` }}
      >
        photo
      </span>
    </div>
  );
}

function MagneticStripe() {
  return (
    <div
      className="h-10 w-full"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #1a1a1a 0%, #2e2e2e 30%, #1f1f1f 50%, #2a2a2a 70%, #141414 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.4)",
      }}
    />
  );
}

const BAR_WIDTHS = [
  2, 1, 3, 1, 2, 1, 1, 3, 1, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 3, 1, 2, 1, 1, 3, 1,
  2, 1, 3, 1, 1, 2, 3,
];

function Barcode({ color }: { color: string }) {
  let x = 0;
  return (
    <svg
      width="100%"
      height="44"
      viewBox="0 0 200 44"
      preserveAspectRatio="none"
      aria-hidden
      style={{ display: "block" }}
    >
      {BAR_WIDTHS.map((w, i) => {
        const r = <rect key={i} x={x} y="0" width={w} height="44" fill={color} />;
        x += w + 1;
        return r;
      })}
    </svg>
  );
}

function WaxSeal({
  value,
  year,
  color,
  id,
}: {
  value: string;
  year: string;
  color: string;
  id: string;
}) {
  const filterId = `wax-${id}`;
  const arcId = `wax-arc-${id}`;
  return (
    <motion.svg
      width="84"
      height="84"
      viewBox="0 0 120 120"
      style={{ color, overflow: "visible" }}
      initial={{ scale: 1.7, opacity: 0, rotate: 8 }}
      whileInView={{ scale: 1, opacity: 0.95, rotate: -7 }}
      viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
      transition={{
        type: "spring",
        stiffness: 600,
        damping: 14,
        mass: 0.7,
        delay: 0.85,
      }}
    >
      <defs>
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed={3}
          />
          <feDisplacementMap in="SourceGraphic" scale="1.6" />
        </filter>
        <path id={arcId} d="M 18 60 A 42 42 0 0 1 102 60" fill="none" />
      </defs>
      <g filter={`url(#${filterId})`} stroke="currentColor" fill="currentColor">
        <circle cx="60" cy="60" r="54" fill="none" strokeWidth="3" />
        <circle cx="60" cy="60" r="46" fill="none" strokeWidth="1" />
        <text
          fontSize="9"
          stroke="none"
          letterSpacing="2.5"
          style={{ fontFamily: "var(--font-departure-raw), monospace" }}
        >
          <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
            CGPA ✦ TRANSCRIPT
          </textPath>
        </text>
        <text
          x="60"
          y="65"
          textAnchor="middle"
          fontSize="20"
          stroke="none"
          letterSpacing="1.5"
          style={{ fontFamily: "var(--font-departure-raw), monospace" }}
        >
          {value}
        </text>
        <text
          x="60"
          y="83"
          textAnchor="middle"
          fontSize="9"
          stroke="none"
          letterSpacing="2"
          style={{ fontFamily: "var(--font-departure-raw), monospace" }}
        >
          ◆ {year} ◆
        </text>
      </g>
    </motion.svg>
  );
}

/* ───── card faces ───── */

function CardFront({
  ink,
  accent,
  card,
}: {
  ink: string;
  accent: string;
  card: typeof siteConfig.education.card;
}) {
  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{
        backgroundColor: siteConfig.education.cardStock,
        color: ink,
        borderRadius: 14,
        border: `1px solid ${ink}20`,
        boxShadow:
          "0 30px 60px -25px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.4)",
      }}
    >
      {/* header strip */}
      <div
        className="flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-5 sm:py-2.5"
        style={{ backgroundColor: accent, color: ink }}
      >
        <div style={{ color: ink }}>
          <Crest color={ink} />
        </div>
        <div className="flex-1">
          <p className="font-departure text-[0.6rem] uppercase tracking-[0.3em] opacity-70">
            {card.shortName}
          </p>
          <p className="font-departure text-sm uppercase leading-none">
            {card.university}
          </p>
        </div>
        <span className="font-departure text-[0.6rem] uppercase tracking-[0.3em] opacity-70">
          STUDENT ID
        </span>
      </div>

      {/* body */}
      <div className="grid flex-1 grid-cols-[auto_1fr] gap-3 px-3 py-3 sm:gap-5 sm:px-5 sm:py-5">
        <PhotoPlaceholder color={ink} />
        <div className="flex flex-col justify-center gap-1 min-w-0">
          <p
            className="font-departure text-[0.55rem] uppercase tracking-[0.3em]"
            style={{ color: `${ink}88` }}
          >
            Name
          </p>
          <p
            className="font-departure uppercase leading-tight"
            style={{
              fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)",
              textShadow: `0.4px 0 0 ${ink}, -0.4px 0 0 ${ink}`,
            }}
          >
            {card.name}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
            <div>
              <p
                className="font-departure text-[0.5rem] uppercase tracking-[0.25em]"
                style={{ color: `${ink}88` }}
              >
                Programme
              </p>
              <p className="font-departure text-[0.7rem] leading-tight">
                {card.degree}
              </p>
            </div>
            <div>
              <p
                className="font-departure text-[0.5rem] uppercase tracking-[0.25em]"
                style={{ color: `${ink}88` }}
              >
                Batch
              </p>
              <p className="font-departure text-[0.7rem] leading-tight">
                {card.batch}
              </p>
            </div>
            <div>
              <p
                className="font-departure text-[0.5rem] uppercase tracking-[0.25em]"
                style={{ color: `${ink}88` }}
              >
                ID №
              </p>
              <p className="font-departure text-[0.7rem] leading-tight">
                {card.idNumber}
              </p>
            </div>
            <div>
              <p
                className="font-departure text-[0.5rem] uppercase tracking-[0.25em]"
                style={{ color: `${ink}88` }}
              >
                Issued
              </p>
              <p className="font-departure text-[0.7rem] leading-tight">
                {card.issued}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* footer: signature + wax seal */}
      <div
        className="relative flex items-end justify-between gap-3 border-t px-5 pb-4 pt-3"
        style={{ borderColor: `${ink}25` }}
      >
        <div className="flex flex-col">
          <span
            className="font-departure text-[0.55rem] uppercase tracking-[0.25em]"
            style={{ color: `${ink}77` }}
          >
            Bearer signature
          </span>
          <span
            className="mt-2 inline-block w-44"
            style={{
              borderBottom: `1px solid ${ink}99`,
              height: 18,
              fontFamily: "cursive",
              fontStyle: "italic",
              fontSize: "0.95rem",
              color: ink,
              opacity: 0.7,
            }}
          >
            Tanishq B.
          </span>
        </div>
        <div className="absolute -top-6 right-4">
          <WaxSeal
            id="cgpa"
            value={card.cgpa}
            year={card.validThrough}
            color={siteConfig.education.red}
          />
        </div>
      </div>
    </div>
  );
}

function CardBack({
  ink,
  card,
}: {
  ink: string;
  card: typeof siteConfig.education.card;
}) {
  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{
        backgroundColor: siteConfig.education.cardStock,
        color: ink,
        borderRadius: 14,
        border: `1px solid ${ink}20`,
        boxShadow:
          "0 30px 60px -25px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.4)",
      }}
    >
      <div className="px-5 pt-5">
        <MagneticStripe />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 py-5">
        <div>
          <Barcode color={ink} />
          <p
            className="mt-2 text-center font-departure text-[0.7rem] uppercase tracking-[0.5em]"
            style={{ color: ink }}
          >
            {card.idNumber}
          </p>
        </div>

        <div
          className="mt-2 grid grid-cols-1 gap-y-1.5"
          style={{ color: ink }}
        >
          <p
            className="font-departure text-[0.6rem] uppercase tracking-[0.25em]"
            style={{ color: `${ink}77` }}
          >
            Property of
          </p>
          <p className="font-departure text-[0.85rem] uppercase">
            {card.university}
          </p>
          <p
            className="font-departure text-[0.6rem] uppercase tracking-[0.25em]"
            style={{ color: `${ink}77` }}
          >
            If found, return to
          </p>
          <p
            className="font-departure text-[0.7rem] leading-relaxed"
            style={{ color: `${ink}cc` }}
          >
            {card.address}
          </p>
        </div>
      </div>

      <div
        className="border-t px-5 py-3 text-center"
        style={{ borderColor: `${ink}25` }}
      >
        <p
          className="font-departure text-[0.55rem] uppercase tracking-[0.3em]"
          style={{ color: `${ink}77` }}
        >
          Valid through {card.validThrough} · Non-transferable
        </p>
      </div>
    </div>
  );
}

/* ───── parallax / flip card ───── */

function StudentCard({
  ink,
  accent,
  card,
}: {
  ink: string;
  accent: string;
  card: typeof siteConfig.education.card;
}) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsTouch(
      window.matchMedia("(hover: none) and (pointer: coarse)").matches,
    );
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), {
    stiffness: 160,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), {
    stiffness: 160,
    damping: 18,
  });

  function onMove(e: React.MouseEvent) {
    if (!cardRef.current || reduce) return;
    const r = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }
  function handleTap() {
    setInteracted(true);
    setFlipped((f) => !f);
  }

  // Bounce hint for touch users — runs after the card lands, stops once tapped
  const shouldHint = isTouch && !interacted && !reduce;

  return (
    <div
      className="flex w-full flex-col items-center"
      style={{ perspective: "1400px" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={handleTap}
        initial={
          reduce
            ? { opacity: 0 }
            : { y: -120, opacity: 0, rotate: -3, scale: 0.92 }
        }
        whileInView={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
        transition={{
          type: "spring",
          stiffness: 170,
          damping: 22,
          mass: 1.4,
          delay: 0.85,
        }}
        style={{
          rotateX: reduce ? 0 : rx,
          rotateY: reduce ? 0 : ry,
          transformStyle: "preserve-3d",
          width: "min(540px, 94vw)",
          cursor: "pointer",
          willChange: "transform",
        }}
        className="relative aspect-[1.45/1] sm:aspect-[1.586/1]"
      >
        <motion.div
          animate={
            flipped
              ? { rotateY: 180, scale: 1 }
              : shouldHint
                ? {
                    rotateY: [0, -16, 12, -8, 0],
                    scale: [1, 1.025, 1.025, 1, 1],
                  }
                : { rotateY: 0, scale: 1 }
          }
          transition={
            flipped
              ? { duration: 0.7, ease }
              : shouldHint
                ? {
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: 3,
                    repeatDelay: 2.4,
                    delay: 1.6,
                  }
                : { duration: 0.7, ease }
          }
          style={{
            transformStyle: "preserve-3d",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {/* front */}
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            <CardFront ink={ink} accent={accent} card={card} />
          </div>

          {/* back */}
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CardBack ink={ink} card={card} />
          </div>

          {/* hover hologram glint */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-30"
            style={{
              borderRadius: 14,
              backgroundImage:
                "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.7) 45%, rgba(255,235,150,0.6) 50%, rgba(255,255,255,0.7) 55%, transparent 70%)",
              mixBlendMode: "overlay",
              transform: "translateZ(1px)",
            }}
          />
        </motion.div>
      </motion.div>

      <motion.p
        className="mt-6 text-center font-departure text-[0.7rem] uppercase tracking-[0.3em]"
        style={{ color: `${siteConfig.education.bodyColor}aa` }}
        animate={
          shouldHint
            ? { opacity: [0.6, 1, 0.6] }
            : { opacity: 0.7 }
        }
        transition={
          shouldHint
            ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 }
        }
      >
        {isTouch ? "👆 tap to flip" : "ⓘ tap to flip · move cursor to tilt"}
      </motion.p>
    </div>
  );
}

/* ───── typed closer ───── */

function TypedCloser({
  text,
  color,
}: {
  text: string;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.05,
    margin: "0px 0px 200px 0px",
  });
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setTyped(text);
      return;
    }
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= text.length; i++) {
      timeouts.push(setTimeout(() => setTyped(text.slice(0, i)), i * 30));
    }
    return () => timeouts.forEach(clearTimeout);
  }, [inView, reduce, text]);

  return (
    <div
      ref={ref}
      className="mx-auto mt-12 max-w-[700px] text-center font-departure text-base sm:text-lg"
      style={{ color }}
    >
      <span aria-hidden style={{ opacity: 0.6 }}>“</span>
      {typed}
      <motion.span
        aria-hidden
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.5, 0.5, 1],
        }}
        className="ml-0.5 inline-block"
      >
        ▮
      </motion.span>
    </div>
  );
}

/* ───── section ───── */

export function Education() {
  const ed = siteConfig.education;
  const reduce = useReducedMotion();

  return (
    <section
      id="education"
      className="relative w-full overflow-hidden px-6 py-[16vh] md:px-12"
      style={{ backgroundColor: ed.background, color: ed.bodyColor }}
    >
      {/* eyebrow */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
        transition={{ duration: 0.7, ease }}
        className="mx-auto flex max-w-[1100px] items-center gap-4"
      >
        <span
          className="h-px flex-1"
          style={{ backgroundColor: ed.bodyColor, opacity: 0.35 }}
        />
        <span className="font-departure text-xs uppercase tracking-[0.3em] opacity-70">
          {ed.eyebrow} — 04
        </span>
        <span
          className="h-px w-12"
          style={{ backgroundColor: ed.bodyColor, opacity: 0.35 }}
        />
        <span
          className="font-departure text-xs uppercase tracking-[0.3em]"
          style={{ color: ed.accent }}
        >
          ARCHIVE
        </span>
      </motion.div>

      {/* CLASS OF 2024 hero — beat 1: aura halo + cascading digits */}
      <div className="relative mx-auto mt-12 max-w-[1100px] text-center">
        <Aura color={ed.accent} size="xl" intensity={0.55} duration={1.8} blur={100} />
        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
          transition={{ duration: 0.7, ease }}
          className="font-departure text-xs uppercase tracking-[0.3em]"
          style={{ color: `${ed.bodyColor}99` }}
        >
          {ed.duration}
        </motion.p>
        <motion.h2
          initial={reduce ? { opacity: 0 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="relative mt-2 font-departure font-black uppercase leading-[0.92] tracking-tight"
          style={{
            fontSize: "clamp(4rem, 16vw, 14rem)",
            color: ed.bodyColor,
          }}
        >
          {ed.classOf.split("").map((d, i) => (
            <span
              key={i}
              className="relative inline-block"
              style={{ color: i === 2 ? ed.accent : ed.bodyColor }}
            >
              {/* per-digit halo */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  zIndex: -1,
                  background: `radial-gradient(circle, ${i === 2 ? ed.accent : ed.bodyColor}88 0%, transparent 70%)`,
                  filter: "blur(40px)",
                }}
                initial={
                  reduce ? { opacity: 0 } : { opacity: 0, scale: 0.4 }
                }
                whileInView={{
                  opacity: [0, 0.9, 0.35],
                  scale: [0.4, 1.6, 1.15],
                }}
                viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
                transition={{
                  duration: 1.3,
                  ease: auraEase,
                  delay: 0.2 + i * 0.1,
                  times: [0, 0.55, 1],
                }}
              />
              <motion.span
                className="relative inline-block"
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: 100, scale: 0.5, rotate: -8 }
                }
                whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  mass: 0.9,
                  delay: 0.25 + i * 0.1,
                }}
                style={{
                  textShadow:
                    i === 2 ? `0 0 30px ${ed.accent}66` : undefined,
                }}
              >
                {d}
              </motion.span>
            </span>
          ))}
        </motion.h2>
      </div>

      {/* card — beat 2: aura halo behind + StudentCard's own descent */}
      <div className="relative mx-auto mt-16 flex w-full justify-center">
        <div className="relative">
          <Aura
            color={ed.accent}
            size="lg"
            intensity={0.4}
            duration={1.6}
            delay={0.65}
            blur={90}
          />
          <Aura
            color={ed.cardStock}
            size="md"
            intensity={0.4}
            duration={1.4}
            delay={0.75}
            blur={70}
          />
          <StudentCard ink={ed.inkColor} accent={ed.accent} card={ed.card} />
        </div>
      </div>

      {/* courses + stats — beat 3: aura wash + line-by-line stream */}
      <div className="relative mx-auto mt-[12vh] max-w-[900px]">
        <Aura
          color={ed.accent}
          size="xl"
          intensity={0.25}
          duration={1.4}
          delay={1.7}
          blur={120}
        />
        <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
          {/* courses */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
            transition={{ duration: 0.7, ease, delay: 1.7 }}
          >
            <p
              className="font-departure text-xs uppercase tracking-[0.3em]"
              style={{ color: `${ed.bodyColor}99` }}
            >
              Coursework — partial transcript
            </p>
            <motion.div
              className="mt-4 h-px w-full origin-left"
              style={{ backgroundColor: ed.bodyColor, opacity: 0.25 }}
              initial={reduce ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 0.25 }}
              viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
              transition={{ duration: 0.7, ease, delay: 1.75 }}
            />
            <div className="mt-3 space-y-2.5">
              {ed.courses.map((c, i) => (
                <motion.div
                  key={c.code}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
                  transition={{
                    duration: 0.45,
                    ease,
                    delay: 1.85 + i * 0.06,
                  }}
                  className="grid grid-cols-[5.5rem_1fr] items-baseline gap-x-4 font-departure text-sm"
                >
                  <span
                    style={{ color: ed.accent }}
                    className="tracking-widest"
                  >
                    {c.code}
                  </span>
                  <span style={{ color: ed.bodyColor }}>{c.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* stats */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
            transition={{ duration: 0.7, ease, delay: 1.85 }}
          >
            <p
              className="font-departure text-xs uppercase tracking-[0.3em]"
              style={{ color: `${ed.bodyColor}99` }}
            >
              Numbers — at a glance
            </p>
            <motion.div
              className="mt-4 h-px w-full origin-left"
              style={{ backgroundColor: ed.bodyColor, opacity: 0.25 }}
              initial={reduce ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 0.25 }}
              viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
              transition={{ duration: 0.7, ease, delay: 1.9 }}
            />
            <div className="mt-3 space-y-2.5">
              {ed.stats.map((s, i) => (
                <motion.div
                  key={s}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
                  transition={{
                    duration: 0.45,
                    ease,
                    delay: 2.0 + i * 0.06,
                  }}
                  className="flex items-baseline gap-3 font-departure text-sm"
                >
                  <span style={{ color: ed.accent }} aria-hidden>
                    ·
                  </span>
                  <span style={{ color: ed.bodyColor }}>{s}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <TypedCloser text={ed.closer} color={ed.bodyColor} />
    </section>
  );
}
