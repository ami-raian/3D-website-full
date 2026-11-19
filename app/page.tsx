import About from "@/components/About";
import Contact from "@/components/Contact";
import Nav from "@/components/Nav";
import Services from "@/components/Services";
import SmoothScroll from "@/components/SmoothScroll";
import Story from "@/components/Story";
import Technologies from "@/components/Technologies";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <div className="backdrop" aria-hidden />
      <SmoothScroll />
      <Nav />
      <main id="top" className="main">
        <About />
        <Story />
        <Services />
        <Work />
        <Technologies />
        <Contact />
      </main>
    </>
  );
}
