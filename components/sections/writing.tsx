"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { SpotlightCard } from "@/components/blog/motion-primitives";
import { DualLaunch } from "@/components/shared/dual-launch";
import { postPath, sortedPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

const ease = [0.65, 0.01, 0.05, 0.99] as const;

export function Writing() {
  const { background, textColor, muted, accent, eyebrow, headline, intro } =
    siteConfig.writing;
  const reduce = useReducedMotion();
  const posts = sortedPosts();

  return (
    <section
      id="writing"
      className="relative w-full overflow-hidden px-6 py-[16vh] md:px-12"
      style={{ backgroundColor: background, color: textColor }}
    >
      {/* faint grid, matching the blog's own backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 55% at 50% 0%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 55% at 50% 0%, #000 30%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px]">
        {/* eyebrow */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
          transition={{ duration: 0.7, ease }}
          className="flex items-center gap-4"
        >
          <span className="font-departure text-xs uppercase tracking-[0.3em] opacity-60">
            {eyebrow} - 05
          </span>
          <span
            className="h-px flex-1"
            style={{ backgroundColor: textColor, opacity: 0.25 }}
          />
        </motion.div>

        {/* headline */}
        <h2
          className="mt-10 font-departure font-black uppercase leading-[0.92] tracking-tight"
          style={{ fontSize: "clamp(2.6rem, 8vw, 6rem)" }}
        >
          {headline.map((line, i) => (
            <motion.span
              key={line}
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, y: 60, filter: "blur(8px)" }
              }
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.05, margin: "0px 0px 200px 0px" }}
              transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.14 }}
              className="block"
              style={i === headline.length - 1 ? { color: accent } : undefined}
            >
              {line}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease, delay: 0.25 }}
          className="mt-8 max-w-[46rem] text-base leading-relaxed md:text-lg"
          style={{ color: muted }}
        >
          {intro}
        </motion.p>

        {/* posts */}
        <div className="mt-14 space-y-5">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, ease, delay: i * 0.1 }}
            >
              <SpotlightCard
                className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 sm:p-9"
                color={`${post.theme.accent}12`}
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
                  <span style={{ color: post.theme.accent }}>
                    {post.project.name}
                  </span>
                </div>

                <h3 className="mt-4">
                  <Link
                    href={postPath(post.slug)}
                    className="font-departure text-2xl font-black uppercase leading-[1.05] tracking-tight transition-colors sm:text-4xl"
                    style={{ color: textColor }}
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="mt-4 max-w-[48rem] text-[0.98rem] leading-[1.7] text-white/60">
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

                {/* The dual launcher: the write-up and the live app, one click. */}
                <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-5">
                  <DualLaunch
                    blogHref={postPath(post.slug)}
                    projectHref={post.project.url}
                    projectLabel={post.project.displayUrl}
                    accent={post.theme.accent}
                  >
                    {siteConfig.writing.cta} + open the app
                  </DualLaunch>

                  <Link
                    href={postPath(post.slug)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-departure text-[0.7rem] uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-white/60 hover:text-white"
                  >
                    Just the post →
                  </Link>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
          className="mt-10"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
            style={{ color: accent }}
          >
            All writing →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
