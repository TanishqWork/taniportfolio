"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { siteConfig } from "@/lib/site-config";

const ease = [0.65, 0.01, 0.05, 0.99] as const;

/* ───── helpers ───── */

function useLocalTime(timezone: string) {
  const [time, setTime] = useState<string>("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: timezone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);
  return time;
}

/* ───── SVG primitives ───── */

function GridBackground({ accent }: { accent: string }) {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="contact-grid"
          width="56"
          height="56"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 56 0 L 0 0 0 56"
            fill="none"
            stroke={accent}
            strokeWidth="0.4"
            strokeOpacity="0.18"
          />
        </pattern>
        <radialGradient id="contact-grid-fade" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="70%" stopColor="#000" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000" stopOpacity="1" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#contact-grid)" />
      <rect width="100%" height="100%" fill="url(#contact-grid-fade)" />
    </svg>
  );
}

function ScanLine({ accent }: { accent: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 h-[2px]"
      style={{
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        boxShadow: `0 0 24px ${accent}, 0 0 48px ${accent}66`,
      }}
      initial={{ top: "-2%", opacity: 0 }}
      whileInView={
        reduce
          ? { opacity: 0 }
          : { top: ["-2%", "102%"], opacity: [0, 0.8, 0] }
      }
      viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
      transition={{
        duration: 1.6,
        ease: "easeInOut",
        delay: 0.2,
        times: [0, 0.5, 1],
      }}
    />
  );
}

function PulseDot({ color }: { color: string }) {
  return (
    <span
      className="relative inline-flex h-2.5 w-2.5"
      aria-hidden
    >
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color, opacity: 0.5 }}
        animate={{ scale: [1, 2.3, 2.3], opacity: [0.5, 0, 0] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeOut",
          times: [0, 0.7, 1],
        }}
      />
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 12px ${color}, 0 0 24px ${color}66`,
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </span>
  );
}

/* ───── magnetic email card ───── */

function MagneticEmailCard({
  email,
  mailto,
  label,
  textColor,
  accent,
  muted,
}: {
  email: string;
  mailto: string;
  label: string;
  textColor: string;
  accent: string;
  muted: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tx = useSpring(useTransform(mx, [-1, 1], [-10, 10]), {
    stiffness: 220,
    damping: 22,
  });
  const ty = useSpring(useTransform(my, [-1, 1], [-6, 6]), {
    stiffness: 220,
    damping: 22,
  });
  const [copied, setCopied] = useState(false);

  function onMove(e: React.MouseEvent) {
    if (!ref.current || reduce) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }
  async function copy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <motion.a
      ref={ref}
      href={mailto}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: reduce ? 0 : tx, y: reduce ? 0 : ty }}
      whileHover={reduce ? undefined : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative block w-full overflow-hidden rounded-2xl"
    >
      {/* outer glow border */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          padding: 1,
          background: `linear-gradient(120deg, ${accent}, ${accent}33 40%, ${accent} 100%)`,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* inner glow on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at center, ${accent}22, transparent 60%)`,
        }}
      />

      <div className="relative px-6 py-7 sm:px-10 sm:py-10">
        <div className="flex items-center justify-between gap-4">
          <span
            className="font-mono text-[0.7rem] uppercase tracking-[0.3em]"
            style={{ color: muted }}
          >
            {label}
          </span>
          <span
            className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.25em]"
            style={{ color: accent }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
            primary channel
          </span>
        </div>

        <p
          className="mt-5 break-all font-mono font-bold leading-[1.05]"
          style={{
            color: textColor,
            fontSize: "clamp(1.4rem, 4vw, 2.6rem)",
          }}
        >
          {email}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-[color:var(--accent)] transition-colors group-hover:bg-[color:var(--accent)] group-hover:text-black"
            style={{ "--accent": accent, borderColor: accent } as React.CSSProperties}
          >
            send mail
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </span>

          <button
            onClick={copy}
            type="button"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-[color:var(--ink)] transition-colors hover:bg-white hover:text-black"
            style={{ "--ink": textColor, borderColor: `${textColor}40` } as React.CSSProperties}
            aria-label="Copy email"
          >
            {copied ? (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 13l4 4L19 7" />
                </svg>
                copied
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                </svg>
                copy
              </>
            )}
          </button>
        </div>
      </div>
    </motion.a>
  );
}

