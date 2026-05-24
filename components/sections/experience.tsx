"use client";

import { motion, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/site-config";

const ease = [0.65, 0.01, 0.05, 0.99] as const;

type Job = (typeof siteConfig.experience.jobs)[number];

function PerforatedEdge({
  pageBg,
  side,
}: {
  pageBg: string;
  side: "top" | "bottom";
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-0 right-0 h-3"
      style={{
        [side]: 0,
        transform: side === "top" ? "translateY(-50%)" : "translateY(50%)",
        backgroundImage: `radial-gradient(circle 5px at center, ${pageBg} 4.5px, transparent 5px)`,
        backgroundSize: "16px 12px",
        backgroundRepeat: "repeat-x",
        backgroundPosition: "center",
      }}
    />
  );
}

function InkStamp({
  id,
  current,
  sub,
  accent,
  textColor,
}: {
  id: string;
  current: boolean;
  sub: string;
  accent: string;
  textColor: string;
}) {
  const color = current ? accent : `${textColor}AA`;
  const tilt = current ? -8 : 7;
  const label = current ? "CURRENT" : "CLOSED";
  const filterId = `stamp-ink-${id}`;
  const arcId = `stamp-arc-${id}`;

  return (
    <motion.svg
      width="92"
      height="92"
      viewBox="0 0 120 120"
      style={{ color, overflow: "visible" }}
      initial={{ scale: 1.7, opacity: 0, rotate: tilt + 14 }}
      whileInView={{ scale: 1, opacity: 0.92, rotate: tilt }}
      viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
      transition={{
        type: "spring",
        stiffness: 600,
        damping: 14,
        mass: 0.7,
        delay: 0.45,
      }}
    >
      <defs>
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed={current ? 4 : 7}
          />
          <feDisplacementMap in="SourceGraphic" scale="1.6" />
        </filter>
        <path
          id={arcId}
          d="M 18 60 A 42 42 0 0 1 102 60"
          fill="none"
        />
      </defs>

      <g
        filter={`url(#${filterId})`}
        stroke="currentColor"
        fill="currentColor"
      >
        <circle cx="60" cy="60" r="54" fill="none" strokeWidth="3" />
        <circle cx="60" cy="60" r="46" fill="none" strokeWidth="1" />

        <text
          fontSize="9"
          letterSpacing="2.5"
          stroke="none"
          style={{ fontFamily: "var(--font-departure-raw), monospace" }}
        >
          <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
            AUTHENTICATED ✦ CERTIFIED
          </textPath>
        </text>

        <text
          x="60"
          y="63"
          textAnchor="middle"
          fontSize="14"
          stroke="none"
          letterSpacing="1.5"
          style={{ fontFamily: "var(--font-departure-raw), monospace" }}
        >
          {label}
        </text>
        <text
          x="60"
          y="80"
          textAnchor="middle"
          fontSize="9"
          stroke="none"
          letterSpacing="2"
          style={{ fontFamily: "var(--font-departure-raw), monospace" }}
        >
          ◆ {sub} ◆
        </text>
      </g>
    </motion.svg>
  );
}

const BARCODE_WIDTHS = [
  2, 1, 3, 1, 2, 1, 1, 3, 1, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 3, 1, 2, 1, 1, 3, 1,
  2, 1, 3, 1,
];

function Barcode({ color }: { color: string }) {
  let x = 0;
  const bars = BARCODE_WIDTHS.map((w, i) => {
    const rect = (
      <rect key={i} x={x} y="0" width={w} height="22" fill={color} />
    );
    x += w + 1;
    return rect;
  });
  return (
    <svg
      width={x}
      height="22"
      viewBox={`0 0 ${x} 22`}
      aria-hidden
      style={{ display: "block" }}
    >
      {bars}
    </svg>
  );
}

function Stars({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="11"
          height="11"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={i < count ? color : "transparent"}
            stroke={color}
            strokeWidth="1.4"
          />
        </svg>
      ))}
    </div>
  );
}

