"use client";

import SplitText from "@/components/shared/split-text";
import { siteConfig } from "@/lib/site-config";

export function Hero() {
  const { wordmark, background, wordmarkColor } = siteConfig.hero;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: background }}
    >
      {/* Real, keyword-rich heading for search engines & screen readers.
          The animated wordmark below is decorative branding. */}
      <h1 className="sr-only">
        Tanishq Bhosale - Full Stack &amp; AI Engineer in Bangalore building
        production LLM and agentic AI systems with LangGraph and FastAPI.
      </h1>
      <SplitText
        text={wordmark}
        tag="p"
        splitType="chars"
        delay={80}
        duration={0.9}
        ease="power3.out"
        from={{ opacity: 0, y: 80 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
        loop
        loopDelay={1.5}
        yoyo
        className="select-none font-departure tracking-tight"
        style={{
          color: wordmarkColor,
          fontSize: "clamp(4rem, 18vw, 22rem)",
          lineHeight: 1,
        }}
      />
    </section>
  );
}
