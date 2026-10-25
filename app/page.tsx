import Storefront from "./storefront";
import { storefrontNodes } from "./storefront-content";

export default function Home() {
  return <Storefront nodes={storefrontNodes} />;
}
