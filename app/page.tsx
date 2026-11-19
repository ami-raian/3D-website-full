import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Process from "@/components/Process";
import SmoothScroll from "@/components/SmoothScroll";
import Story from "@/components/Story";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <div className="backdrop" aria-hidden />
      <SmoothScroll />
      <Cursor />
      <Nav />
      <main className="main">
        <Hero />
        <Story />
        <Work />
        <Process />
      </main>
      <Footer />
    </>
  );
}
