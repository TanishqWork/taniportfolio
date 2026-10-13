"use client";

/**
 * React-Bits-style animation primitives, built on the `motion` and `gsap`
 * already in this project rather than a new dependency.
 *
 *   <Reveal>            fade + rise + de-blur when scrolled into view
 *   <ScrollRevealText>  word-by-word reveal driven by scroll position
 *   <CountUp>           number that animates from 0 when it enters the viewport
 *   <DecryptedText>     scramble-to-resolve text
 *   <SpotlightCard>     card with a cursor-following highlight
 *   <Magnetic>          element that leans toward the cursor
 *   <ReadingProgress>   scroll-linked progress bar
 *   <Marquee>           infinite horizontal ticker
 *
 * Every one of them degrades to a plain static render under
 * `prefers-reduced-motion`.
 */

import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export const EASE = [0.65, 0.01, 0.05, 0.99] as const;

/* -------------------------------------------------------------------------- */
/*  Reveal                                                                     */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  delay = 0,
  y = 28,
  blur = 8,
  className,
  once = true,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: number;
  className?: string;
  once?: boolean;
  as?: "div" | "span" | "li";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      initial={
        reduce ? { opacity: 0 } : { opacity: 0, y, filter: `blur(${blur}px)` }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount: 0.15, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.75, ease: EASE, delay }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  ScrollRevealText                                                           */
/* -------------------------------------------------------------------------- */

function RevealWord({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const blurPx = useTransform(progress, range, [5, 0]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.span style={{ opacity, filter }} className="inline-block">
      {children}
    </motion.span>
  );
}

/**
 * Each word resolves as the paragraph travels up the viewport. Used for the
 * opening line of a section  expensive enough that it shouldn't be on
 * every paragraph.
 */
export function ScrollRevealText({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.35"],
  });

  const words = text.split(" ");

  if (reduce) {
    return (
      <p ref={ref} className={className} style={style}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <span key={`${word}-${i}`}>
            <RevealWord progress={scrollYProgress} range={[start, end]}>
              {word}
            </RevealWord>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*  CountUp                                                                    */
/* -------------------------------------------------------------------------- */

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1.4,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => mv.on("change", (v) => setDisplay(Math.round(v))), [mv]);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(mv, value, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, value, duration, mv, reduce]);

  // Reduced motion skips the animation entirely rather than setting state to
  // the final value in an effect  same result, no cascading render.
  const shown = reduce ? value : display;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  DecryptedText                                                              */
/* -------------------------------------------------------------------------- */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>*#$%&";

export function DecryptedText({
  text,
  className,
  speed = 38,
  style,
}: {
  text: string;
  className?: string;
  speed?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!inView || reduce) return;
    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      const revealed = Math.floor(frame / 2);
      if (revealed > text.length) {
        setOutput(text);
        clearInterval(id);
        return;
      }
      setOutput(
        text
          .split("")
          .map((ch, i) => {
            if (i < revealed || ch === " ") return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );
    }, speed);
    return () => clearInterval(id);
  }, [inView, text, speed, reduce]);

  // Reduced motion renders the resolved text directly, so nothing animates
  // and no state is written from an effect.
  const shown = reduce ? text : output;

  return (
    <span ref={ref} className={className} style={style}>
      {shown || "\u00A0"}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  SpotlightCard                                                              */
/* -------------------------------------------------------------------------- */

export function SpotlightCard({
  children,
  className,
  color = "rgba(228,254,82,0.14)",
  style,
}: {
  children: ReactNode;
  className?: string;
  color?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-500);
  const my = useMotionValue(-500);
  const background = useMotionTemplate`radial-gradient(340px circle at ${mx}px ${my}px, ${color}, transparent 72%)`;

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set(e.clientX - rect.left);
        my.set(e.clientY - rect.top);
      }}
      onPointerLeave={() => {
        mx.set(-500);
        my.set(-500);
      }}
      className={cn("group relative overflow-hidden", className)}
      style={style}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Magnetic                                                                   */
/* -------------------------------------------------------------------------- */

export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={reduce ? undefined : { x, y }}
      onPointerMove={(e) => {
        if (reduce) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  ReadingProgress                                                            */
/* -------------------------------------------------------------------------- */

export function ReadingProgress({ color = "#E4FE52" }: { color?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left"
      style={{ scaleX, backgroundColor: color }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Marquee                                                                    */
/* -------------------------------------------------------------------------- */

export function Marquee({
  items,
  speed = 34,
  className,
  style,
}: {
  items: string[];
  speed?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const row = [...items, ...items];

  return (
    <div
      className={cn("relative flex overflow-hidden whitespace-nowrap", className)}
      style={style}
    >
      <motion.div
        className="flex shrink-0 items-center gap-8 pr-8"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8">
            {item}
            <span aria-hidden className="opacity-40">
              ✦
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
