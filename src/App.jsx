import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Cocktails from "./Components/Cocktails";
import About from "./Components/About";
import Art from "./Components/Art";
import Menu from "./Components/Menu";
import Contact from "./Components/Contact";
import Loader from "./Components/Loader";

gsap.registerPlugin(ScrollTrigger, SplitText);

function App() {
  const [loading, setLoading] = useState(true);

  // Prevent scrolling while loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";

      // Initialize any animations that depend on fully loaded content
      gsap.to("main", {
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [loading]);

  return (
    <>
      {loading && <Loader setLoading={setLoading} />}

      <main style={{ opacity: loading ? 0 : 1 }}>
        <Navbar />
        {!loading && <Hero />}
        <Cocktails />
        <About />
        <Art />
        <Menu />
        <Contact />
      </main>
    </>
  );
}

export default App;
