import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Crafty } from "@/components/sections/crafty";
import { Directors } from "@/components/sections/directors";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Writing } from "@/components/sections/writing";
import { faqJsonLd, profilePageJsonLd } from "@/lib/seo";

export default function Home() {
  // ProfilePage and the site FAQ describe *this* page specifically, so they
  // live here rather than in the root layout  otherwise every blog post would
  // also claim to be a profile page and carry a second, unrelated FAQPage.
  const jsonLd = [profilePageJsonLd(), faqJsonLd()];

  return (
    <>
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
      <Hero />
      <Crafty />
      <Directors />
      <About />
      <Experience />
      <Education />
      <Writing />
      <Faq />
      <Contact />
    </>
  );
}
