"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { wedding } from "@/config/wedding";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { GoldSeal } from "@/components/ornaments/GoldSeal";

type OpenOptions = { skipEffects?: boolean };

export function Cover({
  onOpen,
  onBegin,
  onTextBegin,
}: {
  onOpen: (options?: OpenOptions) => void;
  onBegin?: () => void;
  onTextBegin?: () => void;
}) {
  const reduce = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const opened = useRef(false);
  const finished = useRef(false);
  const textStarted = useRef(false);
  const textRevealTimer = useRef<number | null>(null);

  const beginText = () => {
    if (textStarted.current) return;
    textStarted.current = true;
    onTextBegin?.();
  };

  const finish = (skipEffects = false) => {
    if (finished.current) return;
    finished.current = true;
    if (textRevealTimer.current !== null) window.clearTimeout(textRevealTimer.current);
    beginText();
    onOpen({ skipEffects });
  };

  const open = () => {
    if (opened.current) return;
    opened.current = true;
    if (reduce) {
      finish(true);
      return;
    }
    onBegin?.();
    textRevealTimer.current = window.setTimeout(beginText, 1450);
    setOpening(true);
  };

  const skip = () => {
    if (opened.current) {
      finish(true);
      return;
    }
    opened.current = true;
    finish(true);
  };

  const curtainTransition = (side: "left" | "right") => ({
    duration: reduce ? 0 : side === "left" ? 2.25 : 2.4,
    delay: reduce ? 0 : side === "left" ? 0.18 : 0.28,
    ease: [0.76, 0, 0.24, 1] as const,
  });

  return (
    <section className="cover-scene fixed inset-0 z-[100] flex min-h-dvh items-center justify-center overflow-hidden px-5 py-8 text-center" aria-label="Wedding invitation cover">
      <div className="cover-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="cover-grain pointer-events-none absolute inset-0" aria-hidden />

      <motion.div
        className="cover-door cover-door-left absolute inset-y-0 left-0 z-10 w-[50.1%] overflow-hidden"
        initial={false}
        animate={opening ? { x: "-101%", rotateY: 62, scaleX: 0.9, opacity: 0.9 } : { x: "0%", rotateY: 0, scaleX: 1, opacity: 1 }}
        transition={curtainTransition("left")}
        style={{ transformOrigin: "left center", perspective: 1200 }}
        aria-hidden="true"
      >
        <span className="cover-door-handle cover-door-handle-left absolute" />
        <FloralCorner className="absolute left-1 top-2 h-36 w-36 opacity-45 sm:h-48 sm:w-48" position="tl" />
        <FloralCorner className="absolute bottom-2 left-1 h-36 w-36 opacity-40 sm:h-48 sm:w-48" position="bl" />
      </motion.div>
      <motion.div
        className="cover-door cover-door-right absolute inset-y-0 right-0 z-10 w-[50.1%] overflow-hidden"
        initial={false}
        animate={opening ? { x: "101%", rotateY: -62, scaleX: 0.9, opacity: 0.9 } : { x: "0%", rotateY: 0, scaleX: 1, opacity: 1 }}
        transition={curtainTransition("right")}
        style={{ transformOrigin: "right center", perspective: 1200 }}
        onAnimationComplete={() => { if (opening) finish(); }}
        aria-hidden="true"
      >
        <span className="cover-door-handle cover-door-handle-right absolute" />
        <FloralCorner className="absolute right-1 top-2 h-36 w-36 opacity-45 sm:h-48 sm:w-48" position="tr" />
        <FloralCorner className="absolute bottom-2 right-1 h-36 w-36 opacity-40 sm:h-48 sm:w-48" position="br" />
      </motion.div>

      {!reduce ? (
        <button
          type="button"
          onClick={skip}
          className="skip-animation absolute bottom-7 right-8 z-40 rounded-full px-4 py-2 text-[0.62rem] uppercase tracking-[0.18em] transition-colors hover:bg-white/15 focus-visible:outline-white sm:bottom-8 sm:right-10"
        >
          Skip animation
        </button>
      ) : null}

      <motion.div
        className="cover-center relative z-20 mx-auto flex w-full max-w-[370px] flex-col items-center px-6 py-10"
        animate={opening ? { opacity: 0, scale: 0.92, y: -8 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.24, delay: 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="cover-emblem mb-5 flex h-12 w-12 items-center justify-center rounded-full"
          animate={reduce || opening ? undefined : { rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none">
            <circle cx="32" cy="32" r="27" stroke="currentColor" strokeWidth=".8" />
            <circle cx="32" cy="32" r="21" stroke="currentColor" strokeWidth=".6" opacity=".65" />
            <path d="M32 15c-5 8-5 12 0 17 5-5 5-9 0-17Zm0 34c-5-8-5-12 0-17 5 5 5 9 0 17ZM15 32c8-5 12-5 17 0-5 5-9 5-17 0Zm34 0c-8-5-12-5-17 0 5 5 9 5 17 0Z" fill="currentColor" opacity=".64" />
          </svg>
        </motion.div>

          <p className="cover-kicker text-[0.62rem] uppercase tracking-[0.34em]">A wedding invitation</p>
        <h1 className="cover-names mt-4 flex flex-col font-serif text-[3.5rem] leading-[0.88] tracking-[-0.04em] sm:text-[4rem]">
          <span>{wedding.couple.bride}</span>
          <span className="my-2 font-serif text-3xl font-light italic text-gold">&amp;</span>
          <span>{wedding.couple.groom}</span>
        </h1>
        <motion.button
          type="button"
          onClick={open}
          disabled={opening}
          whileHover={reduce || opening ? undefined : { scale: 1.06, rotate: -2 }}
          whileTap={reduce || opening ? undefined : { scale: 0.96 }}
          className="seal-button group mt-7 flex h-[8.5rem] w-[8.5rem] items-center justify-center rounded-full disabled:cursor-default"
          aria-label="Tap to open the wedding invitation"
        >
          <GoldSeal className="h-full w-full drop-shadow-xl transition-transform duration-500 group-hover:rotate-3" label="Tap to open" />
        </motion.button>

        <button
          type="button"
          onClick={open}
          disabled={opening}
          className="cover-open-link interactive-button mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[0.65rem] uppercase tracking-[0.24em] disabled:cursor-default"
        >
          <Sparkles size={13} aria-hidden />
          Open invitation
        </button>
        <p className="cover-hint mt-1 text-[0.58rem] tracking-[0.14em]">
          Tap the seal to begin
        </p>
      </motion.div>
    </section>
  );
}
