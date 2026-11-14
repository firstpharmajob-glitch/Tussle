"use client";

import {
  Fragment,
  createContext,
  createElement,
  type CSSProperties,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MarkupNode } from "./storefront-content";

const CART_KEY = "tussle-cart-v1";
const FREE_DELIVERY_THRESHOLD = 5000;

type CartItem = { p: number; q: number };
type Cart = Record<string, CartItem>;

const products = [
  {
    name: "Kandariya Floor Lounger",
    price: null,
    preview: "/concepts/kandariya-floor-lounger.html",
    description: "A low floor lounger that opens into a wide, firm bed.",
    features: [
      "Opens into a wide bed",
      "Lock-in support wedges",
      "Removable comfort kit",
      "Hidden drawer",
    ],
  },
  {
    name: "Lowlight coffee table",
    price: 14900,
    preview: "/concepts/lowlight-coffee-table.html",
    description:
      "A walnut coffee table with a reversible padded top, a lower shelf, and Night Deck for two.",
    features: [
      "Walnut top with padded reverse",
      "Brass legs and shadow line",
      "Lower shelf for essentials",
      "Night Deck card game for two",
    ],
  },
  {
    name: "Simhasana",
    price: null,
    preview: "/concepts/simhasana.html",
    description:
      "A wide lounge chair that looks like plain furniture by day. At night, the back reclines, a footstool docks flush, and the light turns warm.",
    features: [
      "Three locked recline angles",
      "Removable, washable comfort pieces",
      "Docking footstool",
      "Five chenille colour options",
    ],
  },
  {
    name: "Nightshift desk",
    price: 21900,
    preview: "/concepts/nightshift-desk.html",
    description: "A work desk with fixed legs and a lift-off top.",
    features: [
      "Fixed 58 cm legs",
      "Lift-off reversible top",
      "Padded, wipeable side",
      "Wood finish for daytime",
    ],
  },
  {
    name: "Tarang",
    price: null,
    preview: "/concepts/tarang.html",
    description:
      "A channel-quilted bench that transforms into a contoured wave, with a hidden drawer.",
    features: [
      "Looks like a bench by day",
      "Transforms into a contoured wave",
      "Hidden drawer in the plinth",
      "Five upholstery colours",
    ],
  },
] as const;

const productNames = new Set<string>(products.map(({ name }) => name));

const updatedStoreCopy: Record<string, string> = {
  "How much space does the Hush desk need?":
    "Are these 3D previews final product specifications?",
  "It is 12 cm deep when closed, so it sits almost flat against the wall.":
    "No. The 3D models are concept previews; dimensions and load ratings shown in them are placeholders, not confirmed product specifications.",
  "Made for small rooms and big lives": "Why Tussle",
  "Hostel rooms, shared flats, first apartments. We design for the space you actually have.":
    "Looks right at home by day. A little more thoughtful after dark.",
  "Small-room smart": "Looks like furniture, because it is.",
  "Every piece does at least two jobs, so one room can be a bedroom, an office and a place to have friends over.":
    "Every piece suits an ordinary room by day, with nothing on show that needs explaining.",
  "Hides the mess": "Made for the night shift too.",
  "Storage you can’t see means a room that looks calm, even on the days it isn’t.":
    "Firm support, wipeable surfaces and hidden storage for the things you'd rather keep close.",
  "Rental friendly": "Yours alone to know about.",
  "Flat-packed and tool-light, so moving day takes an afternoon instead of a week.":
    "Plain boxes, neutral billing and quiet delivery. What you buy is your business.",
  "9 m² hostel room": "Living alone, finally",
  "The desk folds away so the bed isn’t the whole room.":
    "A place that’s entirely yours, on your terms.",
  "Shared flat, Gachibowli": "Shared flat",
  "Your corner, tidy, even when the living room isn’t.":
    "Your corner, tidy, even when the living room isn’t.",
};

type StorefrontProps = {
  nodes: MarkupNode[];
};

type MarkupElement = Exclude<MarkupNode, string>;

function isElement(node: MarkupNode): node is MarkupElement {
  return typeof node !== "string";
}

function attr(node: MarkupElement, name: string): string {
  const value = node.attrs[name];
  return typeof value === "string" ? value : "";
}

