# Reusable Wedding Invitation Template

A mobile-first, interactive wedding invitation built with Next.js. Guests can open the curtain cover, reveal the date, explore the schedule and venue, leave a blessing, and submit an RSVP.

## Personalize for another wedding

Edit [`src/config/wedding.ts`](src/config/wedding.ts). It is the source of guest-facing wedding details; components read from this file, so you do not need to search through the UI code to change the couple.

- Set the bride and groom names at the top. Display names, invitation copy, share metadata, and the calendar filename are derived from them.
- Update the main date, time zone, every event's date and time, and the venue name, address, and map search.
- Edit the event names, themes, descriptions, family blessing, RSVP text, travel information, and other invitation copy as needed.
- Set optional events to `configured: false`, and update or remove their details. Event venue fields can stay blank when all events share the main venue.
- Keep family names blank if they should not appear in the invitation.

Before publishing, verify the dates, times, map directions, RSVP delivery settings, and deployment URL for the new wedding.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For a production build, run `npm run build` followed by `npm start`.

## Guides

- [Project guide](PROJECT_GUIDE.md): architecture, guest experience, configuration, assets, and RSVP behavior.
- [Vercel deployment guide](VERCEL_DEPLOYMENT.md): Git import, production environment variables, Google Sheets RSVP setup, and deployment checks.

Guest-facing names, dates, events, venue, and invitation copy are maintained in [`src/config/wedding.ts`](src/config/wedding.ts). Keep environment secrets in `.env.local` or your hosting provider; never commit them.