/* ───── channel card ───── */

function ChannelCard({
  channel,
  textColor,
  accent,
  muted,
  index,
}: {
  channel: (typeof siteConfig.contact.channels)[number];
  textColor: string;
  accent: string;
  muted: string;
  index: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={channel.href}
      target={channel.href.startsWith("http") ? "_blank" : undefined}
      rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
      transition={{ duration: 0.6, ease, delay: 1.05 + index * 0.08 }}
      whileHover={reduce ? undefined : { y: -3 }}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-xl px-5 py-5"
      style={{ border: `1px solid ${textColor}20`, color: textColor }}
    >
      {/* hover glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at top, ${accent}22, transparent 60%)`,
        }}
      />
      {/* hover border */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl border opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ borderColor: accent }}
      />

      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[0.65rem] uppercase tracking-[0.3em]"
          style={{ color: muted }}
        >
          {channel.label}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          style={{ color: accent }}
        >
          <path d="M7 7h10v10" />
          <path d="M7 17 17 7" />
        </svg>
      </div>

      <p className="font-mono text-base sm:text-lg" style={{ color: textColor }}>
        {channel.value}
      </p>
    </motion.a>
  );
}

/* ───── section ───── */

export function Contact() {
  const c = siteConfig.contact;
  const reduce = useReducedMotion();
  const time = useLocalTime(c.available.timezone);

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden px-6 pb-[10vh] pt-[14vh] md:px-12"
      style={{ backgroundColor: c.background, color: c.textColor }}
    >
      <GridBackground accent={c.accent} />
      <ScanLine accent={c.accent} />

      {/* ambient corner glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${c.accent}22, transparent 60%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${c.red}11, transparent 60%)`,
          filter: "blur(40px)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px]">
        {/* eyebrow */}
        <div className="flex items-center gap-4">
          <motion.span
            className="h-px flex-1 origin-left"
            style={{ backgroundColor: c.textColor, opacity: 0.25 }}
            initial={reduce ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 0.25 }}
            viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
            transition={{ duration: 0.7, ease }}
          />
          <motion.span
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
            transition={{ duration: 0.5, ease, delay: 0.15 }}
            className="font-mono text-xs uppercase tracking-[0.3em]"
          >
            {c.eyebrow} - 06
          </motion.span>
          <motion.span
            className="h-px w-12 origin-left"
            style={{ backgroundColor: c.textColor, opacity: 0.25 }}
            initial={reduce ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 0.25 }}
            viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
            transition={{ duration: 0.5, ease, delay: 0.25 }}
          />
          <motion.span
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
            transition={{ duration: 0.5, ease, delay: 0.3 }}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: c.accent }}
          >
            <PulseDot color={c.accent} />
            {c.statusLabel}
          </motion.span>
        </div>

        {/* headline */}
        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <motion.h2
              className="font-departure font-black uppercase leading-[0.92] tracking-tight"
              style={{
                fontSize: "clamp(3.5rem, 11vw, 9rem)",
                color: c.textColor,
              }}
            >
              {c.headline.map((line, i) => (
                <motion.div
                  key={line}
                  initial={
                    reduce
                      ? { opacity: 0 }
                      : { opacity: 0, y: 80, filter: "blur(8px)" }
                  }
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
                  transition={{
                    duration: 1,
                    ease,
                    delay: 0.35 + i * 0.18,
                  }}
                  className="block"
                  style={i === 1 ? { color: c.accent } : undefined}
                >
                  {line}
                </motion.div>
              ))}
            </motion.h2>
            <motion.p
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
              transition={{ duration: 0.7, ease, delay: 0.7 }}
              className="mt-6 max-w-[560px] font-mono text-sm leading-relaxed sm:text-[0.95rem]"
              style={{ color: c.muted }}
            >
              {c.intro}
            </motion.p>
          </div>

          {/* live status board */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
            transition={{ duration: 0.8, ease, delay: 0.55 }}
            className="self-end md:col-span-5"
          >
            <div
              className="rounded-xl px-5 py-5"
              style={{ border: `1px solid ${c.textColor}20` }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[0.65rem] uppercase tracking-[0.3em]"
                  style={{ color: c.muted }}
                >
                  Live · station Tanishq
                </span>
                <span
                  className="font-mono text-[0.65rem] uppercase tracking-[0.3em]"
                  style={{ color: c.accent }}
                >
                  {c.available.timezoneShort}
                </span>
              </div>
              <p
                className="mt-4 font-mono"
                style={{ color: c.textColor, fontSize: "clamp(1.6rem, 3vw, 2rem)" }}
              >
                {time}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <PulseDot color={c.accent} />
                <span
                  className="font-mono text-[0.7rem] uppercase tracking-[0.25em]"
                  style={{ color: c.textColor }}
                >
                  {c.available.label}
                </span>
                <span
                  className="font-mono text-[0.7rem] uppercase tracking-[0.25em]"
                  style={{ color: c.muted }}
                >
                  · {c.available.location}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* email card */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
          transition={{ duration: 0.8, ease, delay: 0.85 }}
          className="mt-12"
        >
          <MagneticEmailCard
            email={c.primary.email}
            mailto={c.primary.mailto}
            label={c.primary.label}
            textColor={c.textColor}
            accent={c.accent}
            muted={c.muted}
          />
        </motion.div>

        {/* secondary channels */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {c.channels.map((ch, i) => (
            <ChannelCard
              key={ch.id}
              channel={ch}
              textColor={c.textColor}
              accent={c.accent}
              muted={c.muted}
              index={i}
            />
          ))}
        </div>

        {/* resume download */}
        <motion.a
          href={c.resume.href}
          download={c.resume.fileName}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
          transition={{ duration: 0.7, ease, delay: 1.4 }}
          whileHover={reduce ? undefined : { y: -2 }}
          className="group relative mt-8 flex items-center justify-between gap-4 overflow-hidden rounded-xl px-5 py-5 sm:px-7"
          style={{
            border: `1px solid ${c.accent}`,
            color: c.accent,
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
            style={{ backgroundColor: c.accent }}
          />
          <div className="relative flex items-center gap-4">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors group-hover:text-black"
              aria-hidden
            >
              <path d="M12 4v12" />
              <path d="m6 12 6 6 6-6" />
              <path d="M5 21h14" />
            </svg>
            <div className="transition-colors group-hover:text-black">
              <p className="font-mono text-base uppercase tracking-[0.2em] sm:text-lg">
                {c.resume.label}
              </p>
              <p
                className="font-mono text-[0.65rem] uppercase tracking-[0.25em]"
                style={{ color: `${c.accent}99` }}
              >
                {c.resume.sub}
              </p>
            </div>
          </div>
          <span
            className="relative font-mono text-[0.65rem] uppercase tracking-[0.3em] transition-colors group-hover:text-black"
            style={{ color: `${c.accent}99` }}
          >
            ↓ .pdf
          </span>
        </motion.a>

        {/* closer */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
          transition={{ duration: 0.7, ease, delay: 1.6 }}
          className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 font-mono text-[0.65rem] uppercase tracking-[0.3em] sm:flex-row"
          style={{ borderColor: `${c.textColor}15`, color: c.muted }}
        >
          <span>Bangalore · IND · 12.97°N 77.59°E</span>
          <span style={{ color: c.accent }}>{c.closer}</span>
          <span suppressHydrationWarning>{new Date().getFullYear()}</span>
        </motion.div>
      </div>
    </section>
  );
}
