/**
 * All the site's content in one place, so the copy is easy to edit.
 *
 * Lines marked CONFIRM are business claims or commitments (numbers, guarantees, prices,
 * response times). They are sensible placeholders: check every one before going live, since
 * a claim a visitor can't trust does more harm than leaving it out.
 */

export const SITE = {
  name: "Ucchas",
  email: "hello@example.com", // CONFIRM: your real address
  /** shown under the contact form and in the hiring section */
  replyTime: "We reply within one business day", // CONFIRM
};

/** in-page sections the nav links to, in page order (each section is tracked under its id) */
export const SECTIONS = [
  { id: "services", label: "Services" },
  { id: "projects", label: "Work" },
  { id: "hiring", label: "Hire talent" },
  { id: "process", label: "Process" },
  { id: "team", label: "Team" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

/** the numbers under the hero. CONFIRM: use only numbers you can back up */
export const STATS = [
  { to: 150, suffix: "+", label: "Shopify stores launched" },
  { to: 9, suffix: " yrs", label: "Building e-commerce" },
  { to: 40, suffix: "+", label: "Remote hires placed" },
  { to: 98, suffix: "%", label: "Clients who come back" },
];

/* ------------------------------------------------------------------ why Ucchas */

/** the line icons in components/LineIcon.tsx */
export type IconName =
  | "bag" | "chat" | "quote" | "bolt" | "clock" | "loop"
  | "code" | "move" | "trend" | "cart" | "devices" | "people";

/** differentiators: specific and checkable beats generic ("quality, on time") */
export const WHY: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "bag",
    title: "Shopify-first, not Shopify-also",
    text: "Shopify is our main craft: themes, apps, checkout, Shopify Plus and Hydrogen, every week.",
  },
  {
    icon: "chat",
    title: "A direct line to the makers",
    text: "You talk to the designers and developers doing the work, not a chain of account managers.",
  },
  {
    icon: "quote",
    title: "Fixed quotes, no surprises",
    text: "After a free call you get a written scope and a fixed price before any work starts.", // CONFIRM
  },
  {
    icon: "bolt",
    title: "Speed is a feature",
    text: "We build for Core Web Vitals from day one, because faster stores sell more.",
  },
  {
    icon: "clock",
    title: "Your working day, covered",
    text: "Regular overlap hours with your team for calls, reviews and urgent fixes.", // CONFIRM
  },
  {
    icon: "loop",
    title: "We stay after launch",
    text: "Monthly care plans for fixes, speed and conversion work. Cancel any time.", // CONFIRM
  },
];

/* ------------------------------------------------------------------ services */


/** "shopify" = large cards with everything included; "beyond" = compact cards */
export type ServiceGroup = "shopify" | "beyond";

export type Service = {
  title: string;
  /** a short stage name shown above the title (Shopify cards) */
  phase?: string;
  text: string;
  icon: IconName;
  group: ServiceGroup;
  points?: string[];
  /** optional in-page link, e.g. "#hiring" */
  href?: string;
};

export const SERVICE_GROUPS: Record<ServiceGroup, { label: string; text: string }> = {
  shopify: {
    label: "Shopify services",
    text: "Launch, build, migrate and grow: hire us for one stage or all of them.",
  },
  beyond: {
    label: "Beyond Shopify",
    text: "The rest of what an online business needs.",
  },
};

