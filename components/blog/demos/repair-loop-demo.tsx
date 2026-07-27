"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/components/blog/motion-primitives";

const MAX_CALLS = 6;

const NODES = [
  { id: "generate", label: "Generate" },
  { id: "compile", label: "Does it compile?" },
  { id: "pages", label: "Is it one page?" },
  { id: "facts", label: "Any fabrication?" },
  { id: "ship", label: "Terminal" },
] as const;

type NodeId = (typeof NODES)[number]["id"];
type Status = "run" | "pass" | "fail" | "recheck" | "ship";

const TRACE: {
  node: NodeId;
  status: Status;
  title: string;
  detail: string;
  calls: number;
}[] = [
  {
    node: "generate",
    status: "run",
    title: "Generate",
    detail:
      "gpt-5 writes a complete one-page LaTeX resume from the profile and the job description.",
    calls: 1,
  },
  {
    node: "compile",
    status: "pass",
    title: "Does it compile?",
    detail: "pdflatex exits 0 inside the 20s timeout. A PDF exists.",
    calls: 1,
  },
  {
    node: "pages",
    status: "fail",
    title: "Is it one page?",
    detail:
      "pypdf reports 2 pages. Repair strategy → edit mode: a small find/replace list that condenses, dropping the lowest-JD-relevance content first. The document is fine, it is just long.",
    calls: 2,
  },
  {
    node: "pages",
    status: "recheck",
    title: "Re-sanitize → recompile → re-check",
    detail:
      "Every check runs again, not just the one that failed. Condensing a bullet changes the line breaks, which changes the page count.",
    calls: 2,
  },
  {
    node: "pages",
    status: "pass",
    title: "Is it one page?",
    detail: "1 page.",
    calls: 2,
  },
  {
    node: "facts",
    status: "fail",
    title: "Any fabrication?",
    detail:
      "The judge quotes the offending string verbatim: “Kotlin”. It appears nowhere in the profile. Repair strategy → edit mode: surgical removal. The other 95% of the document is correct.",
    calls: 3,
  },
  {
    node: "facts",
    status: "recheck",
    title: "Re-sanitize → recompile → re-check",
    detail:
      "Removing a claim can push the document back under one page — or shift a line and push it over. The checks are not independent.",
    calls: 3,
  },
  {
    node: "facts",
    status: "pass",
    title: "Any fabrication?",
    detail: "0 violations against the full profile JSON.",
    calls: 3,
  },
  {
    node: "ship",
    status: "ship",
    title: "Ship",
    detail:
      "PDF returned. 3 of 6 model calls used. If the cap had been reached instead: refuse on compile, refuse on fabrication, ship-with-warning on page count.",
    calls: 3,
  },
];

const STATUS_COLOR: Record<Status, string> = {
  run: "#8B7BFF",
  pass: "#E4FE52",
  fail: "#FF5A52",
  recheck: "#FFA23A",
  ship: "#E4FE52",
};

const STATUS_LABEL: Record<Status, string> = {
  run: "running",
  pass: "pass",
  fail: "fail → repair",
  recheck: "re-check",
  ship: "shipped",
};

export function RepairLoopDemo({ accent }: { accent: string }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const current = TRACE[step];
  const atEnd = step === TRACE.length - 1;

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, TRACE.length - 1));
  }, []);

  // Reaching the end simply stops scheduling the next tick. Flipping `playing`
  // back to false from inside the effect would be a cascading render for no
  // behavioural gain — the button already reads `atEnd` to show "Replay".
  useEffect(() => {
    if (!playing || atEnd) return;
    const id = setTimeout(next, 1900);
    return () => clearTimeout(id);
  }, [playing, atEnd, step, next]);

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-departure text-[0.68rem] uppercase tracking-[0.22em] opacity-50">
            generation_service.py
          </p>
          <p className="mt-1.5 text-sm text-white/70">
            One real trace: a page overflow and a fabrication, both repaired.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (atEnd) {
                setStep(0);
                setPlaying(true);
              } else setPlaying((p) => !p);
            }}
            className="rounded-full px-4 py-2 font-departure text-[0.68rem] uppercase tracking-[0.16em]"
            style={{ backgroundColor: accent, color: "#0A0A0A" }}
          >
            {atEnd ? "Replay" : playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              next();
            }}
            disabled={atEnd}
            className="rounded-full border border-white/20 px-4 py-2 font-departure text-[0.68rem] uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-white/40 hover:text-white disabled:opacity-30"
          >
            Step
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setStep(0);
            }}
            className="rounded-full border border-white/20 px-4 py-2 font-departure text-[0.68rem] uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,230px)_1fr]">
        {/* flow */}
        <ol className="space-y-1.5">
          {NODES.map((node) => {
            const isActive = current.node === node.id;
            const isPast =
              NODES.findIndex((n) => n.id === node.id) <
              NODES.findIndex((n) => n.id === current.node);
            return (
              <li key={node.id} className="relative">
                <div
                  className="flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors duration-300"
                  style={{
                    borderColor: isActive
                      ? STATUS_COLOR[current.status]
                      : "rgba(255,255,255,0.10)",
                    backgroundColor: isActive
                      ? `${STATUS_COLOR[current.status]}12`
                      : "transparent",
                  }}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full transition-colors"
                    style={{
                      backgroundColor: isActive
                        ? STATUS_COLOR[current.status]
                        : isPast
                          ? `${accent}66`
                          : "rgba(255,255,255,0.2)",
                    }}
                  />
                  <span
                    className="font-mono text-[0.76rem] transition-opacity"
                    style={{ opacity: isActive ? 1 : isPast ? 0.6 : 0.35 }}
                  >
                    {node.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        {/* detail */}
        <div className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-black/25 p-4 sm:p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="rounded px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em]"
                  style={{
                    backgroundColor: `${STATUS_COLOR[current.status]}22`,
                    color: STATUS_COLOR[current.status],
                  }}
                >
                  {STATUS_LABEL[current.status]}
                </span>
                <span className="font-mono text-[0.65rem] text-white/35">
                  step {step + 1} / {TRACE.length}
                </span>
              </div>

              <p className="mt-3 font-departure text-lg uppercase tracking-tight text-white">
                {current.title}
              </p>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-white/65">
                {current.detail}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* model call budget */}
          <div>
            <div className="mb-2 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.16em] text-white/40">
              <span>model calls</span>
              <span>
                {current.calls} / {MAX_CALLS}
              </span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: MAX_CALLS }, (_, i) => (
                <motion.span
                  key={i}
                  className="h-1.5 flex-1 rounded-full"
                  animate={{
                    backgroundColor:
                      i < current.calls ? accent : "rgba(255,255,255,0.10)",
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
            <p className="mt-2 font-mono text-[0.68rem] text-white/35">
              max_total_model_calls = {MAX_CALLS}, plus a hard outer-loop bound so
              it provably terminates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
