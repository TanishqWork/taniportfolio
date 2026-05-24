import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Crafty } from "@/components/sections/crafty";
import { Directors } from "@/components/sections/directors";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <>
      <Hero />
      <Crafty />
      <Directors />
      <About />
      <Experience />
      <Education />
      <Faq />
      <Contact />
    </>
  );
}
