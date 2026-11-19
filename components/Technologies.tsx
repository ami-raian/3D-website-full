import {
  siBigcommerce,
  siDocker,
  siElasticsearch,
  siExpo,
  siFigma,
  siFirebase,
  siFlutter,
  siGithub,
  siGithubactions,
  siGo,
  siGooglecloud,
  siGraphql,
  siJira,
  siKotlin,
  siKubernetes,
  siLaravel,
  siLinear,
  siMongodb,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siNotion,
  siPaypal,
  siPhp,
  siPostgresql,
  siPython,
  siPytorch,
  siReact,
  siRedis,
  siShopify,
  siStripe,
  siSupabase,
  siSwift,
  siTailwindcss,
  siTerraform,
  siThreedotjs,
  siTypescript,
  siVercel,
  siVuedotjs,
  siWoocommerce,
  siZoom,
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
    area: "Frontend",
    tools: [
      tool("Next.js", siNextdotjs),
      tool("React", siReact),
      tool("TypeScript", siTypescript),
      tool("Tailwind CSS", siTailwindcss),
      tool("Vue.js", siVuedotjs),
      tool("Three.js", siThreedotjs),
    ],
  },
  {
    area: "Backend",
    tools: [
      tool("Node.js", siNodedotjs),
      tool("NestJS", siNestjs),
      tool("Python", siPython),
      tool("Go", siGo),
      tool("GraphQL", siGraphql),
      tool("Laravel", siLaravel),
      tool("PHP", siPhp),
    ],
  },
  {
    area: "Mobile",
    tools: [
      tool("React Native", siReact),
      tool("Flutter", siFlutter),
      tool("Swift", siSwift),
      tool("Kotlin", siKotlin),
      tool("Expo", siExpo),
      tool("Firebase", siFirebase),
    ],
  },
  {
    area: "Cloud & DevOps",
    tools: [
      named("AWS", "AWS"),
      tool("Google Cloud", siGooglecloud),
      tool("Docker", siDocker),
      tool("Kubernetes", siKubernetes),
      tool("Terraform", siTerraform),
      tool("GitHub Actions", siGithubactions),
      tool("Vercel", siVercel),
    ],
  },
  {
    area: "Data & AI",
    tools: [
      tool("PostgreSQL", siPostgresql),
      tool("MongoDB", siMongodb),
      tool("Redis", siRedis),
      tool("Supabase", siSupabase),
      tool("Elasticsearch", siElasticsearch),
      tool("PyTorch", siPytorch),
    ],
  },
  {
    area: "Remote teams",
    tools: [
      tool("Jira", siJira),
      named("Slack", "Sl"),
      tool("Notion", siNotion),
      tool("GitHub", siGithub),
      tool("Figma", siFigma),
      tool("Linear", siLinear),
      tool("Zoom", siZoom),
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
          Proven, well-supported tools, chosen for your problem and your team, so the software stays easy to hire for
          and easy to change.
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
