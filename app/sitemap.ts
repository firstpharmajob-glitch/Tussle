import type { MetadataRoute } from "next";

const siteUrl = "https://www.lovetussle.com";
const pages = [
  "",
  "journal",
  "journal/plain-by-day",
  "concepts/dusk-sofa-bed.html",
  "concepts/simhasana.html",
  "concepts/kandariya-floor-lounger.html",
  "concepts/love-glide-sofa.html",
  "concepts/lowlight-coffee-table.html",
  "concepts/nightshift-desk.html",
  "concepts/tarang.html",
  "concepts/tussle-house.html",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path, index) => ({
    url: path ? `${siteUrl}/${path}` : `${siteUrl}/`,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.6,
  }));
}
