import {
  siBigcommerce,
  siDocker,
  siFigma,
  siFirebase,
  siFlutter,
  siGithub,
  siGooglecloud,
  siKotlin,
  siLaravel,
  siNextdotjs,
  siNodedotjs,
  siPaypal,
  siReact,
  siShopify,
  siStripe,
  siSwift,
  siTailwindcss,
  siTypescript,
  siVercel,
  siWoocommerce,
} from "simple-icons";
import Marquee from "./Marquee";
import StackTabs, { type StackGroup, type StackTool } from "./StackTabs";
import Track from "./Track";
import { vars } from "@/lib/css";

const TICKER = ["Shopify", "Next.js", "TypeScript", "WooCommerce", "Node.js", "React Native", "AWS", "AI & LLMs"];

type Icon = { path: string; hex: string };

/** a logo tile; brands too dark to see on this page hover in the page colour instead */
const tool = (name: string, icon: Icon): StackTool => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(icon.hex.slice(i, i + 2), 16) / 255);
  const light = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return { name, path: icon.path, color: light < 0.22 ? "#f2f0ec" : `#${icon.hex}` };
};
/** a tile for tools that have no logo in the icon set */
const named = (name: string, mono: string): StackTool => ({ name, mono, color: "#b79cff" });

const STACK: StackGroup[] = [
  {
    area: "E-commerce",
    tools: [
      tool("Shopify", siShopify),
      tool("WooCommerce", siWoocommerce),
      tool("BigCommerce", siBigcommerce),
      named("Magento", "Mg"),
      tool("Stripe", siStripe),
      tool("PayPal", siPaypal),
    ],
  },
  {
    area: "Web",
    tools: [
      tool("Next.js", siNextdotjs),
      tool("React", siReact),
      tool("TypeScript", siTypescript),
      tool("Tailwind CSS", siTailwindcss),
      tool("Node.js", siNodedotjs),
      tool("Laravel", siLaravel),
    ],
  },
  {
    area: "Mobile",
    tools: [
      tool("React Native", siReact),
      tool("Flutter", siFlutter),
      tool("Swift", siSwift),
      tool("Kotlin", siKotlin),
      tool("Firebase", siFirebase),
    ],
  },
  {
    area: "Cloud & tools",
    tools: [
      named("AWS", "AWS"),
      tool("Google Cloud", siGooglecloud),
      tool("Docker", siDocker),
      tool("Vercel", siVercel),
      tool("GitHub", siGithub),
      tool("Figma", siFigma),
    ],
  },
];

export default function Technologies() {
  return (
    <Track name="technologies" id="technologies" className="tech">
      <Track as="div" mode="enter" className="section-inner sec-head">
        <p className="kicker rise">( Technologies )</p>
        <h2 className="h2 rise" style={vars({ "--i": 1 })}>
          Tools we <em>trust</em>
        </h2>
        <p className="lead rise" style={vars({ "--i": 2 })}>
          Modern, reliable tools that keep your product fast and easy to grow.
        </p>
      </Track>

      <Marquee items={TICKER} />

      <Track as="div" mode="enter" className="section-inner">
        <div className="rise">
          <StackTabs groups={STACK} />
        </div>
      </Track>
    </Track>
  );
}
