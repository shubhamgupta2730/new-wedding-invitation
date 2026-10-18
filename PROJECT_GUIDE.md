# Project Guide

## Purpose

This is a reusable, mobile-first wedding invitation template. It is a single-page Next.js site designed like a keepsake invitation, with an animated opening, date reveal, celebration schedule, venue directions, and RSVP form. It uses original vector artwork and has no guest-facing couple photographs.

## Guest experience

1. Guests see the warm paper invitation cover and tap the seal or **Open invitation** to reveal the invitation.
2. The two cover panels part from the center. The invitation page underneath is revealed in place.
3. Guests can scratch the foil heart or use **Reveal our date**. The calendar action appears after the date is revealed and creates an all-day calendar event.
4. Guests explore the invitation message, handwritten family blessing, celebration moments, wishes tree, countdown, two-day program, venue map, RSVP, private voice blessing recorder, and closing card. After a successful RSVP, the closing message thanks the guest by name and reflects whether they can attend.

The date is intentionally not printed on the cover or main invitation card. It appears in the reveal section. Before the celebrations, the countdown targets the first configured event in the configured time zone. During the celebrations, it becomes a live, date-specific schedule and highlights the next scheduled event; after the final celebration day, it becomes a thank-you note.

## Technology

- Next.js 15 App Router, React 19, and TypeScript
- Tailwind CSS 4 for styling
- Framer Motion for the curtain opening, viewport reveals, and interactive details
- Lucide React for interface icons
- Google Fonts loaded with `next/font`: Playfair Display, DM Sans, and Caveat for the handwritten family note
- Google Apps Script as the optional server-side receiver for a private Google Sheet guestbook and Google Drive voice blessings

## Important files

| Path | Responsibility |
| --- | --- |
| `src/app/page.tsx` | App Router home page |
| `src/components/invite/InvitationApp.tsx` | Mounts the cover and invitation sections; handles open/restart state |
| `src/components/invite/Cover.tsx` | Interactive two-panel curtain reveal |
| `src/components/invite/HeroCard.tsx` | Main invitation card and floral arch |
| `src/components/invite/ScratchReveal.tsx` | Scratchable date card, accessible reveal button, and calendar file download |
| `src/components/invite/Events.tsx` | Compact side-by-side event groups by date |
| `src/components/invite/Venue.tsx` | Venue address, embedded map, and Google Maps directions link |
| `src/components/invite/BlossomGarden.tsx` | Interactive wishes tree, guest blessings, and share consent |
| `src/components/invite/VoiceBlessing.tsx` | 20-second browser voice recorder and private upload flow |
| `src/components/invite/Rsvp.tsx` | Guest-facing RSVP form and submission status |
| `src/components/invite/FamilyBlessing.tsx` | Handwritten-style message from both families |
| `src/components/invite/Closing.tsx` | Closing note, personalized after a successful RSVP |
| `src/app/api/rsvp/route.ts` | Validates and forwards RSVP submissions server-side |
| `src/app/api/wishes/route.ts` | Validates wishes, loads shared blessings, and forwards requests server-side |
| `src/app/api/voice-note/route.ts` | Validates and forwards short voice notes server-side |
| `src/app/api/analytics/route.ts` | Accepts anonymous, allowlisted invitation interaction events and forwards them server-side |
| `src/lib/analytics.ts` | Sends privacy-minimized event names from guest interactions |
| `integrations/google-sheets-rsvp/Code.gs` | Google Apps Script receiver for Sheet rows and optional email alerts |
| `src/config/wedding.ts` | Guest-facing wedding content and settings |
| `src/app/globals.css` | Color palette, paper/curtain treatments, and global motion styles |
| `.env.example` | Names of server environment variables; values are blank |

## Wedding configuration

`src/config/wedding.ts` is the source of truth for guest-facing couple names, invitation copy, dates, events, venue, family message, travel details, and RSVP wording. Edit this file to reuse the template. The couple display name, browser metadata, share text, and calendar download name are derived from the bride and groom names. Event locations can stay blank when all events use the main venue.

Optional features can be disabled or left unconfigured in the same file. Keep family names blank if they should not appear; set `story.enabled` to `true` only after adding story copy, and set `rsvp.enabled` to `false` to hide RSVP.

