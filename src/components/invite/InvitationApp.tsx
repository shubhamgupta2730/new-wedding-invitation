"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Cover } from "@/components/invite/Cover";
import { HeroCard } from "@/components/invite/HeroCard";
import { ScratchReveal } from "@/components/invite/ScratchReveal";
import { PreludeCarousel } from "@/components/invite/PreludeCarousel";
import { Countdown } from "@/components/invite/Countdown";
import { Events } from "@/components/invite/Events";
import { Venue } from "@/components/invite/Venue";
import { Story } from "@/components/invite/Story";
import { Rsvp, type RsvpConfirmation } from "@/components/invite/Rsvp";
import { Closing } from "@/components/invite/Closing";
import { Reveal } from "@/components/invite/Reveal";
import { GuestGuide } from "@/components/invite/GuestGuide";
import { VoiceBlessing } from "@/components/invite/VoiceBlessing";
import { InvitationNav } from "@/components/invite/InvitationNav";
import { trackInvitationEvent } from "@/lib/analytics";

export function InvitationApp() {
  const [opened, setOpened] = useState(false);
  const [portalRevealed, setPortalRevealed] = useState(false);
  const [showNames, setShowNames] = useState(false);
  const [showInvitationLine, setShowInvitationLine] = useState(false);
  const [animateNames, setAnimateNames] = useState(true);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const reduce = useReducedMotion();
  const [rsvpConfirmation, setRsvpConfirmation] = useState<RsvpConfirmation | null>(null);
  const pageOpenTracked = useRef(false);

  useEffect(() => {
    if (pageOpenTracked.current) return;
    pageOpenTracked.current = true;
    trackInvitationEvent("page_opened");
  }, []);

  const returnToCoverPosition = useCallback(() => {
    // Browsers can restore an old #date-reveal anchor before the cover hydrates.
    // Clear it while the cover is shown so opening always reveals the invitation from its beginning.
    const { pathname, search, hash } = window.location;
    if (hash) window.history.replaceState(window.history.state, "", `${pathname}${search}`);
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previousBehavior;
  }, []);

  useLayoutEffect(() => {
    returnToCoverPosition();
  }, [returnToCoverPosition]);

  const restart = () => {
    setShowNames(false);
    setShowInvitationLine(false);
    setAnimateNames(true);
    setSkipAnimation(false);
    setPortalRevealed(false);
    returnToCoverPosition();
    setOpened(false);
  };

  return (
    <div className="paper relative min-h-dvh">
      <motion.div
        aria-hidden={!opened}
        inert={!opened}
        className={opened ? undefined : "h-dvh overflow-hidden"}
        initial={false}
        animate={opened
          ? { opacity: 1, scale: 1, filter: "blur(0px)" }
          : portalRevealed
            ? { opacity: 1, scale: 1, filter: "blur(0px)" }
            : { opacity: 0, scale: 1.012, filter: "blur(5px)" }}
        transition={{ duration: reduce || skipAnimation ? 0 : opened ? 0.16 : portalRevealed ? 0.18 : 0.42, delay: 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href="#invitation" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ivory focus:px-3 focus:py-2">
          Skip to invitation
        </a>
        <div id="invitation" className="invitation-shell">
          <InvitationNav />
          <Reveal><HeroCard showNames={showNames} showInvitationLine={showInvitationLine} animateNames={animateNames} /></Reveal>
          <ScratchReveal />
          <PreludeCarousel />
          <GuestGuide />
          <Countdown />
          <Events />
          <Venue />
          <Story />
          <Rsvp onSuccess={setRsvpConfirmation} />
          <VoiceBlessing />
          <Closing onRestart={restart} rsvpConfirmation={rsvpConfirmation} />
        </div>
      </motion.div>
      {!opened ? <Cover onBegin={() => {
        setPortalRevealed(true);
        setShowNames(true);
      }} onTextBegin={() => setShowInvitationLine(true)} onOpen={({ skipEffects } = {}) => {
        trackInvitationEvent("curtain_opened");
        returnToCoverPosition();
        setSkipAnimation(Boolean(skipEffects));
        setShowNames(true);
        setShowInvitationLine(true);
        setAnimateNames(!skipEffects);
        setOpened(true);
      }} /> : null}
    </div>
  );
}
