import { vars } from "@/lib/css";

/** Splits text into individually animatable characters. */
export default function Chars({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {Array.from(text).map((c, i) => (
        <span key={i} className="ch" style={vars({ "--i": start + i })} aria-hidden>
          {c === " " ? " " : c}
        </span>
      ))}
    </>
  );
}
