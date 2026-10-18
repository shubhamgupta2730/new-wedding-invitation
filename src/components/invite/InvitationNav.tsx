"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Sparkles, ArrowUpRight } from "lucide-react";
import { wedding } from "@/config/wedding";
import { trackInvitationEvent, type InvitationEvent } from "@/lib/analytics";

const links = [
  { href: "#date-reveal", label: "Our date", icon: CalendarDays, event: "date_navigation_clicked" },
  { href: "#events", label: "Celebrations", icon: Sparkles, event: "celebrations_navigation_clicked" },
  { href: "#venue", label: "Venue", icon: MapPin, event: "venue_navigation_clicked" },
  { href: "#rsvp", label: "RSVP", icon: null, event: "rsvp_navigation_clicked" },
];

export function InvitationNav() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [rsvpVisible, setRsvpVisible] = useState(false);
  const [closingVisible, setClosingVisible] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const sections = links
      .map(({ href }) => document.querySelector<HTMLElement>(href))
      .filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSection(`#${visible.target.id}`);
      },
      { rootMargin: "-18% 0px -66% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setPastHero(window.scrollY > window.innerHeight * 0.55);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>("#closing");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setClosingVisible(entry.isIntersecting),
      { threshold: 0.08 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>("#rsvp");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setRsvpVisible(entry.isIntersecting),
      { threshold: 0.12 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <>
    <nav aria-label="Invitation sections" className="invitation-nav sticky top-0 z-40 border-b border-gold/15 px-3 py-2 sm:px-6">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <a href="#invitation" className="group flex shrink-0 items-center gap-2 rounded-full px-2 py-1.5 text-olive" aria-label={`${wedding.couple.namesDisplay}, back to invitation top`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/35 bg-white/75 font-serif text-[0.62rem] tracking-tight shadow-sm">
            {wedding.couple.bride[0]}<span className="text-gold">&amp;</span>{wedding.couple.groom[0]}
          </span>
          <span className="hidden font-serif text-sm sm:inline">{wedding.couple.namesDisplay}</span>
        </a>
        <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto rounded-full border border-gold/20 bg-white/65 p-1 shadow-[0_4px_14px_rgba(73,58,55,.04)] backdrop-blur-md sm:gap-1">
          {links.map(({ href, label, icon: Icon, event }) => (
            <a key={href} href={href} aria-current={activeSection === href ? "location" : undefined} onClick={() => trackInvitationEvent(event as InvitationEvent)} className={`nav-link inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 text-[0.64rem] font-medium transition-all duration-200 focus-visible:bg-[#f3e8df] sm:px-3 sm:text-xs ${activeSection === href ? "bg-[#f3e8df] text-olive shadow-sm" : "text-olive/70 hover:bg-[#f3e8df] hover:text-olive"}`}>
              {Icon ? <Icon size={13} aria-hidden="true" /> : null}
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
    {pastHero && !rsvpVisible && !closingVisible ? (
      <a href="#rsvp" onClick={() => trackInvitationEvent("rsvp_navigation_clicked")} className="interactive-button fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full border border-gold/35 bg-olive px-5 text-sm font-medium text-ivory shadow-[0_8px_24px_rgba(62,49,46,.24)] transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:hidden">
        RSVP <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    ) : null}
    </>
  );
}
