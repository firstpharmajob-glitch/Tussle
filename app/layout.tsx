import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lovetussle.com"),
  title: "Tussle Furniture Co. (Love Tussle) | Furniture for Home Life",
  description:
    "Love Tussle, also known as Tussle Furniture Co., makes furniture that looks right at home by day and works harder at night. Private packaging, neutral billing, delivered across India.",
  applicationName: "Tussle Furniture Co.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Tussle Furniture Co. (Love Tussle)",
    title: "Tussle Furniture Co. (Love Tussle) | Furniture for Home Life",
    description:
      "Love Tussle, also known as Tussle Furniture Co., makes furniture that looks right at home by day and works harder at night. Private packaging, neutral billing, delivered across India.",
  },
  twitter: {
    card: "summary",
    title: "Tussle Furniture Co. (Love Tussle) | Furniture for Home Life",
    description:
      "Love Tussle, also known as Tussle Furniture Co., makes furniture that looks right at home by day and works harder at night. Private packaging, neutral billing, delivered across India.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
