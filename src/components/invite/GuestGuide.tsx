import { ArrowRight, CalendarDays, Leaf, MapPin, Smartphone } from "lucide-react";
import { wedding } from "@/config/wedding";
import { SectionHeading } from "@/components/invite/SectionHeading";
import { Reveal } from "@/components/invite/Reveal";
import { HomeScreenInstall } from "@/components/invite/HomeScreenInstall";

function celebrationRange() {
  const dates = [...new Set(wedding.events.filter((event) => event.configured && event.date).map((event) => event.date))].sort();
  if (!dates.length) return "Dates to be announced";

  const dateParts = (date: string) => new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "long", year: "numeric", timeZone: wedding.timeZone,
  }).formatToParts(new Date(`${date}T00:00:00+05:30`)).reduce<Record<string, string>>((result, part) => {
    if (part.type !== "literal") result[part.type] = part.value;
    return result;
  }, {});

  const first = dateParts(dates[0]);
  const last = dateParts(dates[dates.length - 1]);
  if (first.month === last.month && first.year === last.year) {
    return `${first.day}–${last.day} ${last.month} ${last.year}`;
  }
  return `${first.day} ${first.month} – ${last.day} ${last.month} ${last.year}`;
}

export function GuestGuide() {
  const themedEvent = wedding.events.find((event) => event.configured && event.theme);
  const eventTheme = themedEvent?.theme;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.venue.mapsQuery)}`;

  return (
    <Reveal>
      <section id="guest-guide" className="scroll-mt-20 px-5 py-10 sm:py-12">
        <SectionHeading eyebrow="A little guide" title="Before the celebrations" />
        <div className="interactive-card mx-auto max-w-2xl overflow-hidden rounded-[1.6rem] border border-gold/25 bg-white/60 shadow-[0_12px_32px_rgba(89,65,49,.06)]">
          <a href="#events" className="group flex min-h-[92px] items-center gap-4 px-5 py-4 transition-colors hover:bg-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:px-7">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-champagne/40 text-sage" aria-hidden="true">
              <CalendarDays size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sage">Celebrations</span>
              <span className="mt-1 block font-serif text-xl leading-tight text-olive sm:text-2xl">{celebrationRange()}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-sage transition-transform group-hover:translate-x-1"><span className="hidden sm:inline">View schedule</span><ArrowRight size={14} aria-hidden="true" /></span>
          </a>

          <div className="grid grid-cols-1 border-t border-gold/15 sm:grid-cols-2">
            {eventTheme ? (
              <div className="flex min-h-[92px] items-center gap-3 border-b border-gold/15 px-4 py-4 sm:border-b-0 sm:border-r sm:px-7">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c6d5bb] bg-[#e8efdf] text-[#516548]" aria-hidden="true">
                  <Leaf size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-sage">{themedEvent?.name} theme</span>
                  <span className="mt-1 block whitespace-normal break-words font-serif text-base leading-snug text-[#516548] sm:text-lg">{eventTheme}</span>
                </span>
              </div>
            ) : null}
            {wedding.venue.confirmed ? (
              <a href={directions} target="_blank" rel="noreferrer" className={`group flex min-h-[92px] items-center gap-3 px-4 py-4 transition-colors hover:bg-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:px-7 ${eventTheme ? "" : "col-span-2"}`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-champagne/40 text-sage" aria-hidden="true">
                  <MapPin size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-sage">All events at</span>
                  <span className="mt-1 block line-clamp-2 font-serif text-sm leading-snug text-olive sm:text-base">{wedding.venue.name}</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-sage">Directions <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                </span>
              </a>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 border-t border-gold/15 bg-white/25 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-white/65 text-sage" aria-hidden="true">
                <Smartphone size={16} />
              </span>
              <span>
                <span className="block text-sm font-medium text-olive">Keep the invitation close</span>
                <span className="mt-0.5 block text-xs text-olive/60">Save it to your phone for quick access.</span>
              </span>
            </div>
            <HomeScreenInstall />
          </div>
        </div>
      </section>
    </Reveal>
  );
}