### Updating content

Edit `src/config/wedding.ts`:

- Bride and groom name constants at the top. Other couple labels are derived from these.
- `countdownIso`: ISO timestamp with an explicit offset for the wedding date reveal and calendar date, such as `2026-11-20T00:00:00+05:30`.
- `timeZone`: set the IANA time zone for the event dates and countdown.
- `events`: keep events in chronological order; use `YYYY-MM-DD` for each date and a readable time such as `10:00 AM`. Set `configured: true` only for confirmed events.
- Venue name and address constants at the top. `mapsQuery` is derived from them and powers both the embedded map and directions link.
- Invitation, family blessing, travel, and RSVP copy to match the couple's preferences.
- Event `theme` and `description` fields for guest guidance.
- `story.enabled`: set to `true` only after supplying the story copy.
- `rsvp.enabled`: set to `false` to hide the RSVP section.

Do not add an event location or other wedding detail unless it has been confirmed by the couple.

## RSVP data flow

The browser sends RSVP fields to `/api/rsvp`, wishes to `/api/wishes`, short audio recordings to `/api/voice-note`, and anonymous interaction event names to `/api/analytics`. The server validates each analytics event and forwards it with the shared secret to `RSVP_WEBHOOK_URL`. The Apps Script receiver saves analytics in the `Invitation Analytics` tab and creates an `Analytics Summary` tab with all-time and today counts. Events contain only an allowlisted interaction name and server receipt time; they do not contain guest names, IP addresses, device details, or a visitor ID. Counts describe event occurrences, not distinct people. Analytics is best effort and is silently disabled until the server webhook is configured.

Tracked events include page opens, completed curtain openings, date reveal, calendar and directions clicks, navigation clicks, RSVP form starts and successful submissions, wishes, voice blessings, and invitation share clicks. RSVP, wish, and voice submissions continue to be stored in their own existing tabs.

Required server-only variables for the included Google Sheets receiver:

| Variable | Purpose |
| --- | --- |
| `RSVP_WEBHOOK_URL` | Deployed Google Apps Script Web app URL ending in `/exec` |
| `RSVP_WEBHOOK_SECRET` | Shared random secret; must match the Apps Script `RSVP_SECRET` property |

Optional Google Apps Script properties:

| Script property | Purpose |
| --- | --- |
| `SPREADSHEET_ID` | The ID from the Google Sheet URL |
| `NOTIFICATION_EMAIL` | Email address for a new-RSVP notification; omit to disable notifications |

The form is not connected until both required variables are configured in the environment serving the site. The Apps Script Web app must run as the Sheet owner and accept public requests so the server can reach it; it rejects requests without the shared secret. Keep the Sheet private and do not put either secret in client code, Git, or this guide.

After a successful RSVP, the guest's name and attendance choice are kept in React page state to personalize the closing thank-you. Wish submissions are stored privately; only guests who opt in to tree sharing appear publicly, by first name and blessing. Voice notes are saved in the couple's private Drive folder and are never posted on the site. The wishes and voice-note features require the updated Apps Script deployment and the same server webhook variables as RSVP.

For setup steps, see [Vercel Deployment](VERCEL_DEPLOYMENT.md). The same webhook variables can be added to `.env.local` for local use; `.env.local` is ignored by Git.

## Assets and privacy

- Couple photographs are stored under `src/private-assets/unpublished-photos/` and are not imported by the app or served from `public/`.
- Do not move private photographs into `public/` or import them into a page unless the couple explicitly changes that requirement.
- The venue map is embedded from Google Maps, and the directions action opens Google Maps. Those interactions require an internet connection and load Google-hosted content.
- Avoid storing guest information outside the private RSVP Sheet. Limit Sheet sharing to the hosts.
- Voice recordings are saved to a private Drive folder owned by the Apps Script account. Keep access restricted to the hosts; do not enable link sharing for the folder.

## Local development and checks

```bash
npm install
npm run dev
```

```bash
npm run lint
npm run build
npm start
```

The build checks TypeScript and produces the production app. `npm start` serves the latest successful build. If you change content or styles while using `npm start`, rebuild and restart the process to update the preview.
