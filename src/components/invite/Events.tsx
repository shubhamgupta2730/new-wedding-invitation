"use client";

import { Flower2, Music, Sparkles, Heart, GlassWater, CalendarDays, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { wedding, type WeddingEvent } from "@/config/wedding";
import { SectionHeading } from "@/components/invite/SectionHeading";
import { Reveal } from "@/components/invite/Reveal";

const icons: Record<string, typeof Flower2> = {
  haldi: Sparkles,
  mayra: Flower2,
  sangeet: Music,
  sagai: Heart,
  reception: GlassWater,
};

function formatDay(date: string) {
  if (!date) return "Celebration day";
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: wedding.timeZone,
  }).format(new Date(`${date}T00:00:00+05:30`));
}

function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  const Icon = icons[event.id] ?? Flower2;
  const directionsUrl = event.venue
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}`
    : null;
  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const } } }}
      className="group relative"
    >
      <span className="absolute -left-[2.08rem] top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gold/45 bg-[#f8f0e8] text-olive shadow-[0_2px_8px_rgba(81,61,47,.08)]" aria-hidden="true">
        <Icon className="event-icon" size={15} />
      </span>
      <div className="interactive-card rounded-2xl border border-gold/20 bg-white/75 px-4 py-3.5 shadow-[0_5px_18px_rgba(73,58,55,.045)] sm:px-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <div className="flex items-baseline gap-2.5">
            <span className="font-serif text-xs text-gold/90">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="font-serif text-lg leading-tight text-olive sm:text-xl">{event.name}</h3>
          </div>
          {event.time ? <span className="text-xs font-semibold tracking-wide text-sage sm:text-sm">{event.time}</span> : null}
        </div>
        {event.venue ? (
          <a href={directionsUrl ?? undefined} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-full px-2 text-sm leading-snug text-sage underline decoration-gold/40 underline-offset-4 transition-colors hover:bg-champagne/35 hover:text-olive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
            <MapPin size={14} aria-hidden="true" />
            <span>{event.venue} · Get directions</span>
          </a>
        ) : null}
        {event.description ? <p className="mt-1 pl-7 text-sm leading-snug text-olive/65">{event.description}</p> : null}
      </div>
    </motion.article>
  );
}

export function Events() {
  const configured = wedding.events.filter((event) => event.configured);
  const groups = configured.reduce<Record<string, WeddingEvent[]>>((result, event) => {
    const key = event.date || "undated";
    (result[key] ??= []).push(event);
    return result;
  }, {});
  const days = Object.entries(groups).sort(([left], [right]) => left.localeCompare(right));
  const reduce = useReducedMotion();
  let eventNumber = 0;

  return (
    <Reveal>
      <section id="events" className="scroll-mt-5 px-4 py-8 sm:px-5 sm:py-10">
        <SectionHeading eyebrow="The celebrations" title="Program timeline" />
        {days.length === 0 ? (
          <div className="rounded-2xl border border-gold/25 bg-ivory px-5 py-8 text-center shadow-sm">
            <div aria-hidden className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-gold/35 font-serif text-xl text-gold">✦</div>
            <p className="font-serif text-xl text-olive">The celebrations await</p>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-olive/65">
              We are putting the finishing touches on the festivities. The event details will be shared here soon.
            </p>
          </div>
        ) : (
          <motion.div
            className="mx-auto max-w-2xl space-y-7 sm:space-y-9"
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
          >
            {days.map(([date, events]) => {
              const readableDate = formatDay(date);
              return (
                <motion.div
                  key={date}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } } }}
                  className="relative rounded-[1.6rem] border border-gold/25 bg-[linear-gradient(145deg,rgba(248,239,230,.72),rgba(255,252,247,.76))] p-4 shadow-[0_12px_32px_rgba(89,65,49,.055)] sm:p-6"
                >
                  <div className="pointer-events-none absolute right-4 top-3 text-gold/35" aria-hidden="true">
                    <Flower2 size={22} strokeWidth={1.1} />
                  </div>
                  <header className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-white/70 text-sage shadow-sm" aria-hidden="true">
                      <CalendarDays size={17} />
                    </span>
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-sage">Day {days.findIndex(([dayDate]) => dayDate === date) + 1}</p>
                      <h3 className="mt-0.5 font-serif text-xl leading-tight text-olive sm:text-2xl">{readableDate}</h3>
                    </div>
                    <span className="ml-auto mr-8 hidden h-px w-12 bg-gradient-to-r from-gold/50 to-transparent sm:block" aria-hidden="true" />
                  </header>
                  <div className="relative ml-3 space-y-3 border-l border-gold/45 pl-6 sm:ml-4 sm:space-y-4">
                    {events.map((event) => {
                      const index = eventNumber++;
                      return <EventCard key={event.id} event={event} index={index} />;
                    })}
                  </div>
                </motion.div>
              );
            })}
            <p className="flex items-center justify-center gap-2 pt-0.5 text-xs tracking-wide text-olive/55">
              <Sparkles size={13} className="text-gold" aria-hidden="true" />
              We can&apos;t wait to celebrate with you
              <Sparkles size={13} className="text-gold" aria-hidden="true" />
            </p>
          </motion.div>
        )}
      </section>
    </Reveal>
  );
}
