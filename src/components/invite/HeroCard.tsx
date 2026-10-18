"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { wedding } from "@/config/wedding";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { GardenScene } from "@/components/ornaments/GardenScene";

export function HeroCard({
  showNames = false,
  showInvitationLine = false,
  animateNames = true,
}: {
  showNames?: boolean;
  showInvitationLine?: boolean;
  animateNames?: boolean;
}) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const upperOrnamentY = useTransform(scrollYProgress, [0, 1], [16, -16]);
  const lowerOrnamentY = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const glowY = useTransform(scrollYProgress, [0, 1], [10, -10]);
  const invitationLine = wedding.heroMessage;
  const useLineMotion = animateNames && !reduce;
  const titleVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0, delayChildren: 0 },
    },
  };
  const nameVariants = {
    hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0, ease: [0.22, 1, 0.36, 1] as const },
    },
  };
  const invitationVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0,
        staggerChildren: useLineMotion ? 0.012 : 0,
      },
    },
  };
  const letterVariants = {
    hidden: { opacity: useLineMotion ? 0 : 1, y: useLineMotion ? 5 : 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: useLineMotion ? 0.16 : 0 },
    },
  };
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.72, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section ref={sectionRef} className="relative px-4 py-8 sm:px-8 sm:py-12">
      <div className="hero-invitation-card interactive-card group relative mx-auto max-w-[650px] overflow-hidden rounded-[2rem] border border-gold/35 bg-ivory px-5 pb-9 pt-10 text-center shadow-[0_24px_70px_rgba(73,58,55,0.10)] sm:rounded-[2.25rem] sm:px-12 sm:pb-12 sm:pt-12">
        <div className="pointer-events-none absolute inset-[7px] rounded-[1.65rem] border border-gold/20" aria-hidden="true" />
        <motion.div style={reduce ? undefined : { y: glowY }} className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(ellipse_at_top,rgba(217,170,161,.2),transparent_72%)]" aria-hidden="true" />
        <motion.div style={reduce ? undefined : { y: upperOrnamentY }} className="pointer-events-none absolute left-2 top-2" aria-hidden="true">
          <FloralCorner className="h-[4.5rem] w-[4.5rem] opacity-65" position="tl" />
        </motion.div>
        <motion.div style={reduce ? undefined : { y: upperOrnamentY }} className="pointer-events-none absolute right-2 top-2" aria-hidden="true">
          <FloralCorner className="h-[4.5rem] w-[4.5rem] opacity-65" position="tr" />
        </motion.div>
        <motion.div style={reduce ? undefined : { y: lowerOrnamentY }} className="pointer-events-none absolute bottom-2 left-2" aria-hidden="true">
          <FloralCorner className="h-[4.5rem] w-[4.5rem] opacity-50" position="bl" />
        </motion.div>
        <motion.div style={reduce ? undefined : { y: lowerOrnamentY }} className="pointer-events-none absolute bottom-2 right-2" aria-hidden="true">
          <FloralCorner className="h-[4.5rem] w-[4.5rem] opacity-50" position="br" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            {...rise(0.08)}
            className="hero-monogram mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-white/60 font-serif text-sm tracking-[0.08em] text-olive shadow-[0_4px_16px_rgba(173,128,81,.12)]"
            aria-label={`${wedding.couple.bride} and ${wedding.couple.groom}`}
          >
            {wedding.couple.bride[0]}<span className="mx-0.5 text-gold">&amp;</span>{wedding.couple.groom[0]}
          </motion.div>

          <motion.p {...rise(0.16)} className="text-[0.62rem] font-medium uppercase tracking-[0.34em] text-sage sm:text-[0.68rem]">
            {wedding.tagline}
          </motion.p>

          <motion.h1
            initial={false}
            animate={showNames ? "visible" : "hidden"}
            variants={titleVariants}
            className="mt-4 flex flex-wrap items-baseline justify-center gap-x-2 font-serif text-[2.9rem] leading-none tracking-[-0.045em] text-olive sm:gap-x-4 sm:text-[4.1rem]"
          >
            <motion.span variants={nameVariants}>{wedding.couple.bride}</motion.span>
            <span className="relative -top-1 font-serif text-[1.8rem] font-normal italic tracking-normal text-gold sm:text-[2.15rem]">&amp;</span>
            <motion.span variants={nameVariants}>{wedding.couple.groom}</motion.span>
          </motion.h1>

          <motion.p
            aria-label={invitationLine}
            initial="hidden"
            animate={showInvitationLine ? "visible" : "hidden"}
            variants={invitationVariants}
            className="mt-4 max-w-[19rem] font-serif text-base italic leading-relaxed text-olive/65 sm:text-lg"
          >
            {Array.from(invitationLine).map((character, index) => character === " " ? " " : (
              <motion.span
                key={`${character}-${index}`}
                aria-hidden="true"
                variants={letterVariants}
                className="inline-block"
              >
                {character}
              </motion.span>
            ))}
          </motion.p>

          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="w-full" whileHover={reduce ? undefined : { scale: 1.035, y: -2 }} transition={{ duration: 0 }}>
            <GardenScene
              bloomIn={showNames}
              animateIn={false}
              className="mx-auto mt-2 w-full max-w-[26rem] drop-shadow-[0_8px_15px_rgba(73,58,55,.06)]"
            />
          </motion.div>

          <motion.div {...rise(0.48)} className="mt-1 flex items-center gap-3 text-[0.58rem] uppercase tracking-[0.28em] text-sage/85">
            <span className="h-px w-8 bg-gold/50" />
            <Sparkles size={12} className="text-gold" aria-hidden="true" />
            <span>A day to remember</span>
            <span className="h-px w-8 bg-gold/50" />
          </motion.div>

          <motion.a
            {...rise(0.56)}
            href="#date-reveal"
            whileHover={reduce ? undefined : { y: 3, scale: 1.025 }}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            className="interactive-button mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/35 bg-white/55 px-5 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-olive shadow-sm hover:border-gold/70 hover:bg-white/80"
          >
            Discover the invitation
            <ArrowDown size={14} aria-hidden="true" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
