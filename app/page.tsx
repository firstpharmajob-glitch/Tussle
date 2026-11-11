import Storefront from "./storefront";
import { storefrontNodes } from "./storefront-content";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.lovetussle.com/#organization",
      name: "Tussle Furniture Co.",
      alternateName: "Lovetussle",
      url: "https://www.lovetussle.com/",
      logo: "https://www.lovetussle.com/icon.png",
      sameAs: [
        "https://www.instagram.com/lovetussle/",
        "https://www.facebook.com/profile.php?id=61596574044874",
      ],
      description:
        "Tussle Furniture Co. is a furniture brand presenting thoughtful furniture concepts for different homes and lifestyles, including compact spaces.",
      email: "lovetussle@gmail.com",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.lovetussle.com/#website",
      name: "Tussle Furniture Co.",
      alternateName: "Lovetussle",
      url: "https://www.lovetussle.com/",
      description:
        "Tussle Furniture Co., also known as Lovetussle, presents thoughtful furniture concepts for different homes and lifestyles, with interactive 3D previews.",
      inLanguage: "en-IN",
      publisher: { "@id": "https://www.lovetussle.com/#organization" },
    },
    {
      "@type": "WebPage",
      "@id": "https://www.lovetussle.com/#webpage",
      url: "https://www.lovetussle.com/",
      name: "Tussle Furniture Co. | Furniture for Every Home",
      isPartOf: { "@id": "https://www.lovetussle.com/#website" },
      about: { "@id": "https://www.lovetussle.com/#organization" },
      mainEntity: { "@id": "https://www.lovetussle.com/#concepts" },
    },
    {
      "@type": "ItemList",
      "@id": "https://www.lovetussle.com/#concepts",
      name: "Tussle interactive furniture and room concepts",
      description:
        "Interactive 3D concept previews from Tussle Furniture Co. for different homes and lifestyles. These concepts are not confirmed product specifications or availability.",
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
          name: "Hold chair",
          url: "https://www.lovetussle.com/concepts/hold-chair.html",
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
          name: "The 9 m² room",
          url: "https://www.lovetussle.com/concepts/room-9sqm.html",
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
