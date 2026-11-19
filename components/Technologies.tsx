import Marquee from "./Marquee";
import Track from "./Track";
import { vars } from "@/lib/css";

const TICKER = ["Shopify", "Next.js", "TypeScript", "WooCommerce", "Node.js", "React Native", "AWS", "AI & LLMs"];

const STACK = [
  { area: "E-commerce", tools: ["Shopify", "Shopify Plus", "Liquid", "Hydrogen", "WooCommerce", "Stripe"] },
  { area: "Remote teams", tools: ["Jira", "Slack", "Notion", "GitHub", "Time tracking"] },
  { area: "Frontend", tools: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { area: "Backend", tools: ["Node.js", "NestJS", "Python", "Go", "GraphQL"] },
  { area: "Mobile", tools: ["React Native", "Flutter", "Swift", "Kotlin"] },
  { area: "Data & AI", tools: ["PostgreSQL", "MongoDB", "Redis", "LLM APIs", "Vector search"] },
  { area: "Cloud & DevOps", tools: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Terraform"] },
  { area: "Design", tools: ["Figma", "Design systems", "Prototyping", "Usability testing"] },
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

      <div className="section-inner tech-grid">
        {STACK.map((s, i) => (
          <Track key={s.area} as="div" mode="enter" className="tech-card rise" style={vars({ "--i": i % 4 })}>
            <h3>
              <span>0{i + 1}</span>
              {s.area}
            </h3>
            <ul className="tags">
              {s.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Track>
        ))}
      </div>
    </Track>
  );
}
