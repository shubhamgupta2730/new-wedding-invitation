"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { wedding } from "@/config/wedding";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { Reveal } from "@/components/invite/Reveal";

export function WelcomeMessage() {
  const reduce = useReducedMotion();
  const words = wedding.invitationMessage.split(/\s+/);

  return (
    <Reveal>
      <section className="relative px-5 py-12 sm:py-14">
        <div className="welcome-letter interactive-card relative mx-auto max-w-[650px] overflow-hidden rounded-[2rem] border border-gold/30 bg-ivory/85 px-6 py-10 text-center shadow-[0_18px_48px_rgba(73,58,55,.08)] sm:px-12 sm:py-12">
          <div className="pointer-events-none absolute inset-[7px] rounded-[1.65rem] border border-gold/15" aria-hidden="true" />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent"
            initial={reduce ? false : { x: "-40%", opacity: 0 }}
            whileInView={reduce ? undefined : { x: "430%", opacity: [0, 0.7, 0] }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.7, delay: 0.25, ease: "easeInOut" }}
          />
          <FloralCorner className="pointer-events-none absolute -left-1 -top-1 h-20 w-20 opacity-60 sm:h-24 sm:w-24" position="tl" />
          <FloralCorner className="pointer-events-none absolute -right-1 -top-1 h-20 w-20 opacity-60 sm:h-24 sm:w-24" position="tr" />

          <div className="relative z-10 flex flex-col items-center">
            <motion.span
              initial={reduce ? false : { opacity: 0, scale: 0.65, rotate: -18 }}
              whileInView={reduce ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/35 bg-white/70 text-gold shadow-[0_5px_16px_rgba(178,138,89,.12)]"
              aria-hidden="true"
            >
              <Heart size={17} strokeWidth={1.5} />
            </motion.span>
            <p className="mt-4 text-[0.66rem] font-medium uppercase tracking-[0.28em] text-sage">A joyful invitation</p>
            <GoldDivider className="mx-auto mt-4 max-w-32" />
            <motion.p
              aria-label={wedding.invitationMessage}
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "visible"}
              viewport={{ once: true, amount: 0.7 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.035, delayChildren: 0.12 } } }}
              className="mt-6 max-w-[34rem] font-serif text-[1.55rem] leading-[1.45] text-olive sm:text-[1.85rem] sm:leading-[1.4]"
            >
              {words.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  aria-hidden="true"
                  variants={{ hidden: { opacity: 0, y: 7, filter: "blur(2px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="mr-[0.28em] inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
