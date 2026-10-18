import type { MetadataRoute } from "next";
import { wedding } from "@/config/wedding";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: wedding.siteName,
    short_name: wedding.couple.namesDisplay,
    description: wedding.share.text,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fbf8f3",
    theme_color: "#fbf8f3",
    icons: [
      { src: "/icons/wedding-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/wedding-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
