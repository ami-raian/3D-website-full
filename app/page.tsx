import Marquee from "@/components/Marquee";
import SmoothScroll from "@/components/SmoothScroll";
import Story from "@/components/Story";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <div className="backdrop" aria-hidden />
      <SmoothScroll />
      <main className="main">
        <Story />
        <Work />
        <Marquee />
      </main>
    </>
  );
}
