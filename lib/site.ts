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
  { to: 150, suffix: "+", label: "Projects delivered" },
  { to: 9, suffix: " yrs", label: "In business" },
  { to: 40, suffix: "+", label: "Remote hires placed" },
  { to: 98, suffix: "%", label: "Clients who come back" },
];

/* ------------------------------------------------------------------ why Ucchas */

/** the line icons in components/LineIcon.tsx */
export type IconName = "bag" | "cart" | "browser" | "people" | "phone" | "pen" | "cube";

/** reasons to choose Ucchas: specific and checkable beats generic ("quality, on time") */
export const WHY = [
  {
    title: "Commerce specialists",
    text: "Shopify and e-commerce are our core. We know what makes a store fast and profitable.",
  },
  {
    title: "Senior engineers",
    text: "Experienced developers and designers do the work, and you talk to them directly.",
  },
  {
    title: "Fixed price upfront",
    text: "A written scope and a fixed quote before any work starts. No surprises.", // CONFIRM
  },
  {
    title: "Here after launch",
    text: "Support, maintenance and new features after go-live. Cancel any time.", // CONFIRM
  },
];

/* ------------------------------------------------------------------ services */


/** the four main services; each gets a large tile with a small illustration */
export type MainService = "shopify" | "commerce" | "web" | "hiring";

export type Service = {
  title: string;
  text: string;
  icon: IconName;
  /** set on the main services */
  main?: MainService;
  /** short keywords shown on the main tiles */
  tags?: string[];
  /** optional in-page link, e.g. "#hiring" */
  href?: string;
};

/** the main services first (Shopify, e-commerce, web, remote hiring), then the rest */
export const SERVICES: Service[] = [
  {
    main: "shopify",
    title: "Shopify development",
    text: "Everything Shopify: new stores, custom themes and apps, migrations and Shopify Plus.",
    tags: ["Store setup", "Custom themes", "Apps", "Migration", "Shopify Plus"],
    icon: "bag",
  },
  {
    main: "commerce",
    title: "E-commerce development",
    text: "Online stores and marketplaces on WooCommerce, BigCommerce or a custom stack.",
    tags: ["WooCommerce", "BigCommerce", "Headless", "Marketplaces"],
    icon: "cart",
  },
  {
    main: "web",
    title: "Web development",
    text: "Fast company websites, web apps and dashboards.",
    icon: "browser",
  },
  {
    main: "hiring",
    title: "Remote hiring",
    text: "Vetted developers, designers and assistants who join your team. We hire, manage and pay them.",
    icon: "people",
    href: "#hiring",
  },
  {
    title: "Mobile apps",
    text: "iOS and Android apps, built once with React Native.",
    icon: "phone",
  },
  {
    title: "UI/UX design",
    text: "Clear, good-looking interfaces, from wireframes to design systems.",
    icon: "pen",
  },
  {
    title: "Custom software",
    text: "SaaS platforms, internal tools, APIs and integrations.",
    icon: "cube",
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
    "Front-end (React, Next.js)",
    "Full-stack developer",
    "Mobile developer",
    "UI/UX designer",
    "QA tester",
    "E-commerce assistant",
    "Customer support",
  ],
  promises: ["No upfront fees", "Monthly rolling contract", "NDA and full IP ownership"], // CONFIRM
};

/* ------------------------------------------------------------------ process */

export const PROCESS = [
  { title: "Discover", when: "Day 1", text: "A free 30-minute call about your goals, project and budget." },
  { title: "Plan", when: "Week 1", text: "A written scope, timeline and fixed quote." }, // CONFIRM
  { title: "Design & build", when: "Weeks 2–8", text: "Weekly demos on a staging site you can click through." },
  { title: "Launch", when: "Launch week", text: "Testing on real devices, a safe go-live and hands-on support." },
  { title: "Grow", when: "Ongoing", text: "Support, maintenance and new features, month by month." },
];

/* ------------------------------------------------------------------ team */

/**
 * The people a client will work with. Fill in `name` (and `photo`, a path under /public, and
 * `linkedin`) for real people; until a name is set, the card shows the role on its own.
 */
export const TEAM: { name: string; role: string; focus: string; photo?: string; linkedin?: string }[] = [
  { name: "", role: "Founder & CEO", focus: "Strategy, partnerships and client success" },
  { name: "", role: "CTO", focus: "Architecture, code quality and security" },
  { name: "", role: "Shopify lead", focus: "Shopify stores, apps and Shopify Plus" },
  { name: "", role: "Design lead", focus: "UI/UX, brand and design systems" },
  { name: "", role: "Project manager", focus: "Timelines, communication and delivery" },
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
    q: "What does Ucchas do?",
    a: "We're an IT company. Most of our work is Shopify stores, e-commerce development and remote hiring, and we also build websites, web apps, mobile apps and custom software.",
  },
  {
    q: "How much does a project cost?",
    a: "It depends on the scope. After a free 30-minute call we send a written scope with a fixed price, so you know the cost before any work starts.",
  },
  {
    q: "How long does a project take?",
    a: "A website or a theme-based store can launch in a few weeks. Custom builds, apps and migrations usually take one to three months. You get a timeline with the quote.",
  },
  {
    q: "How does remote hiring work?",
    a: "Tell us the role, we send a shortlist of vetted candidates, you interview them and start with a trial. We handle contracts and payroll, and can manage the person day to day if you'd like.",
  },
  {
    q: "Do you help after launch?",
    a: "Yes. Most clients keep a monthly plan for support, maintenance and new features, and can pause or cancel it any time.",
  },
];
