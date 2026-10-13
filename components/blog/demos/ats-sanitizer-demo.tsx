"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { EASE } from "@/components/blog/motion-primitives";

/**
 * The actual rule table, ported to TypeScript. This is the whole of
 * `ats_sanitize()`  no model call, no retry, no failure mode.
 *
 * Written with \uXXXX escapes rather than literal glyphs on purpose: half of
 * these characters are invisible in an editor, and a stray one inside a
 * character class is a bug nobody can see.
 */
const RULES: { name: string; find: RegExp; replace: string }[] = [
  { name: "em-dash  → hyphen", find: new RegExp("\\u2014", "g"), replace: "-" },
  { name: "en-dash – → hyphen", find: /–/g, replace: "-" },
  {
    name: "curly double quotes → straight",
    find: /[“”]/g,
    replace: '"',
  },
  {
    name: "curly single quotes → straight",
    find: /[‘’]/g,
    replace: "'",
  },
  { name: "ellipsis … → three periods", find: /…/g, replace: "..." },
  {
    name: "non-breaking space → space",
    find: new RegExp("[\\u00A0\\u2007\\u2009\\u202F]", "g"),
    replace: " ",
  },
  {
    name: "zero-width chars → stripped",
    find: new RegExp("[\\u200B-\\u200D\\uFEFF]", "g"),
    replace: "",
  },
  { name: "LaTeX --- → hyphen", find: /---/g, replace: "-" },
];

const SAMPLE = [
  "Engineered a real‑time sync layer  cutting p95 latency by 35 %  across three services.",
  "“Ship it,” they said… so I did. Owner’s manual: docs/sync–v2.md --- see § 4.​",
].join("\n");

function sanitize(input: string) {
  let out = input;
  const hits: Record<string, number> = {};
  for (const rule of RULES) {
    const matches = input.match(rule.find);
    hits[rule.name] = matches ? matches.length : 0;
    out = out.replace(rule.find, rule.replace);
  }
  return { out, hits, total: Object.values(hits).reduce((a, b) => a + b, 0) };
}

export function AtsSanitizerDemo({ accent }: { accent: string }) {
  const [input, setInput] = useState(SAMPLE);
  const { out, hits, total } = useMemo(() => sanitize(input), [input]);

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-departure text-[0.68rem] uppercase tracking-[0.22em] opacity-50">
            ats_sanitize()
          </p>
          <p className="mt-1.5 text-sm text-white/70">
            Type anything. It runs on every keystroke, exactly as it runs on
            every generated resume.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setInput(SAMPLE)}
          className="rounded-full border border-white/20 px-4 py-2 font-departure text-[0.66rem] uppercase tracking-[0.16em] text-white/60 transition-colors hover:border-white/40 hover:text-white"
        >
          Reset sample
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div>
          <label
            htmlFor="ats-input"
            className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/40"
          >
            in  what the generator produced
          </label>
          <textarea
            id="ats-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            spellCheck={false}
            className="min-h-[11.5rem] w-full resize-y rounded-xl border border-white/12 bg-black/35 p-4 font-mono text-[0.8rem] leading-relaxed text-white/85 outline-none transition-colors focus:border-white/35"
          />
        </div>

        <div>
          <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/40">
            out  what the ATS receives
          </p>
          <pre
            className="min-h-[11.5rem] w-full overflow-x-auto whitespace-pre-wrap rounded-xl border p-4 font-mono text-[0.8rem] leading-relaxed text-white/85 transition-colors"
            style={{
              borderColor: total > 0 ? `${accent}55` : "rgba(255,255,255,0.12)",
              backgroundColor: "rgba(0,0,0,0.35)",
            }}
          >
            {out}
          </pre>
        </div>
      </div>

      {/* rule table */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/40">
            rule table
          </p>
          <motion.p
            key={total}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="font-mono text-[0.72rem]"
            style={{ color: total > 0 ? accent : "rgba(255,255,255,0.35)" }}
          >
            {total} substitution{total === 1 ? "" : "s"}
          </motion.p>
        </div>

        <ul className="grid gap-1.5 sm:grid-cols-2">
          {RULES.map((rule) => {
            const n = hits[rule.name] ?? 0;
            const active = n > 0;
            return (
              <li
                key={rule.name}
                className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-colors duration-300"
                style={{
                  borderColor: active ? `${accent}44` : "rgba(255,255,255,0.08)",
                  backgroundColor: active ? `${accent}0D` : "transparent",
                }}
              >
                <span
                  className="font-mono text-[0.72rem] transition-opacity"
                  style={{ opacity: active ? 0.95 : 0.4 }}
                >
                  {rule.name}
                </span>
                <span
                  className="font-mono text-[0.72rem] tabular-nums"
                  style={{ color: active ? accent : "rgba(255,255,255,0.25)" }}
                >
                  ×{n}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-4 font-mono text-[0.72rem] leading-relaxed text-white/40">
        No model call. No retry. No failure mode. The phrase-level tells
        “leveraged”, “spearheaded”  are deliberately{" "}
        <span className="text-white/70">not</span> in this table; a blind
        find-replace over resume prose mangles real content.
      </p>
    </div>
  );
}