function hasClass(node: MarkupElement, className: string): boolean {
  return attr(node, "className").split(/\s+/).includes(className);
}

function textContent(node: MarkupNode): string {
  if (!isElement(node)) return node;
  return node.children.map(textContent).join("");
}

function findTextByTag(node: MarkupElement, tag: string): string {
  for (const child of node.children) {
    if (isElement(child)) {
      if (child.tag === tag) return textContent(child).trim();
      const found = findTextByTag(child, tag);
      if (found) return found;
    }
  }
  return "";
}

function findPrice(node: MarkupElement): string {
  for (const child of node.children) {
    if (isElement(child)) {
      if (hasClass(child, "price")) {
        return textContent(child).trim();
      }
      const found = findPrice(child);
      if (found) return found;
    }
  }
  return "";
}

type MarkupRenderer = (node: MarkupElement, key: string) => ReactNode;

function renderMarkup(
  nodes: MarkupNode[],
  replace?: MarkupRenderer,
  prefix = "node",
): ReactNode[] {
  return nodes.map((node, index) => {
    if (!isElement(node)) return updatedStoreCopy[node] ?? node;
    const key = `${prefix}-${index}`;
    const replacement = replace?.(node, key);
    if (replacement !== undefined) return createElement(Fragment, { key }, replacement);
    return createElement(
      node.tag,
      { ...node.attrs, key },
      ...renderMarkup(node.children, replace, key),
    );
  });
}

function usePreviewVisibility(iframeRef: { current: HTMLIFrameElement | null }) {
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !("IntersectionObserver" in window)) return;

    let visible = false;
    const sendVisibility = () => {
      iframe.contentWindow?.postMessage(
        { type: "tussle:visibility", visible },
        window.location.origin,
      );
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sendVisibility();
    });
    const onLoad = () => sendVisibility();

    iframe.addEventListener("load", onLoad);
    observer.observe(iframe);

    return () => {
      iframe.removeEventListener("load", onLoad);
      observer.disconnect();
    };
  }, [iframeRef]);
}

