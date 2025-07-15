import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const Loader = ({ setLoading }) => {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    // Create a timeline for the loader animation
    const tl = gsap.timeline({
      onComplete: () => {
        // Hide loader after completion with a fade out
        gsap.to(".loader-container", {
          opacity: 0,
          duration: 0.5,
          onComplete: () => setLoading(false),
        });
      },
    });

    // Animate the logo first
    tl.fromTo(
      ".loader-logo",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
    );

    // Then start the progress bar
    tl.to(".progress-bar-fill", {
      width: "100%",
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        // Update progress state based on the animation progress
        const progressValue = Math.round((tl.time() / 3.1) * 100);
        const cappedValue = Math.min(progressValue, 100);
        progressRef.current = cappedValue;
        setProgress(cappedValue);
      },
    });

    // Ensure the document is fully loaded
    const handleLoad = () => {
      // If window load happens before animation completes, speed up to 100%
      if (progressRef.current < 100) {
        gsap.to(".progress-bar-fill", {
          width: "100%",
          duration: 0.5,
          ease: "power2.inOut",
          onUpdate: () => setProgress(100),
          onComplete: () => {
            gsap.to(".loader-container", {
              opacity: 0,
              duration: 0.5,
              onComplete: () => setLoading(false),
            });
          },
        });
      }
    };

    window.addEventListener("load", handleLoad);

    // Add a minimum display time to prevent flashing on fast loads
    const minDisplayTime = setTimeout(() => {
      if (document.readyState === "complete") {
        handleLoad();
      }
    }, 2000);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(minDisplayTime);
    };
  }, [setLoading]);

  return (
    <div className="loader-container fixed inset-0 z-50 flex-center bg-black">
      <div className="noisy opacity-20"></div>
      <div className="w-full max-w-md px-4">
        <div className="flex flex-col items-center space-y-8">
          <div className="loader-logo">
            <h1 className="text-5xl font-modern-negra text-yellow mb-2">
              COCKTAIL
            </h1>
            <p className="text-center text-white/70">Premium Experience</p>
          </div>

          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="progress-bar-fill h-full bg-yellow"
              style={{ width: "0%" }}
            ></div>
          </div>

          <div className="flex justify-between w-full">
            <span className="text-white/70 text-sm">Loading assets</span>
            <span className="text-white font-medium">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