export const SERVICES: Service[] = [
  {
    group: "shopify",
    phase: "Launch",
    title: "Store setup & design",
    text: "A complete store, ready to sell: set up, designed around your brand and filled with your products.",
    points: [
      "Store setup and configuration",
      "Custom theme design (Online Store 2.0)",
      "Products, collections and content",
      "Payments, shipping, taxes and Markets",
      "Apps chosen and set up for you",
      "Launch checklist and team training",
    ],
    icon: "bag",
  },
  {
    group: "shopify",
    phase: "Build",
    title: "Custom development",
    text: "Custom features, apps and integrations for when the theme editor isn't enough.",
    points: [
      "Custom sections and theme features",
      "Custom and private Shopify apps",
      "Checkout extensions and Shopify Functions",
      "ERP, CRM, 3PL and marketplace integrations",
      "Shopify Plus and B2B",
      "Headless storefronts with Hydrogen",
    ],
    icon: "code",
  },
  {
    group: "shopify",
    phase: "Migrate",
    title: "Move to Shopify",
    text: "Replatform from WooCommerce, Magento, BigCommerce, Wix or a custom site without losing sales or rankings.",
    points: [
      "Products, customers and order history moved",
      "Every old URL redirected (SEO-safe)",
      "Metadata and structured data kept",
      "Apps and integrations replaced",
      "Test store you can check before launch",
      "Go-live with no downtime",
    ],
    icon: "move",
  },
  {
    group: "shopify",
    phase: "Grow",
    title: "Growth, CRO & care",
    text: "After launch: faster pages, better rankings, more sales and a store that keeps running smoothly.",
    points: [
      "Speed and Core Web Vitals",
      "SEO and structured data",
      "Conversion and A/B testing",
      "Email, SMS and marketing apps",
      "Analytics and tracking setup",
      "Monthly care plans",
    ],
    icon: "trend",
  },
  {
    group: "beyond",
    title: "E-commerce development",
    text: "WooCommerce, BigCommerce, headless storefronts and multi-vendor marketplaces.",
    icon: "cart",
  },
  {
    group: "beyond",
    title: "Web & mobile apps",
    text: "Web platforms, dashboards and iOS/Android apps, designed and built end to end.",
    icon: "devices",
  },
  {
    group: "beyond",
    title: "Remote hiring",
    text: "Developers, designers, Shopify experts and assistants, hired and managed by us.",
    icon: "people",
    href: "#hiring",
  },
];

/* ------------------------------------------------------------------ remote hiring */

export const HIRING = {
  modes: [
    {
      title: "Hire through Ucchas",
      text: "You lead the work. We find, vet and contract the people, and handle payroll and replacements.",
      points: ["You manage day to day", "Contracts and payroll handled", "Free replacement if it's not a fit"], // CONFIRM
    },
    {
      title: "Fully managed team",
      text: "We run them for you, with a single point of contact and clear reporting.",
      points: ["Onboarding and daily stand-ups", "QA and weekly reports", "Cover for leave and holidays"], // CONFIRM
    },
  ],
  roles: [
    "Shopify developer",
    "Shopify Plus / headless",
    "Front-end (React, Next.js)",
    "Full-stack developer",
    "UI/UX designer",
    "QA tester",
    "E-commerce assistant",
    "Customer support",
  ],
  steps: [
    { title: "Hiring call", text: "30 minutes on the role, skills, hours and budget." },
    { title: "Shortlist", text: "Vetted candidates, typically within a week." }, // CONFIRM
    { title: "Interview & trial", text: "Meet them, then start with a trial period." }, // CONFIRM
    { title: "Onboard & run", text: "We handle contracts, payroll and reporting." },
  ],
  vetting: [
    "Paid skills test on a real task",
    "Code review by a senior Ucchas developer",
    "English and communication interview",
    "Reference checks",
  ],
  promises: ["No upfront fees", "Monthly rolling contract", "NDA and full IP ownership"], // CONFIRM
};

/* ------------------------------------------------------------------ process & pricing */

export const PROCESS = [
  { title: "Discover", when: "Day 1", text: "A free 30-minute call about your goals, store and budget." },
  { title: "Plan", when: "Week 1", text: "A written scope, timeline and fixed quote." }, // CONFIRM
  { title: "Design & build", when: "Weeks 2–8", text: "Weekly demos on a staging store you can click through." },
  { title: "Launch", when: "Launch week", text: "QA on real devices, SEO-safe go-live and hands-on support." },
  { title: "Grow", when: "Ongoing", text: "A care plan for fixes, speed, conversion work and new features." },
];

