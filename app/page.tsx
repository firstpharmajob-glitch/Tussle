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
      email: "lovetussle@gmail.com",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.lovetussle.com/#website",
      name: "Tussle Furniture Co.",
      alternateName: "Lovetussle",
      url: "https://www.lovetussle.com/",
      description:
        "Tussle Furniture Co., also known as Lovetussle, presents furniture for small spaces in India with interactive 3D concept previews.",
      inLanguage: "en-IN",
      publisher: { "@id": "https://www.lovetussle.com/#organization" },
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
