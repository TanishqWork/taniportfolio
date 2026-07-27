"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/components/blog/motion-primitives";

const GATE = 70;

const BANDS = [
  {
    min: 90,
    label: "Strong fit",
    rubric: "all core requirements + most nice-to-haves",
    color: "#E4FE52",
    missing: ["Nothing blocking. Ship it."],
  },
  {
    min: 70,
    label: "Fit",
    rubric: "all CORE requirements; missing some nice-to-haves",
    color: "#B6E84A",
    missing: ["No Kubernetes in production", "No Terraform"],
  },
  {
    min: 50,
    label: "Partial",
    rubric: "some core requirements; clear gaps in the core",
    color: "#FFA23A",
    missing: [
      "Core: 5+ yrs Go — profile shows Python/TypeScript",
      "Core: distributed systems ownership",
      "No Kubernetes in production",
    ],
  },
  {
    min: 0,
    label: "Different role",
    rubric: "different role",
    color: "#FF5A52",
    missing: [
      "Core: this is an ML research role; profile is applied engineering",
      "Core: publication record required",
      "Core: PhD or equivalent",
    ],
  },
];

const bandFor = (score: number) => BANDS.find((b) => score >= b.min) ?? BANDS[3];

export function FitScoreDemo({ accent }: { accent: string }) {
  const [score, setScore] = useState(64);
  const band = bandFor(score);
  const unlocked = score >= GATE;

  // Semicircular gauge geometry.
  const R = 88;
  const CIRC = Math.PI * R;
  const dash = (score / 100) * CIRC;

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 sm:p-7">
      <div className="grid items-center gap-7 md:grid-cols-[minmax(0,300px)_1fr]">
        {/* gauge */}
        <div className="flex flex-col items-center">
          <svg
            viewBox="0 0 220 120"
            className="w-full max-w-[280px]"
            role="img"
            aria-label={`Fit score ${score} out of 100 — ${band.label}`}
          >
            <path
              d="M 22 110 A 88 88 0 0 1 198 110"
              fill="none"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <motion.path
              d="M 22 110 A 88 88 0 0 1 198 110"
              fill="none"
              stroke={band.color}
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              animate={{ strokeDashoffset: CIRC - dash }}
              transition={{ duration: 0.5, ease: EASE }}
            />
            {/* the gate marker */}
            <g
              transform={`rotate(${(GATE / 100) * 180 - 180} 110 110)`}
              opacity="0.85"
            >
              <line
                x1="15"
                y1="110"
                x2="35"
                y2="110"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeDasharray="3 3"
              />
            </g>
            <text
              x="110"
              y="96"
              textAnchor="middle"
              fill="#FFFFFF"
              className="font-departure"
              style={{ fontSize: 44, fontWeight: 800 }}
            >
              {score}
            </text>
            <text
              x="110"
              y="114"
              textAnchor="middle"
              fill="rgba(255,255,255,0.45)"
              style={{ fontSize: 11, letterSpacing: 2 }}
            >
              FIT SCORE
            </text>
          </svg>

          <label className="mt-4 w-full max-w-[280px]">
            <span className="sr-only">Drag to change the fit score</span>
            <input
              type="range"
              min={0}
              max={100}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full cursor-pointer accent-[#E4FE52]"
            />
          </label>
          <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white/35">
            drag me — the gate is at {GATE}
          </p>
        </div>

        {/* verdict */}
        <div className="space-y-4">
          <div>
            <motion.p
              key={band.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="font-departure text-2xl font-black uppercase tracking-tight sm:text-3xl"
              style={{ color: band.color }}
            >
              {band.label}
            </motion.p>
            <p className="mt-1 font-mono text-[0.75rem] text-white/45">
              {band.min}
              {band.min === 90 ? "-100" : `-${(BANDS.find((b) => b.min > band.min)?.min ?? 101) - 1}`}
              : {band.rubric}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="mb-2.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/40">
              missing[]
            </p>
            <ul className="space-y-1.5">
              <AnimatePresence mode="popLayout" initial={false}>
                {band.missing.map((m) => (
                  <motion.li
                    key={m}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="flex gap-2 font-mono text-[0.75rem] leading-relaxed text-white/70"
                  >
                    <span aria-hidden style={{ color: band.color }}>
                      —
                    </span>
                    {m}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          {/* the gate itself */}
          <motion.div
            animate={{
              borderColor: unlocked ? `${accent}88` : "rgba(255,255,255,0.10)",
            }}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-black/25 px-4 py-3.5"
          >
            <span className="font-mono text-[0.72rem] text-white/55">
              {unlocked
                ? "Core requirements met — generation unlocked."
                : `Below the ${GATE}% gate — you get the gaps, not a resume.`}
            </span>
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-departure text-[0.68rem] uppercase tracking-[0.16em] transition-colors"
              style={
                unlocked
                  ? { backgroundColor: accent, color: "#0A0A0A" }
                  : {
                      backgroundColor: "rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.35)",
                    }
              }
            >
              {unlocked ? "Generate ✓" : "Generate 🔒"}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
