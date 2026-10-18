"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { wedding } from "@/config/wedding";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { Reveal } from "@/components/invite/Reveal";

export function FamilyBlessing() {
  const reduce = useReducedMotion();
  const words = wedding.familyBlessing.split(/\s+/);

  return (
    <Reveal>
      <section className="px-5 py-7 sm:py-9" aria-labelledby="family-blessing-title">
        <div className="family-note interactive-card relative mx-auto max-w-[620px] overflow-hidden rounded-[1.8rem] border border-gold/35 px-6 py-9 shadow-[0_18px_48px_rgba(73,58,55,.09)] sm:px-12 sm:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(214,170,161,.16),transparent_62%)]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-[7px] rounded-[1.5rem] border border-gold/15" aria-hidden="true" />
          <FloralCorner className="pointer-events-none absolute -left-1 -top-1 h-20 w-20 opacity-40 sm:h-24 sm:w-24" position="tl" />
          <FloralCorner className="pointer-events-none absolute -right-1 -top-1 h-20 w-20 opacity-40 sm:h-24 sm:w-24" position="tr" />
          <FloralCorner className="pointer-events-none absolute -bottom-1 -left-1 h-20 w-20 opacity-30 sm:h-24 sm:w-24" position="bl" />
          <FloralCorner className="pointer-events-none absolute -bottom-1 -right-1 h-20 w-20 opacity-30 sm:h-24 sm:w-24" position="br" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.span
              initial={reduce ? false : { opacity: 0, scale: 0.5, rotate: -25 }}
              whileInView={reduce ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/35 bg-ivory/85 text-gold shadow-[0_7px_18px_rgba(178,138,89,.12)]"
              aria-hidden="true"
            >
              <Quote size={19} strokeWidth={1.5} />
            </motion.span>
            <p className="mt-4 text-[0.64rem] font-medium uppercase tracking-[0.28em] text-sage">A note from our families</p>
            <h2 id="family-blessing-title" className="mt-2 font-serif text-2xl text-olive sm:text-[1.75rem]">A blessing for our beginning</h2>
            <GoldDivider className="mx-auto mt-4 max-w-32" />
            <motion.p
              aria-label={wedding.familyBlessing}
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "visible"}
              viewport={{ once: true, amount: 0.65 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } } }}
              className="mx-auto mt-5 max-w-[32rem] font-note text-[1.42rem] leading-[1.35] text-olive/85 sm:text-[1.7rem] sm:leading-[1.42]"
            >
              {words.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  aria-hidden="true"
                  variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                  className="mr-[0.28em] inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 7 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 flex flex-col items-center"
            >
              <span className="h-px w-12 bg-gold/45" aria-hidden="true" />
              <p className="font-note mt-2 text-xl italic text-sage sm:text-2xl">{wedding.familySignoff}</p>
            </motion.div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
