import Storefront from "./storefront";
import { storefrontNodes } from "./storefront-content";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.lovetussle.com/#organization",
      name: "Tussle Furniture Co.",
      alternateName: ["Tussle", "Love Tussle", "Lovetussle"],
      url: "https://www.lovetussle.com/",
      logo: "https://www.lovetussle.com/icon.png",
      sameAs: [
        "https://www.instagram.com/lovetussle/",
        "https://www.facebook.com/profile.php?id=61596574044874",
      ],
      description:
        "Tussle Furniture Co. presents playful furniture concepts that feel at home by day and reveal thoughtful details after dark.",
      email: "lovetussle@gmail.com",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.lovetussle.com/#website",
      name: "Tussle Furniture Co. (Love Tussle)",
      alternateName: ["Tussle", "Love Tussle", "Lovetussle"],
      url: "https://www.lovetussle.com/",
      description:
        "Tussle Furniture Co. (also known as Love Tussle or Lovetussle) presents playful furniture concepts for everyday life, with thoughtful details that reveal themselves after dark and interactive 3D previews.",
      inLanguage: "en-IN",
      publisher: { "@id": "https://www.lovetussle.com/#organization" },
    },
    {
      "@type": "WebPage",
      "@id": "https://www.lovetussle.com/#webpage",
      url: "https://www.lovetussle.com/",
      name: "Tussle Furniture Co. (Love Tussle) | Official Site",
      description:
        "The official home of Tussle Furniture Co., also known as Love Tussle. Explore the collection, interactive 3D concepts and design stories.",
      isPartOf: { "@id": "https://www.lovetussle.com/#website" },
      about: { "@id": "https://www.lovetussle.com/#organization" },
      mainEntity: { "@id": "https://www.lovetussle.com/#concepts" },
    },
    {
      "@type": "ItemList",
      "@id": "https://www.lovetussle.com/#concepts",
      name: "Tussle interactive furniture and room concepts",
      description:
        "Interactive 3D concept previews from Tussle Furniture Co. for home life, designed to look right by day and work harder at night. Concepts are not confirmed product specifications or availability.",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Dusk sofa-bed",
          url: "https://www.lovetussle.com/concepts/dusk-sofa-bed.html",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Kandariya Floor Lounger",
          url: "https://www.lovetussle.com/concepts/kandariya-floor-lounger.html",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Love Glide sofa",
          url: "https://www.lovetussle.com/concepts/love-glide-sofa.html",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Lowlight coffee table",
          url: "https://www.lovetussle.com/concepts/lowlight-coffee-table.html",
        },
        {
          "@type": "ListItem",
          position: 5,
          name: "Simhasana",
          url: "https://www.lovetussle.com/concepts/simhasana.html",
        },
        {
          "@type": "ListItem",
          position: 6,
          name: "Nightshift desk",
          url: "https://www.lovetussle.com/concepts/nightshift-desk.html",
        },
        {
          "@type": "ListItem",
          position: 7,
          name: "Tarang",
          url: "https://www.lovetussle.com/concepts/tarang.html",
        },
        {
          "@type": "ListItem",
          position: 8,
          name: "The Tussle house",
          url: "https://www.lovetussle.com/concepts/tussle-house.html",
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Storefront nodes={storefrontNodes} />
    </>
  );
}
