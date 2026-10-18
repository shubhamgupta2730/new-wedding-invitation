export type WeddingEvent = {
  id: string;
  name: string;
  /** Set to true when the date and time are confirmed. */
  configured: boolean;
  /** ISO date (YYYY-MM-DD) in India, or empty when unknown. */
  date: string;
  /** Display time, e.g. "10:30 AM". Leave empty if not confirmed. */
  time: string;
  /** Optional guest-facing event theme or dress guidance. */
  theme?: string;
  venue: string;
  description: string;
};

export type TravelDetail = {
  title: string;
  description: string;
};

// Personalize a new invitation by editing the values in this file.
const brideName = "Nikita";
const groomName = "Rishi";
const coupleNames = `${brideName} & ${groomName}`;
const weddingDateIso = "2026-11-20T00:00:00+05:30";
const venueName = "Porwal Community Center & Marriage Garden";
const venueAddress = "4RGX+GQ2, Subhash Nagar First, Rangbari, Kota, Rajasthan 324005";

export const wedding = {
  couple: {
    groom: groomName,
    bride: brideName,
    namesDisplay: coupleNames,
    /** Optional family lines; leave blank until names and wording are confirmed. */
    groomsParents: "",
    bridesParents: "",
  },
  /** Wedding day and timezone used by the date reveal and countdown. */
  countdownIso: weddingDateIso,
  timeZone: "Asia/Kolkata",
  tagline: "We're getting married",
  saveTheDateLabel: "Save the Date",
  invitationMessage:
    `${coupleNames} warmly invite you to share in the joy of their wedding.`,
  heroMessage: "Together with their families, they invite you to celebrate a beautiful beginning.",
  familyBlessing:
    "May your life together be filled with laughter, patience, and a love that grows deeper with every passing year.",
  familySignoff: "With love, our families",
  interlude: {
    eyebrow: "A moment to celebrate",
    title: "Two hearts. One beautiful beginning.",
    body: "A celebration made brighter by the people who mean the most.",
  },
  closingMessage: "We look forward to celebrating with you.",
  story: {
    // Keep this optional section hidden until the couple supplies real copy.
    enabled: false,
    eyebrow: "A note from us",
    title: "Our forever begins",
    body: "",
  },
  venue: {
    confirmed: true,
    name: venueName,
    address: venueAddress,
    /** Used for the embedded map and directions link. */
    mapsQuery: `${venueName}, ${venueAddress}`,
    note: "",
  },
  travel: {
    confirmed: false,
    note: "Travel and parking information will be shared here once the venue arrangements are confirmed.",
    details: [] as TravelDetail[],
  },
  /** Optional background music file under public/, e.g. "/audio/wedding.mp3". */
  music: {
    src: "",
  },
  events: [
    {
      id: "haldi",
      name: "Haldi",
      configured: true,
      date: "2026-11-19",
      time: "10:00 AM",
      theme: "Pista green",
      venue: "",
      description: "",
    },
    {
      id: "mayra",
      name: "Mayra",
      configured: true,
      date: "2026-11-19",
      time: "1:00 PM",
      venue: "",
      description: "",
    },
    {
      id: "sangeet",
      name: "Sangeet",
      configured: true,
      date: "2026-11-19",
      time: "7:00 PM",
      venue: "",
      description: "",
    },
    {
      id: "sagai",
      name: "Sagai",
      configured: true,
      date: "2026-11-20",
      time: "11:00 AM",
      venue: "",
      description: "",
    },
    {
      id: "reception",
      name: "Reception",
      configured: true,
      date: "2026-11-20",
      time: "8:00 PM",
      venue: "",
      description: "",
    },
  ] satisfies WeddingEvent[],
  rsvp: {
    enabled: true,
    headline: "Kindly respond",
    intro: "Please let us know if you will celebrate with us. We cannot wait to hear from you.",
    /** Optional contact detail shown below the RSVP form. */
    contactNote: "",
    thankYouAttending: "Thank you, {name}. We're delighted you'll be with us. Your presence will make our celebration even more special.",
    thankYouDeclining: "Thank you for letting us know, {name}. We'll miss having you with us and send you our love.",
  },
  share: {
    title: `${coupleNames} — Wedding Invitation`,
    text: `You are invited to celebrate the wedding of ${coupleNames}.`,
  },
  siteName: `${coupleNames} Wedding`,
} as const;

export type WeddingConfig = typeof wedding;
