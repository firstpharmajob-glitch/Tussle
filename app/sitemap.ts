import type { MetadataRoute } from "next";

const siteUrl = "https://www.lovetussle.com";
const pages = [
  "",
  "concepts/dusk-sofa-bed.html",
  "concepts/hold-chair.html",
  "concepts/kandariya-floor-lounger.html",
  "concepts/love-glide-sofa.html",
  "concepts/lowlight-coffee-table.html",
  "concepts/nightshift-desk.html",
  "concepts/room-9sqm.html",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path, index) => ({
    url: path ? `${siteUrl}/${path}` : `${siteUrl}/`,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.6,
  }));
}
