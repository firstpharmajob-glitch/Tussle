import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lovetussle.com"),
  title: "Lights out. Tussle on.",
  description:
    "Looks like lovely furniture by day. After dark, it has a few tricks up its sleeve. Meet Tussle's playful interactive furniture concepts.",
  applicationName: "Tussle Furniture Co.",
  verification: {
    google: "yMVLkQQ2z2hqapWAxXvPVVdiUb5SHZVMYwHd-7ct6cI",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Tussle Furniture Co.",
    title: "Lights out. Tussle on.",
    description:
      "Looks like lovely furniture by day. After dark, it has a few tricks up its sleeve. Meet Tussle's playful interactive furniture concepts.",
  },
  twitter: {
    card: "summary",
    title: "Lights out. Tussle on.",
    description:
      "Looks like lovely furniture by day. After dark, it has a few tricks up its sleeve. Meet Tussle's playful interactive furniture concepts.",
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
