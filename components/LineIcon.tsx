import type { IconName } from "@/lib/site";

/** simple line icons, drawn on a 24×24 grid with a 1.6px stroke (styled by .line-icon) */
const PATHS: Record<IconName, React.ReactNode> = {
  bag: (
    <>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h11v8H8.5L4 16.5V5z" />
      <path d="M15 9h5v9.5L16.5 16H10v-3" />
    </>
  ),
  quote: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M9.5 14l2 2 3.5-4" />
    </>
  ),
  bolt: <path d="M13 2.5 5.5 13H11l-1 8.5L17.5 11H12l1-8.5z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  loop: (
    <>
      <path d="M19 9a7.5 7.5 0 0 0-13-2L4.5 8.5" />
      <path d="M4.5 4.5v4h4" />
      <path d="M5 15a7.5 7.5 0 0 0 13 2l1.5-1.5" />
      <path d="M19.5 19.5v-4h-4" />
    </>
  ),
  code: (
    <>
      <path d="M8.5 7 3.5 12l5 5" />
      <path d="m15.5 7 5 5-5 5" />
      <path d="m13.5 4.5-3 15" />
    </>
  ),
  move: (
    <>
      <path d="M4 8h13" />
      <path d="M13.5 4.5 17 8l-3.5 3.5" />
      <path d="M20 16H7" />
      <path d="M10.5 12.5 7 16l3.5 3.5" />
    </>
  ),
  trend: (
    <>
      <path d="M3.5 17.5 9 12l4 3.5 7.5-8" />
      <path d="M15.5 7.5h5v5" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H6.4" />
      <circle cx="9.5" cy="19" r="1.4" />
      <circle cx="16.5" cy="19" r="1.4" />
    </>
  ),
  devices: (
    <>
      <rect x="2.5" y="4.5" width="13.5" height="10" rx="1.5" />
      <path d="M6.5 19h5M9 14.5V19" />
      <rect x="17.5" y="8.5" width="4.5" height="11" rx="1.2" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 5.8a3 3 0 0 1 0 5.4" />
      <path d="M17.2 14.3a5.5 5.5 0 0 1 3.3 5.2" />
    </>
  ),
};

export default function LineIcon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg className={`line-icon ${className}`} viewBox="0 0 24 24" aria-hidden>
      {PATHS[name]}
    </svg>
  );
}
