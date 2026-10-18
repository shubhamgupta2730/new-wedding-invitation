"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { wedding, type WeddingEvent } from "@/config/wedding";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { formatLongWeddingDate } from "@/lib/datetime";
import { trackInvitationEvent } from "@/lib/analytics";

const CARD_WIDTH = 320;
const CARD_HEIGHT = 246;

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function formatCelebrationRange() {
  const dates = [...new Set(wedding.events.filter((event) => event.configured && event.date).map((event) => event.date))].sort();
  if (!dates.length) return null;
  const partsFor = (isoDate: string) => new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "long", year: "numeric", timeZone: wedding.timeZone,
  }).formatToParts(new Date(`${isoDate}T00:00:00+05:30`)).reduce<Record<string, string>>((parts, part) => {
    if (part.type !== "literal") parts[part.type] = part.value;
    return parts;
  }, {});
  const start = partsFor(dates[0]);
  const end = partsFor(dates[dates.length - 1]);
  if (dates.length === 1) return `${start.day} ${start.month} ${start.year}`;
  if (start.month === end.month && start.year === end.year) {
    return `${start.day}–${end.day} ${end.month} ${end.year}`;
  }
  return `${start.day} ${start.month} – ${end.day} ${end.month} ${end.year}`;
}

function saveWeddingDate() {
  const coupleSlug = `${wedding.couple.bride}-and-${wedding.couple.groom}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const stamp = new Date().toISOString().replaceAll("-", "").replaceAll(":", "").replace(/\.\d{3}Z$/, "Z");
  const escapeIcs = (value: string) => value.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll(/\r?\n/g, "\\n");
  const eventsByDate = wedding.events
    .filter((event) => event.configured && event.date)
    .reduce<Record<string, WeddingEvent[]>>((groups, event) => {
      (groups[event.date] ??= []).push(event);
      return groups;
    }, {});
  const calendarEvents = Object.entries(eventsByDate)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, events], index) => {
      const eventDay = date.replaceAll("-", "");
      const nextDay = new Date(`${date}T00:00:00Z`);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      const endDay = nextDay.toISOString().slice(0, 10).replaceAll("-", "");
      const dateLabel = new Intl.DateTimeFormat("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: wedding.timeZone,
      }).format(new Date(`${date}T00:00:00+05:30`));
      const agenda = events.map((event) => `${event.time ? `${event.time} — ` : ""}${event.name}${event.theme ? ` (Theme: ${event.theme})` : ""}`).join("\n");
      const venue = wedding.venue.confirmed ? `\nVenue: ${wedding.venue.name}\n${wedding.venue.address}\nDirections: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.venue.mapsQuery)}` : "";
      return [
        "BEGIN:VEVENT",
        `UID:${coupleSlug}-${date}@invitation`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${eventDay}`,
        `DTEND;VALUE=DATE:${endDay}`,
        `SUMMARY:${escapeIcs(`${wedding.couple.namesDisplay} — Celebrations, Day ${index + 1}`)}`,
        `DESCRIPTION:${escapeIcs(`${dateLabel}\n${agenda}${venue}`)}`,
        "END:VEVENT",
      ].join("\r\n");
    });
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${wedding.couple.namesDisplay}//Wedding Invitation//EN`,
    "CALSCALE:GREGORIAN",
    ...calendarEvents,
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${coupleSlug}-wedding.ics`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ScratchReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<Uint8ClampedArray | null>(null);
  const drawing = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const revealTracked = useRef(false);
  const reduce = useReducedMotion();
  const longDate = formatLongWeddingDate();
  const celebrationRange = formatCelebrationRange();

  const revealDate = () => {
    setRevealed(true);
    if (!revealTracked.current) {
      revealTracked.current = true;
      trackInvitationEvent("date_revealed");
    }
  };

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = canvas;
    const foil = ctx.createLinearGradient(0, 0, width, height);
    foil.addColorStop(0, "#f6edd8");
    foil.addColorStop(0.2, "#d9c390");
    foil.addColorStop(0.42, "#f2e7c8");
    foil.addColorStop(0.68, "#c6aa70");
    foil.addColorStop(1, "#f4ebd7");
    roundedRectPath(ctx, 0, 0, width, height, 22);
    ctx.fillStyle = foil;
    ctx.fill();

    // Fine tonal texture makes the full-card foil feel like engraved stationery.
    ctx.save();
    roundedRectPath(ctx, 0, 0, width, height, 22);
    ctx.clip();
    const sheen = ctx.createRadialGradient(80, 24, 2, 105, 48, 190);
    sheen.addColorStop(0, "rgba(255,255,250,.42)");
    sheen.addColorStop(1, "rgba(255,255,250,0)");
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(255,255,255,.10)";
    ctx.lineWidth = 1;
    for (let x = -height; x < width; x += 19) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + height, height);
      ctx.stroke();
    }
    ctx.restore();

    roundedRectPath(ctx, 9, 9, width - 18, height - 18, 16);
    ctx.strokeStyle = "rgba(255,255,255,.8)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    roundedRectPath(ctx, 14, 14, width - 28, height - 28, 12);
    ctx.strokeStyle = "rgba(132,102,55,.27)";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(78,61,46,.72)";
    ctx.font = "500 8px Arial, sans-serif";
    ctx.letterSpacing = "2.2px";
    ctx.fillText("A PRIVATE INVITATION", width / 2, 38);
    ctx.restore();

    // A sculpted rose-gold seal replaces the playful heart foil.
    ctx.save();
    ctx.shadowColor = "rgba(91,61,49,.24)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 5;
    const seal = ctx.createRadialGradient(143, 84, 3, 160, 111, 48);
    seal.addColorStop(0, "#e3c4b4");
    seal.addColorStop(0.48, "#c79581");
    seal.addColorStop(1, "#a86f65");
    ctx.beginPath();
    ctx.arc(width / 2, 111, 43, 0, Math.PI * 2);
    ctx.fillStyle = seal;
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(width / 2, 111, 43, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,247,231,.84)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width / 2, 111, 35, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,245,225,.48)";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.save();
    ctx.translate(width / 2, 111);
    ctx.strokeStyle = "rgba(255,247,231,.68)";
    ctx.lineWidth = 1;
    for (let index = 0; index < 8; index += 1) {
      ctx.save();
      ctx.rotate((Math.PI * 2 * index) / 8);
      ctx.beginPath();
      ctx.ellipse(0, -22, 3.4, 8.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = "#fff6e7";
    ctx.font = "italic 18px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "0px";
    ctx.fillText(`${wedding.couple.bride[0]}&${wedding.couple.groom[0]}`, 0, 1);
    ctx.restore();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(78,61,46,.76)";
    ctx.font = "500 7px Arial, sans-serif";
    ctx.letterSpacing = "1.8px";
    ctx.fillText("A WEDDING KEEPSAKE", width / 2, 173);
    ctx.beginPath();
    ctx.moveTo(width / 2 - 32, 189);
    ctx.lineTo(width / 2 + 32, 189);
    ctx.strokeStyle = "rgba(132,102,55,.5)";
    ctx.stroke();
    ctx.font = "500 7px Arial, sans-serif";
    ctx.letterSpacing = "1.7px";
    ctx.fillText("SCRATCH TO REVEAL", width / 2, 207);
    maskRef.current = ctx.getImageData(0, 0, width, height).data;
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 19, 0, Math.PI * 2);
    ctx.fill();
  };

  const measureReveal = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const alpha = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const mask = maskRef.current;
    if (!mask) return;
    let erased = 0;
    let sampled = 0;
    for (let index = 3; index < alpha.length; index += 32) {
      if (mask[index] === 0) continue;
      sampled += 1;
      if (alpha[index] === 0) erased += 1;
    }
    if (erased / sampled > 0.32) revealDate();
  };

  return (
    <section id="date-reveal" className="relative scroll-mt-6 overflow-hidden px-5 py-14 sm:py-16">
      <div className="scratch-halo pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden />
      <motion.div
        className="relative mx-auto max-w-[370px] text-center"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[0.65rem] uppercase tracking-[0.32em] text-sage">A keepsake for you</p>
        <h2 className="mt-2 font-serif text-3xl text-olive">A date worth uncovering</h2>
        <GoldDivider className="mx-auto mt-4 max-w-36" />
        <p className="mx-auto mt-4 max-w-[17rem] text-sm leading-relaxed text-olive/65">
          {revealed ? "Keep this date close. We can't wait to celebrate with you." : "A little scratch, and our special day is yours to keep."}
        </p>

        <div className="date-reveal-frame interactive-card relative mx-auto mt-7 h-[246px] w-full max-w-[320px] overflow-hidden rounded-[1.4rem] p-2">
          <div className="date-reveal-underlay absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
            <span className="mb-3 block h-px w-10 bg-gold/70" />
            <p className="font-serif text-lg italic text-olive/70">You&apos;re invited</p>
            {revealed ? (
              celebrationRange ? (
                <div className="mt-2 flex flex-col items-center text-olive">
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.24em] text-sage">Celebrations</p>
                  <p className="mt-0.5 font-serif text-[1.25rem] leading-tight">{celebrationRange}</p>
                  {longDate ? <p className="mt-2 text-[0.62rem] tracking-wide text-olive/65">Wedding day · {longDate.split(", ").slice(0, 2).join(", ")}</p> : null}
                </div>
              ) : (
                longDate ? (
                  <div className="mt-1 flex flex-col items-center text-olive">
                    <p className="text-[0.58rem] uppercase tracking-[0.24em] text-sage">{longDate.split(", ")[0]}</p>
                    <p className="font-serif text-[1.25rem] leading-tight">{longDate.split(", ").slice(1).join(", ")}</p>
                  </div>
                ) : <p className="mt-2 font-serif text-base text-olive/75">Wedding date to be confirmed</p>
              )
            ) : null}
            <p className="mt-4 text-[0.58rem] uppercase tracking-[0.25em] text-sage">{wedding.couple.namesDisplay}</p>
          </div>
          {!revealed ? (
            <canvas
              ref={canvasRef}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              aria-hidden="true"
              className={`date-reveal-foil absolute inset-0 h-full w-full touch-none cursor-crosshair rounded-[1.3rem] ${reduce ? "" : "date-reveal-prompt"}`}
              onPointerDown={(event) => {
                drawing.current = true;
                event.currentTarget.setPointerCapture(event.pointerId);
                scratch(event.clientX, event.clientY);
              }}
              onPointerMove={(event) => {
                if (drawing.current) scratch(event.clientX, event.clientY);
              }}
              onPointerUp={() => {
                drawing.current = false;
                measureReveal();
              }}
              onPointerCancel={() => {
                drawing.current = false;
                measureReveal();
              }}
            />
          ) : (
            <motion.div
              aria-hidden
              className="date-reveal-sparkle pointer-events-none absolute inset-0 rounded-[1.1rem]"
              initial={{ opacity: 0.7, scale: 0.96 }}
              animate={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </div>

        <button
          type="button"
          onClick={revealed ? () => {
            trackInvitationEvent("calendar_download_clicked");
            saveWeddingDate();
          } : revealDate}
          className="interactive-button mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/45 bg-ivory px-6 text-[0.67rem] font-medium uppercase tracking-[0.18em] text-olive shadow-sm transition hover:border-gold hover:bg-[#f3ead9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          {revealed ? <><CalendarDays size={16} aria-hidden /> Add both days to calendar</> : "Reveal our date"}
        </button>
        {revealed ? (
          <p className="mt-2 text-xs text-olive/60">Adds both celebration days, their schedule, and venue to your calendar.</p>
        ) : null}
      </motion.div>
    </section>
  );
}
