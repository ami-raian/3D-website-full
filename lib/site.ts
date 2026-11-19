/**
 * Company details and shared content, kept in one place so the copy is easy to edit.
 * Used by the sections (About, Services, Contact) and by the contact form's server action.
 */

export const SITE = {
  name: "Lumen Studio",
  email: "hello@example.com",
};

/** in-page sections, in page order; the nav and the mobile menu are built from this */
export const SECTIONS = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "technologies", label: "Technologies" },
  { id: "contact", label: "Contact" },
] as const;

export type ServiceIcon =
  | "bag"
  | "code"
  | "chart"
  | "tag"
  | "team"
  | "hire"
  | "spark"
  | "cube"
  | "orbit"
  | "grid"
  | "wave"
  | "layers";

/**
 * Which block of the Services section a service sits in:
 * "shopify" and "core" get large cards with a "what's included" list, no group gets a compact card.
 */
export type ServiceGroup = "shopify" | "core";

export type Service = {
  title: string;
  text: string;
  icon: ServiceIcon;
  group?: ServiceGroup;
  points?: string[];
  tags?: string[];
};

export const SERVICE_GROUPS: Record<ServiceGroup, { label: string; text: string }> = {
  shopify: {
    label: "Shopify, A to Z",
    text: "From an empty account to a store that sells, and the care it needs after launch. Hire us for one step or all of them.",
  },
  core: {
    label: "E-commerce & remote teams",
    text: "Stores on any platform, and the people to build and run them.",
  },
};

export const SERVICES: Service[] = [
  // ---- Shopify, A to Z ----
  {
    group: "shopify",
    title: "Shopify store setup",
    text: "A complete store, ready to sell: set up, designed around your brand and filled with your products.",
    points: [
      "Store setup and configuration",
      "Theme selection and customisation",
      "Custom theme design (Online Store 2.0)",
      "Products, collections and pages",
      "Payments, shipping, taxes and markets",
      "Domain, email and launch checklist",
    ],
    tags: ["Shopify", "Liquid", "Online Store 2.0"],
    icon: "bag",
  },
  {
    group: "shopify",
    title: "Shopify development",
    text: "Custom features, apps and integrations for when the theme editor isn't enough.",
    points: [
      "Custom sections and theme features",
      "App setup and integration",
      "Custom Shopify apps",
      "Migration from WooCommerce, Magento and more",
      "ERP, CRM and marketplace integrations",
      "Shopify Plus and headless (Hydrogen)",
    ],
    tags: ["Shopify Plus", "Hydrogen", "Shopify APIs"],
    icon: "code",
  },
  {
    group: "shopify",
    title: "Shopify growth & care",
    text: "After launch: faster pages, better rankings, more sales and a store that keeps running smoothly.",
    points: [
      "Speed and Core Web Vitals",
      "SEO and structured data",
      "Conversion and checkout optimisation",
      "Email, reviews and marketing apps",
      "Analytics and tracking setup",
      "Monthly maintenance and support",
    ],
    tags: ["SEO", "CRO", "Analytics"],
    icon: "chart",
  },

  // ---- e-commerce & remote teams ----
  {
    group: "core",
    title: "E-commerce development",
    text: "Online stores and marketplaces on the platform that fits your business, built to convert and simple to run.",
    points: [
      "Custom and headless storefronts",
      "WooCommerce and Magento builds",
      "Multi-vendor marketplaces",
      "Payment gateways and checkout",
      "Inventory, ERP and CRM integrations",
      "Analytics and conversion tracking",
    ],
    tags: ["WooCommerce", "Headless", "Stripe"],
    icon: "tag",
  },
  {
    group: "core",
    title: "Remote team management",
    text: "We run your remote developers, designers and support staff day to day, so you get the output without the overhead.",
    points: [
      "Onboarding, tools and access setup",
      "Daily stand-ups and task tracking",
      "Time tracking and weekly reports",
      "Performance reviews and feedback",
      "Payroll and contract coordination",
      "Smooth hand-offs across time zones",
    ],
    tags: ["Jira", "Slack", "Time tracking"],
    icon: "team",
  },
  {
    group: "core",
    title: "Remote hiring",
    text: "Find, vet and hire remote talent fast: developers, designers, Shopify experts, virtual assistants and more.",
    points: [
      "Role definition and job descriptions",
      "Sourcing and shortlisting",
      "Skills tests and interviews",
      "Background and reference checks",
      "Offers, contracts and onboarding",
      "Full-time, part-time or per project",
    ],
    tags: ["Developers", "Designers", "Virtual assistants"],
    icon: "hire",
  },

  // ---- more services ----
  {
    title: "Web platforms",
    text: "Fast, accessible web apps, portals and dashboards on a clean API layer your team can extend.",
    icon: "spark",
  },
  {
    title: "Mobile apps",
    text: "iOS and Android apps from one codebase, with offline support, push notifications and a native feel.",
    icon: "cube",
  },
  {
    title: "Cloud & DevOps",
    text: "Infrastructure as code, CI/CD and monitoring, so releases are routine and outages are rare.",
    icon: "orbit",
  },
  {
    title: "AI & data",
    text: "Search, assistants and analytics on your own data, with evaluation and guardrails built in.",
    icon: "wave",
  },
  {
    title: "Product design",
    text: "Research, UX and design systems that keep the product consistent and easy to use as it grows.",
    icon: "grid",
  },
  {
    title: "Custom software",
    text: "ERPs, CRMs and internal tools shaped around how your team works, connected to what you already use.",
    icon: "layers",
  },
];

export const BUDGETS = ["Under $10k", "$10k – $25k", "$25k – $50k", "$50k – $100k", "$100k+"];
