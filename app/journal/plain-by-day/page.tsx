import type { Metadata } from "next";
import Link from "next/link";

const articleUrl = "https://www.lovetussle.com/journal/plain-by-day";

export const metadata: Metadata = {
  title: "Plain by Day: A History of Furniture Made for Intimacy | Tussle",
  description:
    "A thoughtful look at how beds, screens, swings and flexible rooms have made space for comfort, privacy and closeness across cultures.",
  alternates: {
    canonical: "/journal/plain-by-day",
  },
  openGraph: {
    type: "article",
    url: articleUrl,
    title: "Plain by Day: A History of Furniture Made for Intimacy",
    description:
      "How everyday furniture has made room for comfort, privacy and closeness across cultures.",
  },
};

const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Plain by Day: A History of Furniture Made for Intimacy",
  description:
    "How everyday furniture has made room for comfort, privacy and closeness across cultures.",
  mainEntityOfPage: articleUrl,
  publisher: {
    "@type": "Organization",
    name: "Tussle Furniture Co.",
    url: "https://www.lovetussle.com/",
  },
};

export default function PlainByDayPage() {
  return (
    <main className="journal-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <div className="journal-wrap">
        <nav className="journal-nav" aria-label="Article navigation">
          <Link href="/journal" className="journal-home">
            Tussle Journal
          </Link>
          <Link href="/">Back to Tussle</Link>
        </nav>
        <article className="journal-article">
          <header className="journal-article-header">
            <p className="eyebrow">Design &amp; history · 9 min read</p>
            <h1>Plain by Day: A History of Furniture Made for Intimacy</h1>
            <p className="journal-deck">
              From ancient sleeping platforms to South Indian swings and curtained
              beds, furniture has long shaped how people rest, gather and find privacy.
            </p>
          </header>

          <div className="journal-prose">
            <p>
              Intimacy doesn’t always announce itself. Sometimes it’s a softer light,
              a familiar seat, or a curtain drawn across a shared room. The history of
              furniture is full of these quiet gestures: objects that make everyday
              life more comfortable, and give people a little room of their own.
            </p>
            <p>
              This isn’t one universal story. Homes, customs and ideas about privacy
              have differed across time and place. But looking at furniture itself
              reveals a few recurring ideas: make a place to rest, make it warm, and
              let a room change with the moment.
            </p>

            <h2>Before beds: making a place to rest</h2>
            <p>
              The earliest sleeping places rarely survive as furniture. At Sibudu
              Cave in South Africa, researchers found ancient layers of plant bedding
              made from sedges and other vegetation. The find is tens of thousands
              of years old and reminds us that comfort began with arranging what was
              close at hand, long before a wooden bed could be made.
            </p>
            <p>
              Much later, at Çatalhöyük in present-day Türkiye, homes were built with
              raised interior platforms. Archaeologists interpret these spaces as
              serving several parts of domestic life, including rest. Even before a
              room had separate furniture for every task, its built surfaces helped
              organise daily life.
            </p>

            <h2>Mesopotamia: a bed in the poem</h2>
            <p>
              Some of the earliest surviving love poetry comes from Sumerian
              traditions. In songs associated with Inanna and Dumuzi, the prepared
              bed is part of the scene: domestic objects and the act of making a
              room ready become part of the poem. Scholars differ on how these
              songs related to ritual, so it is safer to read them as literary
              evidence than as a literal floor plan.
            </p>
            <p>
              Clay plaques from ancient Mesopotamia also show people on beds. They
              are small objects, but the raised frame is familiar: a piece of
              furniture made visible and meaningful enough to be represented.
              Between a poem and a clay model, we see that the bed was more than a
              place to sleep—it belonged to the imagination of home.
            </p>

            <h2>Egypt: beds made for life and afterlife</h2>
            <p>
              Egyptian beds were raised frames, often with woven supports, and
              sleepers could rest their heads on a shaped wooden headrest. Furniture
              placed in tombs—including folding-bed models—shows that makers gave
              thought to portability, materials and the afterlife as well as daily
              comfort. The object pictured here is a model, not a full-sized bed.
            </p>
            <figure className="journal-figure">
              <img
                src="/journal/model-folding-bed.webp"
                alt="A small ancient Egyptian model of a folding bed, shown extended."
                width="734"
                height="349"
                loading="lazy"
              />
              <figcaption>
                Model of a folding bed, shown extended. The Metropolitan Museum of Art,
                CC0, via{" "}
                <a
                  href="https://commons.wikimedia.org/wiki/File:Model_of_a_Folding_Bed_MET_20.2.13_acc2.jpg"
                  target="_blank"
                  rel="noreferrer"
                >
                  Wikimedia Commons
                </a>
                .
              </figcaption>
            </figure>
            <p>
              Another striking object from Egypt is Tutankhamun’s gilded,
              bed-shaped bier. It has a woven-looking surface and lion details,
              but it supported the king’s nested coffins inside his sarcophagus;
              it was not a bed for sleeping. That distinction matters, even as its
              form shows how familiar furniture shapes could carry funerary meaning.
            </p>
            <figure className="journal-figure">
              <img
                src="/journal/tutankhamun-bier.webp"
                alt="Tutankhamun’s gilded bed-shaped funerary bier, with a woven-looking surface and carved lion heads."
                width="1000"
                height="485"
                loading="lazy"
              />
              <figcaption>
                Gilded wooden bier from Tutankhamun’s tomb, now in the Egyptian Museum,
                Cairo. Photo by{" "}
                <a
                  href="https://www.flickr.com/photos/menesje/2284096729/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Hans Ollermann
                </a>
                , licensed under{" "}
                <a
                  href="https://creativecommons.org/licenses/by/2.0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  CC BY 2.0
                </a>
                ; via{" "}
                <a
                  href="https://commons.wikimedia.org/wiki/File:Tutankhamun%27s_bed_(Cairo_Museum).jpg"
                  target="_blank"
                  rel="noreferrer"
                >
                  Wikimedia Commons
                </a>
                . Resized for the web.
              </figcaption>
            </figure>

            <h2>Greece and Etruria: the couch as a social room</h2>
            <p>
              A Greek <em>kline</em> was a raised couch for reclining, often shown
              with cushions and a small table nearby. At a symposium, a row of these
              couches turned a room into a place for eating, conversation and music.
              Painted pottery is one of the ways we can still see how people sat,
              what they placed beside them and how furniture shaped a gathering.
            </p>
            <figure className="journal-figure">
              <img
                src="/journal/greek-stamnos.webp"
                alt="Ancient Greek red-figure pottery showing people reclining on a couch."
                width="1100"
                height="1370"
                loading="lazy"
              />
              <figcaption>
                Red-figure stamnos with reclining figures, Brooklyn Museum. Licensed
                under{" "}
                <a
                  href="https://creativecommons.org/licenses/by/3.0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  CC BY 3.0
                </a>
                ; see the{" "}
                <a href="https://www.brooklynmuseum.org/opencollection/objects/16052">
                  museum record
                </a>
                .
              </figcaption>
            </figure>
            <p>
              Etruscan tomb paintings also preserve banquet scenes, often showing
              women and men reclining at the same gathering. They suggest that a
              couch could be both a practical seat and a stage for social customs.
              What survives is a partial record, shaped by the people who could
              afford painted tombs and the objects chosen to accompany them.
            </p>

            <h2>Rome: beds for rooms, rituals and daily rest</h2>
            <p>
              Roman homes used different kinds of beds for different purposes. A
              small bedroom, or <em>cubiculum</em>, might hold a sleeping couch,
              while dining rooms were arranged around reclining couches. Household
              traditions also gave a special meaning to the <em>lectus genialis</em>,
              associated with marriage and the family. The surviving stone platforms
              at Pompeii hint at how sleeping furniture fitted into compact rooms,
              though the soft furnishings that once made them comfortable have mostly
              disappeared.
            </p>
            <p>
              Ovid’s <em>Ars Amatoria</em> is a witty Roman poem about courtship and
              social life, not a furniture manual. Read alongside archaeological
              remains, it reminds us that rooms and objects were part of a larger
              conversation about domestic behaviour.
            </p>

            <h2>India: a room for rest, a swing for gathering</h2>
            <p>
              The <em>Kama Sutra</em> is much more than its popular shorthand
              suggests: it discusses the arts and routines of household life as well
              as relationships. In its description of a well-appointed bedroom, the
              bed, pillows, canopy and nearby furnishings help set a scene of ease.
              The text’s date and authorship are not certain, so it is best read as
              one historical voice rather than a description of every Indian home.
            </p>
            <p>
              A swing—called <em>uyyala</em> in Telugu and <em>oonjal</em> in Tamil
              and Malayalam usage—can be furniture and a social ritual at once. In
              some South Indian wedding customs, the couple sits together on a swing
              as part of the ceremony. In everyday homes, swings also serve as places
              to pause, talk and rest.
            </p>
            <figure className="journal-figure">
              <img
                src="/journal/indian-swing.webp"
                alt="A carved wooden swing suspended from the ceiling in a home."
                width="1024"
                height="768"
                loading="lazy"
              />
              <figcaption>
                A carved wooden swing in a home. Photo by{" "}
                <a
                  href="https://www.flickr.com/photos/42617558@N00/3710444057"
                  target="_blank"
                  rel="noreferrer"
                >
                  sytelus
                </a>
                , licensed under{" "}
                <a
                  href="https://creativecommons.org/licenses/by/2.0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  CC BY 2.0
                </a>
                . Resized for the web.
              </figcaption>
            </figure>
            <p>
              Later paintings and poetry across the subcontinent show terraces and
              rooms softened with carpets, bolsters, canopies and lamps. The simple
              rope-strung <em>charpai</em>, meanwhile, remains a practical bed in
              many places. Together these forms show how furniture can move between
              indoors and outdoors, family life and quiet retreat.
            </p>

            <h2>China and Korea: warmth close to the floor</h2>
            <p>
              In northern China, the <em>kang</em> is a raised platform warmed from
              below. It can be a place for sitting, sleeping, eating and spending
              time together. In Korea, <em>ondol</em> underfloor heating makes the
              floor itself a warm surface for daily life, with mats and bedding
              brought out as needed. In both cases, the room’s architecture does
              some of the work that a separate bed or sofa might do elsewhere.
            </p>
            <p>
              Later Chinese interiors also developed elaborate canopy beds and
              daybeds. Some enclosed beds included shelves and small spaces around
              the sleeping platform, making the bed feel almost like a room within a
              room. Furniture here was not only decoration; it helped organise how
              people rested and used a shared interior.
            </p>

            <h2>Japan: screens, futons and rooms that shift</h2>
            <p>
              Screens and curtains have long offered ways to divide Japanese rooms
              without building permanent walls. Bedding can be laid out at night and
              stored away during the day, leaving the same tatami room ready for
              another use. This flexible arrangement makes the room—not just the
              furniture—part of the design.
            </p>
            <figure className="journal-figure">
              <img
                src="/journal/japanese-byobu.webp"
                alt="A painted Japanese folding screen displayed with a traditional flower arrangement."
                width="1024"
                height="659"
                loading="lazy"
              />
              <figcaption>
                Japanese folding screen and flower arrangement. Photo by{" "}
                <a
                  href="https://www.flickr.com/photos/72859063@N00/6008139004"
                  target="_blank"
                  rel="noreferrer"
                >
                  Nullumayulife
                </a>
                , licensed under{" "}
                <a
                  href="https://creativecommons.org/licenses/by/2.0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  CC BY 2.0
                </a>
                . Resized for the web.
              </figcaption>
            </figure>
            <p>
              Japanese prints and paintings preserve details of domestic interiors:
              bedding, lanterns, low tables and screens. They are images made for
              different purposes, so they should not be treated as straightforward
              photographs of everyday life. Still, they give us a rich visual record
              of how furniture and privacy could share a room.
            </p>

            <h2>Across Africa and the Americas: more than one archive</h2>
            <p>
              Written records and surviving furniture do not tell the whole story.
              Moche potters in ancient Peru made distinctive ceramic vessels, while
              Swahili coastal homes developed their own traditions of carved beds
              and domestic display. These different material records broaden the
              story beyond the better-known European and Asian examples, even
              where we should be cautious about drawing conclusions from a small
              surviving sample.
            </p>
            <h2>Arabian, Persian and Ottoman rooms: privacy in layers</h2>
            <p>
              Across the Arab world, Persia and the Ottoman realms, domestic
              interiors varied widely by period, region and household. Carpets,
              cushions, low seating and textiles could make a room comfortable
              without fixing it around a single large piece of furniture. Screens
              and alcoves offered quieter zones within shared homes, while
              courtyards brought light and air into the daily rhythm of the house.
            </p>
            <p>
              The useful design lesson is not that these interiors all looked alike,
              but that softness and separation could come from layers: a rug under
              foot, a curtain at an opening, or seating arranged to make a smaller
              conversation within a larger room.
            </p>

            <h2>Medieval and Renaissance Europe: the bed as a room</h2>
            <p>
              In medieval Europe, a bed could be one of the most valuable objects
              in a household. Curtains around it offered warmth and privacy in rooms
              that might also be used for work, meals or receiving visitors. A
              grand bedstead with a canopy made a clear centre in the room and
              signalled status as well as comfort.
            </p>
            <p>
              By the Renaissance, richly carved frames and elaborate textiles made
              beds into architectural statements. The Great Bed of Ware, made
              around 1590, is an extraordinary surviving example: its scale and
              decoration tell us as much about hospitality and reputation as they
              do about sleep. It was famous enough to be mentioned by Shakespeare.
            </p>
            <figure className="journal-figure">
              <img
                src="/journal/great-bed.webp"
                alt="The Great Bed of Ware, a large carved and curtained bed with red and gold fabric."
                width="1400"
                height="1050"
                loading="lazy"
              />
              <figcaption>
                The Great Bed of Ware, made around 1590. Photo by{" "}
                <a
                  href="https://www.flickr.com/photos/londonmatt/54541737873/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Matt Brown
                </a>
                , licensed under{" "}
                <a
                  href="https://creativecommons.org/licenses/by/2.0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  CC BY 2.0
                </a>
                ; via{" "}
                <a
                  href="https://commons.wikimedia.org/wiki/File:The_Great_Bed_of_Ware,_V%26A_-_2025-05-15.jpg"
                  target="_blank"
                  rel="noreferrer"
                >
                  Wikimedia Commons
                </a>
                . Resized for the web.
              </figcaption>
            </figure>

            <h2>18th and 19th centuries: bedrooms become more private</h2>
            <p>
              As homes and social expectations changed, bedrooms gradually became
              more specialised and private for some households. Upholstered
              headboards, decorative bed hangings, dressing furniture and bedside
              tables made the room feel more personal. The shift was uneven: class,
              housing and access to space shaped who could claim a room of their
              own.
            </p>
            <p>
              French furniture makers developed the <em>duchesse brisée</em>, a
              multi-part reclining seat that let someone stretch out while remaining
              part of the room. This Louvre example, made around 1760–1765, shows the
              form as a richly upholstered chaise with a separate footrest. It offers
              a different kind of intimacy: a place to read or rest within a shared
              room.
            </p>
            <figure className="journal-figure">
              <img
                src="/journal/duchesse-brisee.webp"
                alt="An ornate 18th-century French duchesse brisée chaise longue and separate footrest in a decorated room."
                width="900"
                height="1200"
                loading="lazy"
              />
              <figcaption>
                <em>Duchesse brisée</em> from the Hôtel de Vallemaré-Dangé, Paris,
                circa 1760–1765; Louvre, inventory OA 6493. Photo by{" "}
                <a
                  href="https://commons.wikimedia.org/wiki/User:Tangopaso"
                  target="_blank"
                  rel="noreferrer"
                >
                  Tangopaso
                </a>
                ; public domain, via{" "}
                <a
                  href="https://commons.wikimedia.org/wiki/File:Duchesse_bris%C3%A9e_de_l%27h%C3%B4tel_de_Vallemar%C3%A9-Dang%C3%A9_(Louvre,_OA_6493).jpg"
                  target="_blank"
                  rel="noreferrer"
                >
                  Wikimedia Commons
                </a>
                . Resized for the web.
              </figcaption>
            </figure>
            <p>
              In the same centuries, fashionable interiors used screens, sofas and
              small intimate rooms to create settings for private conversation.
              Some commercial pleasure-house interiors were designed around
              sociability and discretion; they were one part of a much broader
              history of urban entertainment, not a template for domestic life.
            </p>

            <h2>20th century to now: intimacy in smaller rooms</h2>
            <p>
              Modern housing brought new constraints and possibilities. Apartments
              and smaller bedrooms made adaptable furniture increasingly useful:
              sofa beds, folding screens, built-in storage and compact lounge
              seating. In the later 20th century, designers often treated the home
              as a place for both retreat and connection, rather than separating
              those needs into formal rooms.
            </p>
            <p>
              Today, a considered bedroom or living space can offer privacy without
              feeling closed off. Curtains, a reading chair, a warm pool of light
              or a well-placed screen can shift the atmosphere without changing
              the whole room.
            </p>

            <h2>Privacy is part of the design</h2>
            <p>
              Curtains, canopies, folding screens and alcoves all do something
              practical: they soften a boundary. They let people decide what is
              visible, create a sense of enclosure, and make a corner feel distinct
              without building a new room. Different cultures found different
              answers to the same question: how much togetherness does this moment
              need?
            </p>
            <p>
              That idea still feels useful today. A piece can look at ease in the
              room and still offer a little more
              comfort, support or flexibility when it is needed. The best solution
              might be a well-placed seat, a softer light or a layout that gives
              people options.
            </p>

            <h2>Everyday by design</h2>
            <p>
              Across these examples, intimacy is less about spectacle than
              consideration: a place to lean, a little privacy, room to adapt.
              Furniture can support closeness without announcing it. It can be
              ordinary by day and quietly thoughtful whenever life asks for
              something different.
            </p>
            <p>
              That is a design idea worth keeping: make things that feel at home in
              the everyday, and let the people who live with them decide what those
              moments become.
            </p>

            <aside className="journal-reading" aria-labelledby="journal-reading-title">
              <h2 id="journal-reading-title">Further reading</h2>
              <ul>
                <li>
                  Lyn Wadley et al., “Middle Stone Age Bedding Construction and
                  Settlement Patterns at Sibudu, South Africa,”{" "}
                  <a
                    href="https://doi.org/10.1126/science.1213317"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <em>Science</em> (2011)
                  </a>
                  .
                </li>
                <li>
                  <a
                    href="https://www.catalhoyuk.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Çatalhöyük Research Project
                  </a>
                  , for archaeological research at the site.
                </li>
                <li>
                  <a
                    href="https://global.oup.com/academic/product/kama-sutra-9780199539169"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <em>The Kama Sutra</em>
                  </a>
                  , translated by Wendy Doniger and Sudhir Kakar (Oxford World’s
                  Classics, 2002).
                </li>
                <li>
                  Ovid,{" "}
                  <a
                    href="https://www.perseus.tufts.edu/hopper/searchresults?q=Ovid%20Ars%20Amatoria"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <em>Ars Amatoria</em>
                  </a>
                  .
                </li>
                <li>
                  Timon Screech,{" "}
                  <a
                    href="https://search.worldcat.org/search?q=Timon+Screech+Sex+and+the+Floating+World"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <em>Sex and the Floating World</em>
                  </a>{" "}
                  (1999).
                </li>
                <li>
                  Robert van Gulik,{" "}
                  <a
                    href="https://search.worldcat.org/search?q=Robert+van+Gulik+Sexual+Life+in+Ancient+China"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <em>Sexual Life in Ancient China</em>
                  </a>{" "}
                  (1961).
                </li>
              </ul>
            </aside>
          </div>
        </article>
        <footer className="journal-footer">
          <Link href="/journal">More from the Tussle Journal</Link>
          <Link href="/">Explore Tussle</Link>
        </footer>
      </div>
    </main>
  );
}