function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function ConceptPreview({
  src,
  title,
  room = false,
}: {
  src: string;
  title: string;
  room?: boolean;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  usePreviewVisibility(iframeRef);

  return (
    <iframe
      ref={iframeRef}
      className={`concept-frame${room ? " room-frame" : ""}`}
      src={room ? src : `${src}?embed=1`}
      title={title}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}

function ProductTile({
  node,
  children,
  productName,
}: {
  node: MarkupElement;
  children: ReactNode;
  productName: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const isFlipTile = attr(node, "id") === "tt";
  const tileStyle = node.attrs.style as CSSProperties | undefined;
  const secretByProduct: Record<string, string> = {
    "Love Glide": "Six modes. Discreet from the outside.",
    "Nightshift desk": "9 to 5 on top. Tap the tile to flip it.",
    "Hush desk": "Folds flat. Holds a 15-inch laptop.",
    "Stash ottoman": "80 L inside. The lid takes 60 kg.",
    "Nook shelf": "The drawer fits six chargers and a power bank.",
    "Tidy box": "Fits a six-way strip. Cords exit both sides.",
  };
  function toggleFlip() {
    if (isFlipTile) setFlipped((value) => !value);
  }

  return (
    <div
      className={`tile${flipped ? " flip" : ""}`}
      id={attr(node, "id")}
      style={tileStyle}
      role={isFlipTile ? "button" : undefined}
      aria-pressed={isFlipTile ? flipped : undefined}
      aria-label={isFlipTile ? attr(node, "aria-label") : undefined}
      tabIndex={0}
      onClick={toggleFlip}
      onKeyDown={(event) => {
        if (isFlipTile && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          toggleFlip();
        }
      }}
    >
      {children}
      <span className="sec">{secretByProduct[productName]}</span>
    </div>
  );
}

function ProductCard({
  name,
  price,
  children,
  onAdd,
  className = "",
}: {
  name: string;
  price: number | null;
  children: ReactNode;
  onAdd: (name: string, price: number) => void;
  className?: string;
}) {
  const [added, setAdded] = useState(false);

  function handleClick(event: MouseEvent<HTMLElement>) {
    if (!(event.target instanceof window.Element)) return;
    const button = event.target.closest<HTMLButtonElement>("button.add");
    if (!button || price === null) return;

    event.preventDefault();
    onAdd(name, price);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article className={`card ${className}`.trim()} onClick={handleClick}>
      {children}
      <div className="row">
        <span className="price">{price === null ? "Price on request" : formatPrice(price)}</span>
        {price === null ? (
          <a
            className="btn alt"
            href={`mailto:lovetussle@gmail.com?subject=${encodeURIComponent(name)}`}
          >
            Ask about this piece
          </a>
        ) : (
          <button className="btn alt add" type="button" aria-label={`Add ${name} to bag`}>
            {added ? "Added" : "Add to bag"}
          </button>
        )}
      </div>
    </article>
  );
}

function ProductQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const questions = [
    "A place for guests to sleep",
    "A coffee table that does more",
    "A wide lounge chair with a docking footstool",
    "A desk for everyday work",
    "A bench that transforms into a wave",
  ];
  const recommendations = [
    "Meet the Kandariya Floor Lounger: a low sofa that opens flat into a bed, with optional comfort pieces.",
    "Meet the Lowlight coffee table: a walnut top that flips to padding, with a lower shelf and Night Deck for two.",
    "Meet Simhasana: a wide lounge chair with three locked recline angles and a docking footstool.",
    "Meet the Nightshift desk: fixed legs and a lift-off top.",
    "Meet Tarang: a channel-quilted bench that transforms into a contoured wave.",
  ];

  return (
    <section id="quiz">
      <div className="wrap">
        <h2>Which piece is yours?</h2>
        <p className="sub">Pick your biggest headache. We’ll point you to the fix.</p>
        <div className="opts" id="opts">
          {questions.map((question, index) => (
            <button
              className="btn alt"
              type="button"
              aria-pressed={selected === index}
              key={question}
              onClick={() => setSelected(index)}
            >
              {question}
            </button>
          ))}
        </div>
        <p className="res" id="res" aria-live="polite">
          {selected === null ? "" : recommendations[selected]}
        </p>
      </div>
    </section>
  );
}

function FeaturedLoveGlide() {
  const conceptUrl = "/concepts/love-glide-sofa.html";
  const iframeRef = useRef<HTMLIFrameElement>(null);
  usePreviewVisibility(iframeRef);

  return (
    <section className="featured-product" aria-labelledby="featured-love-glide-title">
      <div className="wrap">
        <div className="featured-layout">
          <div className="featured-copy">
            <h1>Tussle Furniture Co.</h1>
            <p className="eyebrow">Featured · TUSSLE after dark</p>
            <h2 id="featured-love-glide-title">Love Glide sofa</h2>
            <p className="sub">
              Meet the sofa in its interactive 3D concept. Explore each position and see how the
              Love Glide transforms.
            </p>
            <a
              className="btn featured-link"
              href={`${conceptUrl}?night=1`}
              target="_blank"
              rel="noreferrer"
            >
              See it at night <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="featured-media">
            <iframe
              ref={iframeRef}
              className="featured-frame"
              src={`${conceptUrl}?embed=1`}
              title="Love Glide sofa interactive 3D concept"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCatalog({ onAdd }: { onAdd: (name: string, price: number) => void }) {
  return (
    <>
      <FeaturedLoveGlide />
      <section id="shop">
        <div className="wrap">
          <p className="eyebrow">The TUSSLE collection</p>
          <h2>Furniture for all your plot twists.</h2>
          <p className="sub">
            Five pieces for small rooms, slow evenings and the unexpected guest.
          </p>
          <div className="grid product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.name}
                name={product.name}
                price={product.price}
                className="concept-card"
                onAdd={onAdd}
              >
                <div className="concept-media">
                  <ConceptPreview
                    src={product.preview}
                    title={`${product.name} interactive 3D concept`}
                  />
                  <a
                    className="product-night-link"
                    href={`${product.preview}?night=1`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`See ${product.name} at night`}
                  >
                    See it at night
                  </a>
                </div>
                <div className="concept-copy">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  {product.features.length > 0 && (
                    <ul className="concept-features">
                      {product.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  )}
                  <a
                    className="concept-link"
                    href={product.preview}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open 3D view <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </ProductCard>
            ))}
          </div>
          <p className="concept-disclaimer">
            Interactive models are concepts. Any dimensions or load ratings shown in the original
            previews are placeholders, not confirmed specifications.
          </p>
        </div>
      </section>
      <section className="room-showcase" aria-labelledby="room-showcase-title">
        <div className="wrap">
          <p className="eyebrow">Step inside</p>
          <h2 id="room-showcase-title">The Tussle house</h2>
          <p className="sub">
            Explore four rooms filled with Tussle pieces. Look around, switch from day to night,
            and tap a piece to see it up close.
          </p>
          <ConceptPreview
            src="/concepts/tussle-house.html?embed=1"
            title="Interactive 3D tour of the Tussle house"
            room
          />
          <a
            className="room-link"
            href="/concepts/tussle-house.html"
            target="_blank"
            rel="noreferrer"
          >
            Open the full Tussle house <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </>
  );
}

function BeforeYouBuy() {
  const details = [
    {
      title: "Delivery across India",
      description:
        "We deliver across India. Contact us to confirm delivery timing and shipping charges for your location.",
    },
    {
      title: "Self assembly",
      description: "Our furniture is self-assembled.",
    },
    {
      title: "Returns",
      description:
        "Our return policy is still being finalized. Please contact us for the latest terms before ordering.",
    },
    {
      title: "Warranty",
      description:
        "Warranty terms are still being finalized. Please contact us for the latest information before ordering.",
    },
  ];

  return (
    <section id="faq">
      <div className="wrap">
        <p className="eyebrow">The useful details</p>
        <h2>Before you buy.</h2>
        <p className="sub">
          Questions about your location, delivery or a piece? Talk to a real person.
        </p>
        <div className="grid buying-grid">
          {details.map(({ title, description }) => (
            <article className="buying-card" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <a className="btn buying-contact" href="mailto:lovetussle@gmail.com">
          Email lovetussle@gmail.com
        </a>
      </div>
    </section>
  );
}

type HeroState = {
  index: number;
  open: boolean;
  toggle: () => void;
  next: () => void;
};

const HeroContext = createContext<HeroState | null>(null);

function Hero3DFrame() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  usePreviewVisibility(frameRef);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let observer: ResizeObserver | null = null;
    let frameWindow: Window | null = null;
    const updateHeight = () => {
      const document = frame.contentDocument;
      if (!document) return;
      const nextHeight = Math.ceil(
        Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
      );
      setHeight((current) => (current === nextHeight ? current : nextHeight));
    };
    const observeFrame = () => {
      const document = frame.contentDocument;
      if (!document) return;

      observer?.disconnect();
      frameWindow?.removeEventListener("resize", updateHeight);
      frameWindow = document.defaultView;
      observer = new ResizeObserver(updateHeight);
      observer.observe(document.documentElement);
      observer.observe(document.body);
      const hero = document.getElementById("hero");
      if (hero) observer.observe(hero);
      frameWindow?.addEventListener("resize", updateHeight);
      updateHeight();
    };

    frame.addEventListener("load", observeFrame);
    if (frame.contentDocument?.readyState === "complete") observeFrame();

    return () => {
      frame.removeEventListener("load", observeFrame);
      observer?.disconnect();
      frameWindow?.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <iframe
      ref={frameRef}
      src="/tussle-hero-3d.html?embed=1"
      title="Tussle Dusk sofa-bed 3D hero"
      className="hero-3d-frame"
      style={{
        display: "block",
        width: "100%",
        height: height ? `${height}px` : "100svh",
        border: 0,
      }}
    />
  );
}

function useHero() {
  const hero = useContext(HeroContext);
  if (!hero) throw new Error("The hero controls must be rendered inside the hero section.");
  return hero;
}

const heroCaptions = [
  "That’s the Dusk sofa-bed. An easygoing two-seater, ready to become a bed.",
  "That’s the Lowlight coffee table. Walnut by day, padded for Night Deck after dark.",
  "That’s Simhasana. A wide lounge chair with a docking footstool.",
  "That’s the Nightshift desk. A lift-off top and fixed legs.",
];

function HeroExperience({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = window.setTimeout(() => setOpen(true), 900);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function next() {
    setOpen(false);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setIndex((current) => (current + 1) % heroCaptions.length);
      setOpen(true);
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 950);
  }

  return (
    <HeroContext.Provider value={{ index, open, toggle: () => setOpen(!open), next }}>
      {children}
    </HeroContext.Provider>
  );
}

function HeroCabinetContent() {
  const { index } = useHero();

  return (
    <div className="in" aria-hidden="true">
      {index === 0 ? (
        <svg viewBox="0 0 100 125">
          <rect x="14" y="40" width="72" height="34" rx="12" fill="#2f3cf0" />
          <rect x="8" y="64" width="84" height="30" rx="9" fill="#2f3cf0" />
          <rect x="14" y="68" width="35" height="20" rx="6" fill="#5a66ff" />
          <rect x="51" y="68" width="35" height="20" rx="6" fill="#5a66ff" />
          <rect x="2" y="58" width="16" height="38" rx="8" fill="#17120f" />
          <rect x="82" y="58" width="16" height="38" rx="8" fill="#17120f" />
          <rect x="22" y="48" width="18" height="14" rx="5" fill="#f4dc6a" />
          <rect x="60" y="48" width="18" height="14" rx="5" fill="#cfc3f2" />
          <rect x="12" y="96" width="5" height="10" fill="#17120f" />
          <rect x="83" y="96" width="5" height="10" fill="#17120f" />
        </svg>
      ) : index === 1 ? (
        <svg viewBox="0 0 100 125">
          <rect x="8" y="57" width="84" height="12" rx="4" fill="#8a5a3c" />
          <rect x="14" y="69" width="6" height="44" fill="#17120f" />
          <rect x="80" y="69" width="6" height="44" fill="#17120f" />
          <rect x="21" y="87" width="58" height="5" rx="2" fill="#f4dc6a" />
          <rect x="21" y="92" width="5" height="18" fill="#17120f" />
          <rect x="74" y="92" width="5" height="18" fill="#17120f" />
          <rect x="11" y="54" width="78" height="3" rx="2" fill="#cfc3f2" />
        </svg>
      ) : index === 2 ? (
        <svg viewBox="0 0 100 125">
          <path d="M29 26h42l8 41H25z" fill="#2f3cf0" />
          <rect x="23" y="64" width="56" height="13" rx="6" fill="#cfc3f2" />
          <path d="M28 77l-7 35h6l12-34m28 0 12 34h6L74 77" fill="#17120f" />
          <rect x="19" y="109" width="12" height="4" rx="2" fill="#f4dc6a" />
          <rect x="70" y="109" width="12" height="4" rx="2" fill="#f4dc6a" />
        </svg>
      ) : (
        <svg viewBox="0 0 100 125">
          <rect x="9" y="40" width="82" height="10" rx="3" fill="#8a5a3c" />
          <rect x="16" y="50" width="6" height="61" fill="#17120f" />
          <rect x="78" y="50" width="6" height="61" fill="#17120f" />
          <rect x="17" y="35" width="66" height="4" rx="2" fill="#f4dc6a" />
          <circle cx="21" cy="33" r="3" fill="#2f3cf0" />
          <circle cx="36" cy="33" r="3" fill="#2f3cf0" />
          <circle cx="50" cy="33" r="3" fill="#2f3cf0" />
          <circle cx="64" cy="33" r="3" fill="#2f3cf0" />
          <circle cx="79" cy="33" r="3" fill="#2f3cf0" />
        </svg>
      )}
    </div>
  );
}

function HeroControls({
  node,
  children,
}: {
  node: MarkupElement;
  children: ReactNode;
}) {
  const { index, open, toggle, next } = useHero();
  const id = attr(node, "id");

  if (id === "open") {
    return (
      <button className="btn" id="open" type="button" aria-pressed={open} onClick={toggle}>
        {open ? "Close it" : "Open it"}
      </button>
    );
  }
  if (id === "next") {
    return (
      <button className="btn alt" id="next" type="button" onClick={next}>
        {children}
      </button>
    );
  }
  if (id === "cab") {
    return <div className={`cab${open ? " open" : ""}`} id="cab">{children}</div>;
  }
  if (id === "cap") {
    return (
      <p className="cap" id="cap" aria-live="polite">
        {heroCaptions[index]}
      </p>
    );
  }
  return undefined;
}

function AgeGate({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const accepted =
        localStorage.getItem("t18") === "1" || sessionStorage.getItem("t18") === "1";
      setOpen(!accepted);
      if (accepted) localStorage.setItem("t18", "1");
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("gate-open", open);
    document
      .querySelectorAll<HTMLElement>("header, main, footer, [data-brand-moods]")
      .forEach((part) => {
        part.inert = open;
      });
    if (open) dialogRef.current?.querySelector<HTMLButtonElement>("#g18")?.focus();
    return () => {
      document.body.classList.remove("gate-open");
      document
        .querySelectorAll<HTMLElement>("header, main, footer, [data-brand-moods]")
        .forEach((part) => {
          part.inert = false;
        });
    };
  }, [open]);

  function accept(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof window.Element) || !event.target.closest("#g18")) return;
    setOpen(false);
    try {
      localStorage.setItem("t18", "1");
    } catch {
      try {
        sessionStorage.setItem("t18", "1");
      } catch {
        setOpen(false);
      }
    }
  }

  return (
    <div
      id="gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gt"
      hidden={!open}
      onClick={accept}
      ref={dialogRef}
    >
      {children}
    </div>
  );
}

function LogoButton({
  node,
  renderChildren,
}: {
  node: MarkupElement;
  renderChildren: (mood: string) => ReactNode;
}) {
  const [mood, setMood] = useState(0);
  const colors = ["", "c1", "c2", "c3"];

  useEffect(() => {
    const interval = window.setInterval(() => setMood((current) => (current + 1) % 4), 2600);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <a
      href={attr(node, "href") || "#top"}
      className="logo"
      aria-label={attr(node, "aria-label")}
      onClick={() => setMood((current) => (current + 1) % 4)}
    >
      {renderChildren(colors[mood])}
    </a>
  );
}

function BrandMoods({ node }: { node: MarkupElement }) {
  const moods = node.children.filter(
    (child): child is MarkupElement => isElement(child) && child.tag === "svg",
  );
  const [selected, setSelected] = useState(0);
  const colors = ["", "c1", "c2", "c3"];

  useEffect(() => {
    const interval = window.setInterval(
      () => setSelected((current) => (current + 1) % moods.length),
      2600,
    );
    return () => window.clearInterval(interval);
  }, [moods.length]);

  return (
    <div className="brand" data-brand-moods="">
      {moods.map((mood, index) => (
        <button
          className="brand-choice"
          type="button"
          aria-label={`Show Tussle logo mood ${index + 1}`}
          aria-pressed={selected === index}
          key={`brand-mood-${index}`}
          onClick={() => {
            setSelected(index);
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth",
            });
          }}
        >
          {createElement(
            "svg",
            { ...mood.attrs, className: `mark ${colors[index]}`.trim() },
            ...renderMarkup(mood.children),
          )}
        </button>
      ))}
    </div>
  );
}

