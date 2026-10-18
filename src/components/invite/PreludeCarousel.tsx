"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flower2, Heart, Quote, Sparkles } from "lucide-react";
import { wedding } from "@/config/wedding";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { Reveal } from "@/components/invite/Reveal";

const slides = [
  { id: "welcome", label: "The invitation", icon: Heart },
  { id: "blessing", label: "A family blessing", icon: Quote },
  { id: "interlude", label: wedding.interlude.eyebrow, icon: Flower2 },
];

export function PreludeCarousel() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(slides.length - 1, index));
    trackRef.current?.children[next]?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
    setActive(next);
  };

  const updateActive = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.getBoundingClientRect().left + track.clientWidth / 2;
    let closest = 0;
    let distance = Number.POSITIVE_INFINITY;
    Array.from(track.children).forEach((card, index) => {
      const bounds = card.getBoundingClientRect();
      const currentDistance = Math.abs(bounds.left + bounds.width / 2 - center);
      if (currentDistance < distance) {
        closest = index;
        distance = currentDistance;
      }
    });
    setActive(closest);
  };

  return (
    <Reveal>
      <section aria-label="A few words for the journey" className="px-3 py-7 sm:px-5 sm:py-9">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-end justify-between gap-4 px-3 sm:px-5">
            <div>
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.28em] text-sage">A few words for the journey</p>
              <p className="mt-1 font-serif text-lg text-olive">Made warmer by the people we love</p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous card" className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-ivory text-olive transition hover:bg-white disabled:opacity-35">
                <ChevronLeft size={17} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => goTo(active + 1)} disabled={active === slides.length - 1} aria-label="Next card" className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-ivory text-olive transition hover:bg-white disabled:opacity-35">
                <ChevronRight size={17} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            onScroll={updateActive}
            className="prelude-track flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[6%] pb-2 sm:gap-4 sm:px-[8%]"
            aria-label="Invitation messages; swipe or use the controls to change card"
          >
            {slides.map(({ id, label, icon: Icon }, index) => (
              <motion.article
                key={id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}: ${label}`}
                animate={{ opacity: active === index ? 1 : 0.76, scale: active === index ? 1 : 0.975, y: active === index ? 0 : 4 }}
                transition={{ duration: reduce ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="prelude-card interactive-card relative flex min-h-[310px] w-[88%] max-w-[620px] shrink-0 snap-center flex-col items-center justify-center overflow-hidden rounded-[1.8rem] border border-gold/35 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,.94),transparent_68%),linear-gradient(145deg,#fbf8f3,#f6eee5)] px-6 py-8 text-center shadow-[0_16px_38px_rgba(73,58,55,.08)] sm:min-h-[330px] sm:w-[84%] sm:px-12"
              >
                <div className="pointer-events-none absolute inset-[7px] rounded-[1.5rem] border border-gold/15" aria-hidden="true" />
                <FloralCorner className="pointer-events-none absolute -left-1 -top-1 h-20 w-20 opacity-50" position="tl" />
                <FloralCorner className="pointer-events-none absolute -right-1 -top-1 h-20 w-20 opacity-50" position="tr" />
                <FloralCorner className="pointer-events-none absolute -bottom-1 -left-1 h-16 w-16 opacity-30" position="bl" />
                <FloralCorner className="pointer-events-none absolute -bottom-1 -right-1 h-16 w-16 opacity-30" position="br" />
                <div className="relative z-10 flex flex-col items-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-white/75 text-gold shadow-[0_5px_16px_rgba(178,138,89,.1)]" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.5} />
                  </span>
                  <p className="mt-4 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-sage">{label}</p>
                  <GoldDivider className="mx-auto mt-3 max-w-28" />

                  <AnimatePresence mode="wait" initial={false}>
                    {id === "welcome" ? (
                      <motion.p key={id} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: reduce ? 0 : 0.35 }} className="mt-5 max-w-[34rem] font-serif text-[1.45rem] leading-snug text-olive sm:text-[1.8rem]">
                        {wedding.invitationMessage}
                      </motion.p>
                    ) : id === "blessing" ? (
                      <motion.div key={id} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: reduce ? 0 : 0.35 }}>
                        <h2 className="mt-4 font-serif text-2xl text-olive sm:text-[1.7rem]">A blessing for their beginning</h2>
                        <p className="mx-auto mt-3 max-w-[34rem] font-note text-[1.35rem] leading-snug text-olive/80 sm:text-[1.6rem]">{wedding.familyBlessing}</p>
                        <p className="mt-3 font-note text-lg italic text-sage sm:text-xl">{wedding.familySignoff}</p>
                      </motion.div>
                    ) : (
                      <motion.div key={id} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: reduce ? 0 : 0.35 }}>
                        <h2 className="mt-4 font-serif text-2xl leading-tight text-olive sm:text-[1.8rem]">{wedding.interlude.title}</h2>
                        <p className="mx-auto mt-3 max-w-[30rem] font-serif text-lg leading-relaxed text-olive/70">{wedding.interlude.body}</p>
                        <Sparkles className="mx-auto mt-3 text-gold/80" size={17} aria-hidden="true" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2" role="group" aria-label="Choose an invitation message">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Show ${slide.label}`}
                  aria-pressed={active === index}
                  className={`h-2 rounded-full transition-all duration-300 ${active === index ? "w-7 bg-gold" : "w-2 bg-gold/35 hover:bg-gold/65"}`}
                />
              ))}
            </div>
            <span className="text-[0.62rem] uppercase tracking-[0.16em] text-olive/50">{active + 1} / {slides.length}</span>
          </div>
          <div className="mt-2 flex justify-center gap-3 sm:hidden">
            <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous card" className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-ivory text-olive transition hover:bg-white disabled:opacity-35">
              <ChevronLeft size={17} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => goTo(active + 1)} disabled={active === slides.length - 1} aria-label="Next card" className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-ivory text-olive transition hover:bg-white disabled:opacity-35">
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
