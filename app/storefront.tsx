"use client";

import {
  Fragment,
  createContext,
  createElement,
  type CSSProperties,
  type FormEvent,
  type MouseEvent,
  type RefObject,
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
    if (!isElement(node)) return node;
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

function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
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
}: {
  name: string;
  price: number;
  children: ReactNode;
  onAdd: (name: string, price: number) => void;
}) {
  const [added, setAdded] = useState(false);

  function handleClick(event: MouseEvent<HTMLElement>) {
    if (!(event.target instanceof window.Element)) return;
    const button = event.target.closest<HTMLButtonElement>("button.add");
    if (!button) return;

    event.preventDefault();
    onAdd(name, price);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article className="card" onClick={handleClick}>
      {children}
      <div className="row">
        <span className="price">{formatPrice(price)}</span>
        <button className="btn alt add" type="button" aria-label={`Add ${name} to bag`}>
          {added ? "Added" : "Add to bag"}
        </button>
      </div>
    </article>
  );
}

function ProductQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const questions = [
    "Nowhere to work",
    "Too much stuff",
    "Cable chaos",
    "Friends sleep over",
  ];
  const recommendations = [
    "Try the Hush desk. It folds out for work and vanishes after.",
    "Try the Stash ottoman. 80 litres of hiding place you can sit on.",
    "Try the Tidy box. Power strips go in, cables disappear.",
    "Try the Love Glide. A sofa by day, a place for friends to stay at night.",
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

type HeroState = {
  index: number;
  open: boolean;
  toggle: () => void;
  next: () => void;
};

const HeroContext = createContext<HeroState | null>(null);

function useHero() {
  const hero = useContext(HeroContext);
  if (!hero) throw new Error("The hero controls must be rendered inside the hero section.");
  return hero;
}

const heroCaptions = [
  "That’s the Love Glide. A plain sofa by day.",
  "That’s the Nightshift desk. 9 to 5 on top. Flips after dark.",
  "That’s the Hush desk. It lives in 12 cm of wall.",
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

function HeroCabinetContent({ renderChildren }: { renderChildren: ReactNode }) {
  const { index } = useHero();
  if (index === 2) return <div className="in">{renderChildren}</div>;

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
      ) : (
        <svg viewBox="0 0 100 125">
          <rect x="6" y="72" width="88" height="7" rx="2" fill="#8a5a3c" />
          <rect x="16" y="79" width="5" height="40" fill="#17120f" />
          <rect x="79" y="79" width="5" height="40" fill="#17120f" />
          <rect x="30" y="50" width="38" height="22" rx="2" fill="#17120f" />
          <rect x="33" y="53" width="32" height="16" fill="#f4dc6a" />
          <rect x="10" y="80" width="80" height="3" rx="1" fill="#f4dc6a" />
          <rect x="74" y="60" width="10" height="12" rx="2" fill="#cfc3f2" />
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

type RoomState = {
  value: number;
  setValue: (value: number) => void;
  moveTo: (value: number) => void;
  cancelAnimation: () => void;
  selectedPreset: number | null;
  setSelectedPreset: (value: number | null) => void;
  sliderRef: RefObject<HTMLDivElement | null>;
};

const RoomContext = createContext<RoomState | null>(null);

function useRoom() {
  const room = useContext(RoomContext);
  if (!room) throw new Error("Room comparison controls must be inside the room section.");
  return room;
}

function RoomComparison({ node, children }: { node: MarkupElement; children: ReactNode }) {
  const [value, setValue] = useState(50);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const controlFrame = useRef(0);
  const autoFrame = useRef(0);

  function cancelAnimation() {
    cancelAnimationFrame(autoFrame.current);
    cancelAnimationFrame(controlFrame.current);
  }

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function animate(from: number, to: number, duration: number, complete?: () => void) {
      const start = performance.now();
      function update(now: number) {
        const progress = Math.min(1, (now - start) / duration);
        const eased =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        setValue(Math.round(from + (to - from) * eased));
        if (progress < 1) {
          autoFrame.current = requestAnimationFrame(update);
        } else {
          complete?.();
        }
      }
      autoFrame.current = requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        animate(50, 0, 700, () => animate(0, 100, 1400));
      },
      { threshold: 0.6 },
    );
    observer.observe(slider);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(autoFrame.current);
    };
  }, []);

  function moveTo(target: number) {
    cancelAnimation();
    setSelectedPreset(target);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    const from = value;
    const start = performance.now();
    function update(now: number) {
      const progress = Math.min(1, (now - start) / 700);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) controlFrame.current = requestAnimationFrame(update);
    }
    controlFrame.current = requestAnimationFrame(update);
  }

  useEffect(() => () => cancelAnimation(), []);

  return (
    <RoomContext.Provider
      value={{
        value,
        setValue,
        moveTo,
        cancelAnimation,
        selectedPreset,
        setSelectedPreset,
        sliderRef,
      }}
    >
      {createElement("section", { ...node.attrs }, children)}
    </RoomContext.Provider>
  );
}

