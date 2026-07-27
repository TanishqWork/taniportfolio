"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BlockRenderer } from "@/components/blog/blocks";
import { Toc } from "@/components/blog/toc";
import {
  DecryptedText,
  EASE,
  Magnetic,
  Marquee,
  ReadingProgress,
  Reveal,
  SpotlightCard,
} from "@/components/blog/motion-primitives";
import { postPath, type Post } from "@/lib/blog";

export function PostArticle({ post }: { post: Post }) {
  const { accent, danger, background } = post.theme;
  const reduce = useReducedMotion();

  return (
    <div style={{ backgroundColor: background, color: post.theme.ink }}>
      <ReadingProgress color={accent} />

      <Hero post={post} reduce={Boolean(reduce)} />

      {/* AEO answer box — the part an answer engine lifts verbatim. */}
      <section
        className="border-y border-white/10 px-6 py-14 md:px-12"
        aria-labelledby="takeaways-heading"
      >
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <h2
              id="takeaways-heading"
              className="font-departure text-[0.7rem] uppercase tracking-[0.3em]"
              style={{ color: accent }}
            >
              Key takeaways
            </h2>
          </Reveal>
          <ul className="mt-6 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {post.takeaways.map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
                className="flex gap-3 text-[0.95rem] leading-[1.7] text-white/70"
              >
                <span
                  aria-hidden
                  className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                {t}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Body */}
      <div className="px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <Toc sections={post.sections} accent={accent} />

          <article className="min-w-0 max-w-[46rem]">
            {post.sections.map((section) => {
              const sectionAccent = section.accent ?? accent;
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 pb-16"
                >
                  <Reveal>
                    <div className="mb-3 flex items-center gap-4">
                      <span
                        className="font-departure text-[0.72rem] tabular-nums tracking-[0.2em]"
                        style={{ color: sectionAccent }}
                      >
                        {section.num}
                      </span>
                      <span
                        className="h-px flex-1"
                        style={{ backgroundColor: `${sectionAccent}44` }}
                      />
                    </div>
                    <h2
                      className="font-departure font-black uppercase leading-[1.02] tracking-tight"
                      style={{
                        fontSize: "clamp(1.7rem, 4.4vw, 2.9rem)",
                        color: "#FFFFFF",
                      }}
                    >
                      {section.title}
                    </h2>
                    {section.kicker && (
                      <p
                        className="mt-3 font-mono text-[0.82rem] leading-relaxed"
                        style={{ color: sectionAccent, opacity: 0.85 }}
                      >
                        {section.kicker}
                      </p>
                    )}
                  </Reveal>

                  <div className="mt-7">
                    {section.blocks.map((block, i) => (
                      <BlockRenderer
                        key={`${section.id}-${i}`}
                        block={block}
                        accent={sectionAccent}
                        post={post}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            <Faq post={post} />
          </article>
        </div>
      </div>

      <Outro post={post} danger={danger} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

function Hero({ post, reduce }: { post: Post; reduce: boolean }) {
  const { accent } = post.theme;

  return (
    <header className="relative overflow-hidden px-6 pb-16 pt-32 md:px-12 md:pt-40">
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
          }}
        />
        <motion.div
          className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle, ${accent}22, transparent 68%)`,
            filter: "blur(60px)",
          }}
          animate={reduce ? undefined : { opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto max-w-[1180px]">
        <Reveal>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white"
          >
            ← Writing
          </Link>
        </Reveal>

        <p
          className="mt-8 font-departure text-[0.72rem] uppercase tracking-[0.3em]"
          style={{ color: accent }}
        >
          <DecryptedText text={`${post.tags[0]} · ${post.readingMinutes} min read`} />
        </p>

        <h1
          className="mt-5 max-w-[16ch] font-departure font-black uppercase leading-[0.94] tracking-tight text-white"
          style={{ fontSize: "clamp(2.6rem, 8.5vw, 6.2rem)" }}
        >
          {post.headline.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={
                  reduce ? { opacity: 0 } : { y: "110%", opacity: 0, rotate: 2 }
                }
                animate={{ y: "0%", opacity: 1, rotate: 0 }}
                transition={{ duration: 0.95, ease: EASE, delay: 0.15 + i * 0.13 }}
                style={i === post.headline.length - 1 ? { color: accent } : undefined}
              >
                {line}
                {/* The lines are block-level, so this space is invisible — but
                    without it, textContent runs the words together
                    ("resumebuilder islying") for crawlers and copy-paste. */}
                {i < post.headline.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
          className="mt-8 max-w-[52rem] text-[1.05rem] leading-[1.75] text-white/65 sm:text-[1.15rem]"
        >
          {post.deck}
        </motion.p>

        {/* meta + actions */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
        >
          <Magnetic strength={0.16}>
            <a
              href={post.project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 font-departure text-[0.72rem] uppercase tracking-[0.16em] transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: accent, color: "#0A0A0A" }}
            >
              Open {post.project.name} ↗
            </a>
          </Magnetic>

          <a
            href={post.project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-departure text-[0.72rem] uppercase tracking-[0.16em] text-white/75 transition-colors hover:border-white/60 hover:text-white"
          >
            Source ↗
          </a>

          <ShareRow post={post} accent={accent} />
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 font-mono text-[0.72rem] text-white/40"
        >
          <div className="flex gap-2">
            <dt className="uppercase tracking-[0.16em]">Published</dt>
            <dd className="text-white/70">
              <time dateTime={post.published}>
                {new Date(post.published).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="uppercase tracking-[0.16em]">Author</dt>
            <dd className="text-white/70">Tanishq Bhosale</dd>
          </div>
          <div className="flex gap-2">
            <dt className="uppercase tracking-[0.16em]">Project</dt>
            <dd className="text-white/70">{post.project.displayUrl}</dd>
          </div>
        </motion.dl>
      </div>

      <div className="relative mt-12 border-y border-white/10 py-3">
        <Marquee
          items={post.tags}
          className="font-departure text-[0.7rem] uppercase tracking-[0.24em] text-white/30"
        />
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Share                                                                      */
/* -------------------------------------------------------------------------- */

function ShareRow({ post, accent }: { post: Post; accent: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard permission denied — the URL bar still works.
    }
  };

  const share = (href: string) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/40 transition-colors hover:text-white"
    >
      {href.includes("linkedin") ? "LinkedIn" : "X"}
    </a>
  );

  const url = `https://thetan.in${postPath(post.slug)}`;

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={copy}
        className="relative font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/40 transition-colors hover:text-white"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "y" : "n"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="block"
            style={copied ? { color: accent } : undefined}
          >
            {copied ? "Link copied ✓" : "Copy link"}
          </motion.span>
        </AnimatePresence>
      </button>

      {share(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`,
      )}
      {share(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      )}

      <a
        href={`${postPath(post.slug)}.md`}
        className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/40 transition-colors hover:text-white"
        title="The same post as clean Markdown, for LLMs and note-takers"
      >
        .md
      </a>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                        */
/* -------------------------------------------------------------------------- */

function Faq({ post }: { post: Post }) {
  const [open, setOpen] = useState<number | null>(0);
  const accent = post.theme.accent;

  return (
    <section id="faq" className="scroll-mt-28 border-t border-white/10 pt-14">
      <Reveal>
        <h2
          className="font-departure font-black uppercase leading-none tracking-tight text-white"
          style={{ fontSize: "clamp(1.7rem, 4.4vw, 2.9rem)" }}
        >
          Frequently asked
        </h2>
      </Reveal>

      <div className="mt-8">
        {post.faq.map((item, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={item.q} delay={i * 0.04}>
              <div className="border-t border-white/12 last:border-b">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-6 py-5 text-left"
                >
                  <span className="text-[1rem] font-medium leading-snug text-white sm:text-[1.08rem]">
                    {item.q}
                  </span>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="mt-0.5 shrink-0 font-departure text-2xl leading-none"
                    style={{ color: accent }}
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[46rem] pb-6 text-[0.98rem] leading-[1.75] text-white/65">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Outro                                                                      */
/* -------------------------------------------------------------------------- */

function Outro({ post, danger }: { post: Post; danger: string }) {
  const accent = post.theme.accent;

  return (
    <section className="border-t border-white/10 px-6 py-20 md:px-12">
      <div className="mx-auto max-w-[1180px]">
        <SpotlightCard
          className="rounded-2xl border border-white/12 p-8 sm:p-12"
          color={`${accent}14`}
        >
          <p
            className="font-departure text-[0.7rem] uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            Try it
          </p>
          <h2
            className="mt-5 max-w-[18ch] font-departure font-black uppercase leading-[0.98] tracking-tight text-white"
            style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
          >
            One profile.
            <span style={{ color: accent }}> Any job.</span>
          </h2>
          <p className="mt-5 max-w-[46rem] text-[1rem] leading-[1.75] text-white/60">
            {post.project.tagline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic strength={0.16}>
              <a
                href={post.project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full px-7 py-4 font-departure text-[0.74rem] uppercase tracking-[0.16em]"
                style={{ backgroundColor: accent, color: "#0A0A0A" }}
              >
                Open {post.project.displayUrl} ↗
              </a>
            </Magnetic>
            <a
              href={post.project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 font-departure text-[0.74rem] uppercase tracking-[0.16em] text-white/75 transition-colors hover:border-white/60 hover:text-white"
            >
              Read the source ↗
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/10 pt-6 font-mono text-[0.72rem] text-white/40">
            <span>
              Free · no signup · one generation per IP
            </span>
            <span style={{ color: danger }}>
              Never invents a fact about you
            </span>
          </div>
        </SpotlightCard>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[0.74rem] text-white/40">
          <Link
            href="/blog"
            className="transition-colors hover:text-white"
          >
            ← All writing
          </Link>
          <Link href="/" className="transition-colors hover:text-white">
            Tanishq Bhosale — portfolio →
          </Link>
        </div>
      </div>
    </section>
  );
}
