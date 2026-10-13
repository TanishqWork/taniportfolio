"use client";

import { motion } from "motion/react";
import {
  CountUp,
  Reveal,
  ScrollRevealText,
  SpotlightCard,
} from "@/components/blog/motion-primitives";
import { CodeBlock } from "@/components/blog/code-block";
import { RichText } from "@/components/blog/rich-text";
import { AtsSanitizerDemo } from "@/components/blog/demos/ats-sanitizer-demo";
import { FabricationDemo } from "@/components/blog/demos/fabrication-demo";
import { FitScoreDemo } from "@/components/blog/demos/fit-score-demo";
import { LiveAppDemo } from "@/components/blog/demos/live-app-demo";
import { RepairLoopDemo } from "@/components/blog/demos/repair-loop-demo";
import type { Block, DemoName, Post } from "@/lib/blog";

const CALLOUT_TONE = {
  warn: { color: "#FFA23A", glyph: "!" },
  good: { color: "#E4FE52", glyph: "✓" },
  info: { color: "#8B7BFF", glyph: "i" },
} as const;

export function BlockRenderer({
  block,
  accent,
  post,
}: {
  block: Block;
  accent: string;
  post: Post;
}) {
  switch (block.type) {
    case "lead":
      return (
        <Reveal className="my-6">
          <p className="text-[1.12rem] leading-[1.75] text-white/85 sm:text-[1.22rem] sm:leading-[1.72]">
            <RichText text={block.text} accent={accent} />
          </p>
        </Reveal>
      );

    case "p":
      return (
        <Reveal className="my-5" y={20} blur={5}>
          <p className="text-[1rem] leading-[1.8] text-white/70 sm:text-[1.06rem]">
            <RichText text={block.text} accent={accent} />
          </p>
        </Reveal>
      );

    case "h3":
      return (
        <Reveal className="mb-4 mt-11">
          <h3
            className="font-departure text-lg font-bold uppercase tracking-tight sm:text-xl"
            style={{ color: accent }}
          >
            {block.text}
          </h3>
        </Reveal>
      );

    case "download":
      return (
        <Reveal className="my-8">
          <a
            href={block.href}
            download={block.fileName}
            className="inline-flex min-h-12 items-center justify-center rounded-full px-7 py-4 font-departure text-xs uppercase tracking-[0.14em] transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: accent, color: "#0A0A0A" }}
          >
            {block.label} ↓
          </a>
        </Reveal>
      );

    case "quote":
      return (
        <div className="my-12">
          <div
            className="border-l-2 pl-5 sm:pl-7"
            style={{ borderColor: accent }}
          >
            <ScrollRevealText
              text={block.text}
              className="font-departure text-xl font-bold uppercase leading-[1.25] tracking-tight text-white sm:text-3xl"
            />
            {block.cite && (
              <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-white/40">
                {block.cite}
              </p>
            )}
          </div>
        </div>
      );

    case "code":
      return (
        <CodeBlock
          code={block.code}
          lang={block.lang}
          caption={block.caption}
          accent={accent}
        />
      );

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Reveal className="my-6">
          <Tag className="space-y-3">
            {block.items.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="flex gap-3.5 text-[1rem] leading-[1.75] text-white/70"
              >
                <span
                  aria-hidden
                  className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full font-mono"
                  style={{ backgroundColor: accent }}
                />
                <span>
                  {block.ordered && (
                    <span
                      className="mr-2 font-mono text-[0.85em]"
                      style={{ color: accent }}
                    >
                      {i + 1}.
                    </span>
                  )}
                  <RichText text={item} accent={accent} />
                </span>
              </motion.li>
            ))}
          </Tag>
        </Reveal>
      );
    }

    case "table":
      return (
        <Reveal className="my-9">
          {/* Wide screens: a real table. */}
          <div className="hidden overflow-x-auto rounded-xl border border-white/12 md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/12 bg-white/[0.04]">
                  {block.head.map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white/50"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="border-b border-white/8 last:border-0"
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`px-4 py-3.5 align-top text-[0.9rem] leading-relaxed ${
                          j === 0 ? "text-white/90" : "text-white/60"
                        }`}
                      >
                        <RichText text={cell} accent={accent} />
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Narrow screens: stacked cards, because a 3-column table of prose
              is unreadable in a horizontal scroller. */}
          <div className="space-y-3 md:hidden">
            {block.rows.map((row, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/12 bg-white/[0.03] p-4"
              >
                <p className="mb-3 font-departure text-sm uppercase tracking-tight text-white">
                  <RichText text={row[0]} accent={accent} />
                </p>
                <dl className="space-y-2.5">
                  {row.slice(1).map((cell, j) => (
                    <div key={j}>
                      <dt className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/40">
                        {block.head[j + 1]}
                      </dt>
                      <dd className="mt-1 text-[0.88rem] leading-relaxed text-white/65">
                        <RichText text={cell} accent={accent} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          {block.caption && (
            <p className="mt-2.5 font-mono text-[0.72rem] text-white/40">
              {block.caption}
            </p>
          )}
        </Reveal>
      );

    case "callout": {
      const tone = CALLOUT_TONE[block.tone];
      return (
        <Reveal className="my-9">
          <SpotlightCard
            className="rounded-xl border-l-2 bg-white/[0.03] p-5 sm:p-6"
            color={`${tone.color}18`}
            style={{ borderLeftColor: tone.color }}
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[0.75rem] font-bold"
                style={{ backgroundColor: `${tone.color}22`, color: tone.color }}
              >
                {tone.glyph}
              </span>
              <div>
                <p
                  className="font-departure text-sm uppercase tracking-[0.08em]"
                  style={{ color: tone.color }}
                >
                  {block.title}
                </p>
                <p className="mt-2 text-[0.95rem] leading-[1.7] text-white/70">
                  <RichText text={block.text} accent={accent} />
                </p>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      );
    }

    case "stats":
      return (
        <Reveal className="my-9">
          <div className="grid gap-3 sm:grid-cols-3">
            {block.items.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="rounded-xl border border-white/12 bg-white/[0.03] p-5"
              >
                <p
                  className="font-departure text-3xl font-black tracking-tight sm:text-4xl"
                  style={{ color: accent }}
                >
                  <CountUp
                    value={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                  />
                </p>
                <p className="mt-2 text-[0.82rem] leading-snug text-white/55">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </Reveal>
      );

    case "demo":
      return (
        <Reveal className="my-11" y={34}>
          <div className="mb-3 flex items-center gap-3">
            <span
              className="font-mono text-[0.62rem] uppercase tracking-[0.2em]"
              style={{ color: accent }}
            >
              Interactive
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="font-mono text-[0.7rem] text-white/40">
              {block.title}
            </span>
          </div>
          <Demo name={block.name} accent={accent} post={post} />
        </Reveal>
      );
  }
}

function Demo({
  name,
  accent,
  post,
}: {
  name: DemoName;
  accent: string;
  post: Post;
}) {
  switch (name) {
    case "fabrication":
      return <FabricationDemo accent={accent} />;
    case "fit-score":
      return <FitScoreDemo accent={accent} />;
    case "repair-loop":
      return <RepairLoopDemo accent={accent} />;
    case "ats-sanitizer":
      return <AtsSanitizerDemo accent={accent} />;
    case "live-app":
      return (
        <LiveAppDemo
          url={post.project.url}
          displayUrl={post.project.displayUrl}
          repo={post.project.repo}
          accent={accent}
        />
      );
    default:
      return null;
  }
}