function RoomRange({ node }: { node: MarkupElement }) {
  const { value, setValue, setSelectedPreset, cancelAnimation } = useRoom();
  return (
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      aria-label={attr(node, "aria-label")}
      onChange={(event) => {
        cancelAnimation();
        setSelectedPreset(null);
        setValue(Number(event.target.value));
      }}
    />
  );
}

function RoomSlider({
  node,
  children,
}: {
  node: MarkupElement;
  children: ReactNode;
}) {
  const { value, sliderRef } = useRoom();
  return (
    <div
      {...node.attrs}
      ref={sliderRef}
      style={{ ...(node.attrs.style as CSSProperties), "--p": `${value}%` } as CSSProperties}
    >
      {children}
    </div>
  );
}

function RoomControls() {
  const { moveTo, selectedPreset } = useRoom();
  return (
    <div className="opts" id="pre">
      {[
        ["Move-in mess", 0],
        ["Halfway", 50],
        ["Sorted", 100],
      ].map(([label, target]) => (
        <button
          className="btn alt"
          type="button"
          aria-pressed={selectedPreset === target}
          key={label}
          onClick={() => moveTo(Number(target))}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function RoomStat({ id }: { id: string }) {
  const { value } = useRoom();
  const stats: Record<string, string> = {
    s1: `${Math.round(18 + 46 * (value / 100))}%`,
    s2: String(Math.round(14 - 11 * (value / 100))),
    s3: String(Math.round(6 - 6 * (value / 100))),
  };
  return <b id={id}>{stats[id]}</b>;
}

function AgeGate({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("t18")) setOpen(false);
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
      sessionStorage.setItem("t18", "1");
    } catch {
      setOpen(false);
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

function RoomLabel({ node, children }: { node: MarkupElement; children: ReactNode }) {
  const { value } = useRoom();
  const visible = hasClass(node, "ta") ? value > 40 : value < 60;
  return createElement(
    node.tag,
    {
      ...node.attrs,
      style: { ...(node.attrs.style as CSSProperties), opacity: visible ? 1 : 0 },
    },
    children,
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
        `${url}/rest/v1/newsletter_subscribers?on_conflict=email`,
        {
          method: "POST",
          headers: {
            apikey: key,
            "Content-Type": "application/json",
            Prefer: "resolution=ignore-duplicates,return=minimal",
          },
          body: JSON.stringify({ email: normalizedEmail }),
        },
      );

      if (!response.ok) {
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

      if (node.tag === "div" && hasClass(node, "hero")) {
        return (
          <HeroExperience key={key}>
            {createElement(
              "div",
              { ...node.attrs },
              render(node.children, `${key}-hero`, productName, logoMood),
            )}
          </HeroExperience>
        );
      }

      if (id === "open" || id === "next" || id === "cab" || id === "cap") {
        return <HeroControls key={key} node={node} children={children()} />;
      }

      if (node.tag === "div" && hasClass(node, "in")) {
        return (
          <HeroCabinetContent
            key={key}
            renderChildren={render(node.children, `${key}-interior`, productName, logoMood)}
          />
        );
      }

      if (id === "move") {
        return <RoomComparison key={key} node={node} children={children()} />;
      }

      if (id === "ba") {
        return <RoomSlider key={key} node={node} children={children()} />;
      }

      if (id === "pre") return <RoomControls key={key} />;
      if (hasClass(node, "ta") || hasClass(node, "tb")) {
        return <RoomLabel key={key} node={node} children={children()} />;
      }
      if (id === "s1" || id === "s2" || id === "s3") {
        return <RoomStat key={key} id={id} />;
      }

      if (
        node.tag === "input" &&
        attr(node, "type") === "range" &&
        attr(node, "aria-label") === "Compare before and after"
      ) {
        return <RoomRange key={key} node={node} />;
      }

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
