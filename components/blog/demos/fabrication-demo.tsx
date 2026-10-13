"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/components/blog/motion-primitives";

/** The facts the profile actually contains. Nothing else may ever appear. */
const PROFILE_SKILLS = [
  "Python",
  "FastAPI",
  "PostgreSQL",
  "React",
  "TypeScript",
  "LangGraph",
  "Docker",
];

/** What the pasted job description asks for. Two of these aren't in the profile. */
const JD_WANTS = ["Kotlin", "Rust", "FastAPI", "PostgreSQL", "React"];

/** Ungrounded output: JD terms get echoed back whether or not they're true. */
const UNGROUNDED = [
  "FastAPI",
  "PostgreSQL",
  "React",
  "Kotlin",
  "Rust",
  "Python",
  "TypeScript",
];

/** Grounded output: same repositioning, zero invention. */
const GROUNDED = [
  "FastAPI",
  "PostgreSQL",
  "React",
  "Python",
  "TypeScript",
  "LangGraph",
  "Docker",
];

const VERDICTS = [
  {
    ok: false,
    quote: "Kotlin",
    note: "appears nowhere in the profile  violation",
  },
  {
    ok: false,
    quote: "Rust",
    note: "appears nowhere in the profile  violation",
  },
  {
    ok: true,
    quote: "FastAPI, PostgreSQL, React moved to the front",
    note: "reordering  allowed",
  },
  {
    ok: true,
    quote: "“Built” → “Engineered”",
    note: "paraphrase  allowed",
  },
  {
    ok: true,
    quote: "ETL project reframed as a data-platform project",
    note: "repositioning  explicitly allowed",
  },
];

export function FabricationDemo({ accent }: { accent: string }) {
  const [grounded, setGrounded] = useState(true);
  const output = grounded ? GROUNDED : UNGROUNDED;
  const fabricated = (s: string) => !PROFILE_SKILLS.includes(s);

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 sm:p-7">
      {/* toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-departure text-[0.68rem] uppercase tracking-[0.22em] opacity-50">
            guardrails.check_facts()
          </p>
          <p className="mt-1.5 text-sm text-white/70">
            Same profile, same job description. One switch.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={grounded}
          onClick={() => setGrounded((v) => !v)}
          className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-3 py-2 transition-colors hover:border-white/30"
        >
          <span
            className="font-mono text-[0.7rem] uppercase tracking-[0.16em]"
            style={{ color: grounded ? accent : "#FF5A52" }}
          >
            {grounded ? "ON" : "OFF"}
          </span>
          <span
            className="relative h-5 w-10 rounded-full transition-colors"
            style={{
              backgroundColor: grounded ? accent : "rgba(255,90,82,0.5)",
            }}
          >
            <motion.span
              layout
              transition={{ duration: 0.28, ease: EASE }}
              className="absolute top-0.5 h-4 w-4 rounded-full bg-[#0A0A0A]"
              style={grounded ? { right: 2 } : { left: 2 }}
            />
          </span>
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {/* inputs */}
        <div className="space-y-4">
          <Panel label="Profile  the closed fact set">
            <div className="flex flex-wrap gap-1.5">
              {PROFILE_SKILLS.map((s) => (
                <Chip key={s} tone="neutral">
                  {s}
                </Chip>
              ))}
            </div>
          </Panel>

          <Panel label="Job description asks for">
            <div className="flex flex-wrap gap-1.5">
              {JD_WANTS.map((s) => (
                <Chip key={s} tone={fabricated(s) ? "missing" : "neutral"}>
                  {s}
                  {fabricated(s) && (
                    <span className="ml-1 opacity-60" aria-label="not in profile">
                      ✕
                    </span>
                  )}
                </Chip>
              ))}
            </div>
          </Panel>
        </div>

        {/* output */}
        <div className="space-y-4">
          <Panel
            label="Generated resume  skills line"
            tone={grounded ? "good" : "bad"}
            accent={accent}
          >
            <div className="flex flex-wrap gap-1.5">
              <AnimatePresence mode="popLayout" initial={false}>
                {output.map((s) => {
                  const bad = fabricated(s);
                  return (
                    <motion.span
                      key={s}
                      layout
                      initial={{ opacity: 0, scale: 0.82 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.82, filter: "blur(4px)" }}
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      <Chip tone={bad ? "fabricated" : "neutral"}>
                        {s}
                        {bad && <span className="ml-1">⚠</span>}
                      </Chip>
                    </motion.span>
                  );
                })}
              </AnimatePresence>
            </div>
            <p className="mt-3 font-mono text-[0.72rem] leading-relaxed text-white/45">
              {grounded
                ? "Reordered so the job's terms lead. Nothing added."
                : "Kotlin and Rust were never in the profile. They are here because the job asked for them."}
            </p>
          </Panel>

          <Panel label="Judge verdict">
            <ul className="space-y-2">
              {VERDICTS.map((v) => {
                const shown = grounded || !v.ok;
                return (
                  <motion.li
                    key={v.quote}
                    animate={{ opacity: shown ? 1 : 0.25 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-2.5 font-mono text-[0.73rem] leading-relaxed"
                  >
                    <span
                      aria-hidden
                      className="mt-px shrink-0"
                      style={{ color: v.ok ? accent : "#FF5A52" }}
                    >
                      {v.ok ? "✓" : "✕"}
                    </span>
                    <span className="text-white/70">
                      <span className="text-white">{v.quote}</span>  {v.note}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
            <p
              className="mt-3.5 border-t border-white/10 pt-3 font-mono text-[0.72rem]"
              style={{ color: grounded ? accent : "#FF5A52" }}
            >
              {grounded
                ? "2 violations caught → repaired → 0 remaining. Resume ships."
                : "No check runs. The fabrications ship with your name on them."}
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Panel({
  label,
  children,
  tone = "neutral",
  accent,
}: {
  label: string;
  children: React.ReactNode;
  tone?: "neutral" | "good" | "bad";
  accent?: string;
}) {
  const border =
    tone === "good"
      ? `${accent}55`
      : tone === "bad"
        ? "rgba(255,90,82,0.45)"
        : "rgba(255,255,255,0.10)";

  return (
    <div
      className="rounded-xl border bg-black/25 p-4 transition-colors duration-300"
      style={{ borderColor: border }}
    >
      <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/40">
        {label}
      </p>
      {children}
    </div>
  );
}

function Chip({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "neutral" | "missing" | "fabricated";
}) {
  const styles =
    tone === "fabricated"
      ? "border-[#FF5A52]/60 bg-[#FF5A52]/15 text-[#FF9A94]"
      : tone === "missing"
        ? "border-white/10 bg-transparent text-white/35 line-through"
        : "border-white/15 bg-white/[0.06] text-white/80";

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 font-mono text-[0.72rem] ${styles}`}
    >
      {children}
    </span>
  );
}
