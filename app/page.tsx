import Cursor from "@/components/Cursor";
import Film from "@/components/Film";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Process from "@/components/Process";
import ShaderCanvas from "@/components/ShaderCanvas";
import SmoothScroll from "@/components/SmoothScroll";
import Story from "@/components/Story";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <ShaderCanvas />
      <SmoothScroll />
      <Cursor />
      <Nav />
      <main className="main">
        <Hero />
        <Film />
        <Story />
        <Work />
        <Process />
      </main>
      <Footer />
    </>
  );
}