function CartDrawer({
  cart,
  open,
  onClose,
  onChangeQuantity,
  onCheckout,
  checkoutMessage,
  saveMessage,
}: {
  cart: Cart;
  open: boolean;
  onClose: () => void;
  onChangeQuantity: (name: string, change: number) => void;
  onCheckout: () => void;
  checkoutMessage: string;
  saveMessage: string;
}) {
  const entries = Object.entries(cart);
  const count = entries.reduce((sum, [, item]) => sum + item.q, 0);
  const total = entries.reduce((sum, [, item]) => sum + item.q * item.p, 0);
  const freeDeliveryMessage =
    total >= FREE_DELIVERY_THRESHOLD
      ? "You’ve unlocked free delivery."
      : total
        ? `Add ${formatPrice(FREE_DELIVERY_THRESHOLD - total)} more for free delivery.`
        : `Free delivery over ${formatPrice(FREE_DELIVERY_THRESHOLD)}.`;

  return (
    <aside
      id="drawer"
      className={open ? "open" : ""}
      aria-label="Your bag"
      aria-hidden={!open}
      inert={!open}
    >
      <div className="dh">
        <h2>Your bag</h2>
        <button className="btn alt" id="dc" type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <div id="items">
        {entries.length ? (
          entries.map(([name, item]) => (
            <div className="it" key={name}>
              <div>
                <b>{name}</b>
                <br />
                {formatPrice(item.p)}
              </div>
              <div className="qt">
                <button
                  className="q"
                  type="button"
                  aria-label={`Remove one ${name}`}
                  onClick={() => onChangeQuantity(name, -1)}
                >
                  −
                </button>{" "}
                {item.q}{" "}
                <button
                  className="q"
                  type="button"
                  aria-label={`Add one ${name}`}
                  onClick={() => onChangeQuantity(name, 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="sub">Your bag is empty. Pick something from the shop.</p>
        )}
      </div>
      <p className="sub" id="free" aria-live="polite">
        {freeDeliveryMessage}
      </p>
      <div className="pb">
        <i style={{ width: `${Math.min(100, (total / FREE_DELIVERY_THRESHOLD) * 100)}%` }} />
      </div>
      <div className="dt">
        <span>Total</span>
        <b id="tot">{formatPrice(total)}</b>
      </div>
      <button
        className="btn"
        id="ck"
        type="button"
        disabled={!count}
        onClick={onCheckout}
      >
        Checkout
      </button>
      <p className="sub" id="ckm" aria-live="polite" style={{ marginTop: 10 }}>
        {checkoutMessage || saveMessage}
      </p>
    </aside>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (website) {
      setMessage("Signup could not be accepted.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    setSubmitting(true);
    setMessage("");

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (!url || !key) {
        throw new Error("Email signup is not configured yet. Please try again soon.");
      }

      const response = await fetch(
        `${url}/rest/v1/newsletter_subscribers`,
        {
          method: "POST",
          headers: {
            apikey: key,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ email: normalizedEmail }),
        },
      );

      if (!response.ok && response.status !== 409) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Supabase denied this signup. Check the newsletter table permissions and RLS policy.",
          );
        }
        if (response.status === 404) {
          throw new Error(
            "The newsletter table was not found. Run the Supabase setup SQL and check the project URL.",
          );
        }
        throw new Error(
          `We could not save your email (HTTP ${response.status}). Please try again.`,
        );
      }

      setMessage("You’re on the list. Watch your inbox.");
      setEmail("");
    } catch (error) {
      setMessage(
        error instanceof TypeError
          ? "Could not reach Supabase. Check the project URL and your internet connection."
          : error instanceof Error
          ? error.message
          : "We could not reach the signup service. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form className="join" id="join-form" onSubmit={handleSubmit}>
        <input
          type="email"
          id="em"
          name="email"
          placeholder="you@email.com"
          aria-label="Email address"
          autoComplete="email"
          maxLength={254}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label className="trap" aria-hidden="true">
          Leave this field empty
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </label>
        <button className="btn" id="go" type="submit" disabled={submitting}>
          {submitting ? "Joining…" : "Join the list"}
        </button>
      </form>
      <p id="msg" role="status" aria-live="polite" className="sub" style={{ marginTop: 14 }}>
        {message}
      </p>
    </>
  );
}

export default function Storefront({ nodes }: StorefrontProps) {
  const [cart, setCart] = useState<Cart>({});
  const [cartReady, setCartReady] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
      if (saved && typeof saved === "object" && !Array.isArray(saved)) {
        const clean: Cart = {};
        Object.entries(saved).forEach(([name, value]) => {
          if (
            productNames.has(name) &&
            value &&
            typeof value === "object" &&
            "p" in value &&
            "q" in value &&
            Number.isSafeInteger(value.p) &&
            value.p > 0 &&
            Number.isSafeInteger(value.q) &&
            value.q > 0
          ) {
            clean[name] = { p: value.p, q: value.q };
          }
        });
        setCart(clean);
      }
    } catch {
      setSaveMessage("Your saved bag could not be loaded. Start a new bag in this tab.");
    } finally {
      setCartReady(true);
    }
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      setSaveMessage("Your browser could not save the bag. Keep this tab open while you browse.");
    }
  }, [cart, cartReady]);

  useEffect(() => {
    if (!bagOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setBagOpen(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [bagOpen]);

  const count = useMemo(
    () => Object.values(cart).reduce((sum, item) => sum + item.q, 0),
    [cart],
  );

  function addToCart(name: string, price: number) {
    setCart((current) => ({
      ...current,
      [name]: { p: price, q: (current[name]?.q || 0) + 1 },
    }));
    setCheckoutMessage("");
  }

  function changeQuantity(name: string, change: number) {
    setCart((current) => {
      const existing = current[name];
      if (!existing) return current;
      const quantity = existing.q + change;
      if (quantity < 1) {
        const next = { ...current };
        delete next[name];
        return next;
      }
      return { ...current, [name]: { ...existing, q: quantity } };
    });
    setCheckoutMessage("");
  }

  const render = (
    items: MarkupNode[],
    prefix = "store",
    productName = "",
    logoMood: string | null = null,
  ): ReactNode[] =>
    renderMarkup(items, (node, key) => {
      const id = attr(node, "id");
      const children = () => render(node.children, key, productName, logoMood);

      if (node.tag === "article" && textContent(node).includes("Parents’ spare room")) return null;

      if (node.tag === "footer") {
        return (
          <footer key={key}>
            {children()}
            <nav className="footer-socials" aria-label="Social media">
              <a href="https://www.instagram.com/lovetussle/" target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61596574044874"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </nav>
          </footer>
        );
      }

      if (id === "shop") return <ProductCatalog key={key} onAdd={addToCart} />;

      if (node.tag === "div" && hasClass(node, "tick")) return null;

      if (node.tag === "div" && hasClass(node, "hero")) {
        return <Hero3DFrame key={key} />;
      }

      if (id === "open" || id === "next" || id === "cab" || id === "cap") {
        return <HeroControls key={key} node={node} children={children()} />;
      }

      if (node.tag === "div" && hasClass(node, "in")) {
        return (
          <HeroCabinetContent
            key={key}
          />
        );
      }

      if (id === "move") return null;

      if (id === "gate") return <AgeGate key={key}>{children()}</AgeGate>;

      if (
        node.tag === "a" &&
        hasClass(node, "logo") &&
        !attr(node, "href").includes("google.com")
      ) {
        return (
          <LogoButton
            key={key}
            node={node}
            renderChildren={(mood) => render(node.children, key, productName, mood)}
          />
        );
      }

      if (node.tag === "svg" && hasClass(node, "mark") && logoMood !== null) {
        return createElement(
          "svg",
          { ...node.attrs, className: `mark ${logoMood}`.trim(), key },
          ...children(),
        );
      }

      if (node.tag === "div" && hasClass(node, "brand")) {
        return <BrandMoods key={key} node={node} />;
      }

      if (id === "bag") {
        return (
          <button
            className="bagbtn"
            id="bag"
            type="button"
            aria-controls="drawer"
            aria-expanded={bagOpen}
            onClick={() => setBagOpen(true)}
          >
            Bag ({count})
          </button>
        );
      }

      if (id === "drawer") {
        return (
          <CartDrawer
            cart={cart}
            open={bagOpen}
            onClose={() => setBagOpen(false)}
            onChangeQuantity={changeQuantity}
            onCheckout={() =>
              setCheckoutMessage(
                "Online payments are not set up yet. Your bag is saved on this device.",
              )
            }
            checkoutMessage={checkoutMessage}
            saveMessage={saveMessage}
          />
        );
      }

      if (id === "ov") {
        return (
          <div
            id="ov"
            hidden={!bagOpen}
            onClick={() => setBagOpen(false)}
            aria-hidden="true"
          />
        );
      }

      if (id === "join-form") return <NewsletterForm />;
      if (id === "msg") return null;
      if (id === "quiz") return <ProductQuiz />;
      if (id === "faq") return <BeforeYouBuy key={key} />;
      if (hasClass(node, "st")) return null;

      if (node.tag === "div" && hasClass(node, "tile")) {
        return (
          <ProductTile key={key} node={node} productName={productName}>
            {children()}
          </ProductTile>
        );
      }

      if (node.tag === "article" && hasClass(node, "card")) {
        const name = findTextByTag(node, "h3");
        const price = Number(findPrice(node).replace(/\D/g, ""));
        const productMarkup = node.children.filter(
          (child) => !isElement(child) || !hasClass(child, "row"),
        );
        return (
          <ProductCard key={key} name={name} price={price} onAdd={addToCart}>
            {render(productMarkup, `${key}-product`, name, logoMood)}
          </ProductCard>
        );
      }

      if (id === "tk") {
        const phrase = "By day, furniture ✦ By night, Tussle ✦ Now you see it ✦ Now you don’t ✦ ";
        return (
          <div id="tk" key={key}>
            {phrase.repeat(6)}
          </div>
        );
      }

      return undefined;
    }, prefix);

  return <>{render(nodes)}</>;
}
