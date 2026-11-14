import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tussle Journal | Ideas for living",
  description:
    "Stories about furniture, rooms and the small details that make a home feel like yours.",
  alternates: {
    canonical: "/journal",
  },
};

export default function JournalPage() {
  return (
    <main className="journal-page">
      <div className="journal-wrap">
        <nav className="journal-nav" aria-label="Journal navigation">
          <Link href="/" className="journal-home">
            Tussle Furniture Co.
          </Link>
          <Link href="/">Back to the home</Link>
        </nav>
        <header className="journal-heading">
          <p className="eyebrow">The Tussle journal</p>
          <h1>Ideas for living.</h1>
          <p className="journal-intro">
            Notes on furniture, rooms and the stories we make at home.
          </p>
        </header>
        <article className="journal-card">
          <p className="eyebrow">Design &amp; history · 4 min read</p>
          <h2>
            <Link href="/journal/plain-by-day">
              Plain by Day: A History of Furniture Made for Intimacy
            </Link>
          </h2>
          <p>
            From a shared floor to a curtained bed, explore how everyday furniture has
            made room for privacy, comfort and closeness across cultures.
          </p>
          <Link className="journal-read-link" href="/journal/plain-by-day">
            Read the story <span aria-hidden="true">→</span>
          </Link>
        </article>
        <footer className="journal-footer">
          <Link href="/">Tussle Furniture Co.</Link>
        </footer>
      </div>
    </main>
  );
}
