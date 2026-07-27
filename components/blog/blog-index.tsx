"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  DecryptedText,
  EASE,
  Magnetic,
  Reveal,
  SpotlightCard,
} from "@/components/blog/motion-primitives";
import { DualLaunch } from "@/components/shared/dual-launch";
import { postPath, type Post } from "@/lib/blog";

export function BlogIndex({ posts }: { posts: Post[] }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* header */}
      <header className="relative overflow-hidden px-6 pb-14 pt-32 md:px-12 md:pt-40">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage:
                "radial-gradient(ellipse 70% 60% at 30% 0%, #000 40%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 30% 0%, #000 40%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-[1180px]">
          <Reveal>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white"
            >
              ← Portfolio
            </Link>
          </Reveal>

          <p className="mt-8 font-departure text-[0.72rem] uppercase tracking-[0.3em] text-[#E4FE52]">
            <DecryptedText text="Writing — build logs, not thought leadership" />
          </p>

          <h1
            className="mt-5 max-w-[14ch] font-departure font-black uppercase leading-[0.94] tracking-tight"
            style={{ fontSize: "clamp(2.8rem, 9vw, 6.5rem)" }}
          >
            {["Notes from", "shipping"].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.12 }}
                >
                  {line}{" "}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <motion.span
                className="block text-[#E4FE52]"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.34 }}
              >
                LLMs to prod.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
            className="mt-8 max-w-[46rem] text-[1.02rem] leading-[1.75] text-white/60 sm:text-[1.1rem]"
          >
            Long-form engineering write-ups on the parts that are actually hard:
            grounding a model against a fixed fact set, designing loops that
            provably terminate, deciding what a system should do when it runs out
            of retries, and keeping the whole thing alive on a box you own.
          </motion.p>
        </div>
      </header>

      {/* posts */}
      <main className="px-6 pb-24 md:px-12">
        <div className="mx-auto max-w-[1180px] space-y-6">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}

          <Reveal delay={0.15}>
            <div className="rounded-2xl border border-dashed border-white/12 px-8 py-12 text-center">
              <p className="font-departure text-sm uppercase tracking-[0.2em] text-white/35">
                More in progress
              </p>
              <p className="mx-auto mt-3 max-w-md text-[0.92rem] leading-relaxed text-white/45">
                Next up: building the eval set that turns the 70% gate from a
                considered guess into a measured decision boundary.
              </p>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const accent = post.theme.accent;

  return (
    <Reveal delay={index * 0.08}>
      <SpotlightCard
        className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 sm:p-9"
        color={`${accent}12`}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white/35">
          <time dateTime={post.published}>
            {new Date(post.published).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
          <span aria-hidden>·</span>
          <span style={{ color: accent }}>{post.project.name}</span>
        </div>

        <h2 className="mt-4">
          <Link
            href={postPath(post.slug)}
            className="font-departure text-2xl font-black uppercase leading-[1.05] tracking-tight transition-colors hover:text-[#E4FE52] sm:text-4xl"
          >
            {post.title}
          </Link>
        </h2>

        <p className="mt-4 max-w-[52rem] text-[0.98rem] leading-[1.7] text-white/60">
          {post.deck}
        </p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-white/12 bg-white/[0.04] px-2.5 py-1 font-mono text-[0.68rem] text-white/50"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-5">
          <DualLaunch
            blogHref={postPath(post.slug)}
            projectHref={post.project.url}
            projectLabel={post.project.displayUrl}
            accent={accent}
          >
            Read it + open the app
          </DualLaunch>

          <Magnetic strength={0.14}>
            <Link
              href={postPath(post.slug)}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-departure text-[0.7rem] uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-white/60 hover:text-white"
            >
              Just the post →
            </Link>
          </Magnetic>
        </div>
      </SpotlightCard>
    </Reveal>
  );
}