function JobTicket({
  job,
  index,
  ticketBg,
  pageBg,
  accent,
  textColor,
}: {
  job: Job;
  index: number;
  ticketBg: string;
  pageBg: string;
  accent: string;
  textColor: string;
}) {
  const reduce = useReducedMotion();
  const startRotate = job.rotate * 2.5;

  return (
    <motion.article
      initial={
        reduce
          ? { opacity: 0 }
          : { y: 60, rotate: startRotate, opacity: 0 }
      }
      whileInView={{ y: 0, rotate: job.rotate, opacity: 1 }}
      viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 22,
        mass: 1.1,
        delay: index * 0.18,
      }}
      whileHover={
        reduce
          ? undefined
          : {
              y: -8,
              rotate: 0,
              zIndex: 50,
              boxShadow: "0 24px 48px -18px rgba(42,24,16,0.32)",
              transition: {
                type: "spring",
                stiffness: 320,
                damping: 24,
                mass: 0.6,
              },
            }
      }
      className="relative mx-auto w-full max-w-[680px] cursor-default px-7 py-10 sm:px-12 sm:py-14"
      style={{
        backgroundColor: ticketBg,
        color: textColor,
        boxShadow: "0 8px 24px -14px rgba(42,24,16,0.28)",
        zIndex: 10 - index,
        marginTop: index === 0 ? 0 : -32,
      }}
    >
      <PerforatedEdge pageBg={pageBg} side="top" />

      {/* header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className="font-departure text-[0.65rem] uppercase tracking-[0.35em]"
            style={{ color: accent }}
          >
            N° {job.serial}
          </p>
          <h3
            className="mt-3 font-departure uppercase leading-[0.95]"
            style={{
              fontSize: "clamp(1.6rem, 3.6vw, 2.4rem)",
              textShadow: `0.6px 0 0 ${textColor}, -0.6px 0 0 ${textColor}`,
            }}
          >
            {job.company}
          </h3>
          <p className="mt-2 font-departure text-base sm:text-[1.05rem]">
            {job.role}
          </p>
          <p
            className="mt-1 font-departure text-[0.7rem] uppercase tracking-[0.25em]"
            style={{ color: `${textColor}99` }}
          >
            {job.location} · {job.dates}
          </p>
        </div>
        <div className="-mt-2 shrink-0">
          <InkStamp
            id={job.serial}
            current={job.current}
            sub={job.stampSub}
            accent={accent}
            textColor={textColor}
          />
        </div>
      </div>

      <div
        className="my-7 h-px"
        style={{ backgroundColor: accent, opacity: 0.45 }}
      />

      {/* bullets */}
      <ul className="space-y-3.5">
        {job.bullets.map((bullet, i) => (
          <motion.li
            key={i}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
            transition={{
              duration: 0.5,
              ease,
              delay: 0.55 + i * 0.08,
            }}
            className="flex gap-3 font-departure text-sm leading-relaxed sm:text-[0.95rem]"
          >
            <span aria-hidden className="select-none" style={{ color: accent }}>
              ▸
            </span>
            <span>{bullet}</span>
          </motion.li>
        ))}
      </ul>

      <div
        className="my-7 h-px"
        style={{ backgroundColor: accent, opacity: 0.45 }}
      />

      {/* stack */}
      <p
        className="font-departure text-xs leading-relaxed sm:text-[0.8rem]"
        style={{ color: `${textColor}AA` }}
      >
        <span style={{ color: accent }}>STACK ▸ </span>
        {job.stack.map((tech, i) => (
          <span key={tech}>
            {tech.toLowerCase()}
            {i < job.stack.length - 1 && (
              <span style={{ color: `${accent}66` }}> · </span>
            )}
          </span>
        ))}
      </p>

      {/* footer */}
      <div className="mt-7 flex items-end justify-between gap-4">
        <div>
          <Barcode color={textColor} />
          <p
            className="mt-1.5 font-departure text-[0.6rem] uppercase tracking-[0.3em]"
            style={{ color: `${textColor}77` }}
          >
            N° {job.serial} · authenticated
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Stars count={job.stars} color={accent} />
          <span
            className="font-departure text-[0.6rem] uppercase tracking-[0.3em]"
            style={{ color: `${textColor}77` }}
          >
            confidence
          </span>
        </div>
      </div>

      <PerforatedEdge pageBg={pageBg} side="bottom" />
    </motion.article>
  );
}

export function Experience() {
  const { background, ticketBg, textColor, accent, eyebrow, jobs, status } =
    siteConfig.experience;
  const reduce = useReducedMotion();

  return (
    <section
      id="experience"
      className="relative w-full overflow-hidden px-6 py-[16vh] md:px-12"
      style={{ backgroundColor: background, color: textColor }}
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
          style={{ backgroundColor: textColor, opacity: 0.35 }}
        />
        <span className="font-departure text-xs uppercase tracking-[0.3em] opacity-70">
          {eyebrow} - 03
        </span>
        <span
          className="h-px w-12"
          style={{ backgroundColor: textColor, opacity: 0.35 }}
        />
        <span className="font-departure text-xs uppercase tracking-[0.3em] opacity-70">
          {String(jobs.length).padStart(2, "0")} ROLES
        </span>
      </motion.div>

      {/* big section title - newspaper masthead feel */}
      <motion.h2
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
        transition={{ duration: 0.9, ease }}
        className="mx-auto mt-12 max-w-[1100px] font-departure font-black uppercase leading-[0.92] tracking-tight"
        style={{
          fontSize: "clamp(2.5rem, 8vw, 6.5rem)",
        }}
      >
        Where I&apos;ve <span style={{ color: accent }}>shipped</span>.
      </motion.h2>
      <motion.p
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
        transition={{ duration: 0.8, ease, delay: 0.15 }}
        className="mx-auto mt-4 max-w-[1100px] font-departure text-sm uppercase tracking-[0.25em]"
        style={{ color: `${textColor}99` }}
      >
        Three stubs. Each one represents a stack, a team, and a thing that
        actually went to production.
      </motion.p>

      {/* tickets */}
      <div className="mx-auto mt-20">
        {jobs.map((job, i) => (
          <JobTicket
            key={job.serial}
            job={job}
            index={i}
            ticketBg={ticketBg}
            pageBg={background}
            accent={accent}
            textColor={textColor}
          />
        ))}
      </div>

      {/* status pill */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
        transition={{ duration: 0.7, ease }}
        className="mx-auto mt-[12vh] flex max-w-[1100px] flex-col items-center gap-2 text-center"
      >
        <span
          className="inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 font-departure text-[0.7rem] uppercase tracking-[0.25em]"
          style={{ borderColor: accent, color: accent }}
        >
          <motion.span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: accent }}
            animate={
              reduce
                ? undefined
                : { opacity: [1, 0.3, 1], scale: [1, 0.9, 1] }
            }
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          {status}
        </span>
      </motion.div>
    </section>
  );
}