/** ways to work together. `from` is the starting price shown (e.g. "$2,500"); while it is empty the card shows `basis` and "Quoted after a free call" */
export const ENGAGEMENTS = [
  {
    title: "Fixed-price project",
    basis: "Fixed price",
    from: "", // CONFIRM e.g. "$2,500"
    text: "New stores, redesigns and migrations, with a fixed scope and price.",
    points: ["Written scope and timeline", "Weekly demos", "30 days of post-launch fixes"], // CONFIRM
  },
  {
    title: "Monthly care plan",
    basis: "Monthly retainer",
    from: "", // CONFIRM e.g. "$600 / month"
    text: "A set number of hours each month for fixes, speed, SEO and conversion work.",
    points: ["Priority response", "Monthly report", "Cancel any time"], // CONFIRM
  },
  {
    title: "Dedicated developer",
    basis: "Per person, monthly",
    from: "", // CONFIRM e.g. "$1,800 / month"
    text: "A full-time remote developer or designer working as part of your team.",
    points: ["Hired and vetted by us", "Your tools, your hours", "Managed or self-managed"],
  },
];

/* ------------------------------------------------------------------ team */

/**
 * The people a client will work with. Fill in `name` (and `photo`, a path under /public, and
 * `linkedin`) for real people; until a name is set, the card shows the role on its own.
 */
export const TEAM: { name: string; role: string; focus: string; photo?: string; linkedin?: string }[] = [
  { name: "", role: "Founder & CEO", focus: "Strategy, partnerships and client success" },
  { name: "", role: "Head of Shopify", focus: "Liquid, Shopify Plus, checkout and Hydrogen" },
  { name: "", role: "Lead engineer", focus: "Custom apps, integrations and performance" },
  { name: "", role: "Design lead", focus: "UX, brand and conversion-focused design" },
  { name: "", role: "Growth lead", focus: "SEO, CRO, analytics and email" },
  { name: "", role: "Talent lead", focus: "Remote hiring, onboarding and team operations" },
];

/* ------------------------------------------------------------------ testimonials */

/**
 * Real client quotes only. The section stays hidden while this list is empty.
 * Example: { quote: "…", name: "Jane Doe", role: "Founder", company: "Brand Co", photo: "/clients/jane.jpg" }
 */
export const TESTIMONIALS: { quote: string; name: string; role: string; company: string; photo?: string }[] = [];

/* ------------------------------------------------------------------ FAQ */

export const FAQ = [
  {
    q: "How much does a Shopify store cost?",
    a: "It depends on what you need: a theme-based store is a much smaller job than a custom Shopify Plus build. After a free 30-minute call we send a written scope with a fixed price, so you know the cost before anything starts.",
  },
  {
    q: "How long does a project take?",
    a: "A theme-based store can launch in a few weeks. Custom builds and migrations usually take one to three months. You get a timeline with the quote.",
  },
  {
    q: "Shopify or Shopify Plus: which do we need?",
    a: "Most growing brands start on Shopify and move to Plus when they need checkout customisation, B2B, several stores or automation at scale. We'll tell you honestly which one fits, and when it's worth upgrading.",
  },
  {
    q: "Will we lose SEO rankings when we move to Shopify?",
    a: "Not if the move is done properly. We redirect every old URL, keep your metadata and structured data, and watch rankings and traffic closely after launch.",
  },
  {
    q: "Who owns the store and the code?",
    a: "You do. Everything we build for you is yours, and we're happy to sign an NDA before you share business details.",
  },
  {
    q: "Do you help after launch?",
    a: "Yes. Most clients keep a monthly care plan for fixes, speed work, new features and conversion tests, and can pause or cancel it any time.",
  },
  {
    q: "How does remote hiring work?",
    a: "Tell us the role, we send a shortlist of vetted candidates, you interview them and start with a trial. We handle contracts and payroll, and can manage the person day to day if you'd like.",
  },
  {
    q: "Which time zones do you work in?",
    a: "We work remotely with clients around the world and keep regular overlap hours with your team for calls, reviews and urgent fixes.",
  },
];
