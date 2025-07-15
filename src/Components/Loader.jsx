import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const Loader = ({ setLoading }) => {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const assetsLoadedRef = useRef(false);
  const timelineCompletedRef = useRef(false);
  const loadedAssetsCountRef = useRef(0);
  const totalAssetsRef = useRef(0);

  // Preload critical assets
  useEffect(() => {
    // Function to check if both conditions are met to hide loader
    const checkComplete = () => {
      if (assetsLoadedRef.current && timelineCompletedRef.current) {
        gsap.to(".loader-container", {
          opacity: 0,
          duration: 0.5,
          onComplete: () => setLoading(false),
        });
      }
    };
    
    // Function to update progress consistently
    const updateProgress = () => {
      // Calculate weighted progress (70% assets, 30% timeline)
      const assetProgress = loadedAssetsCountRef.current / totalAssetsRef.current;
      const weightedAssetProgress = Math.min(assetProgress * 70, 70); // 70% weight to assets
      const animationProgress = Math.min(progressRef.current, 30); // 30% weight to animation
      
      // Combined progress
      const combinedProgress = Math.min(Math.round(weightedAssetProgress + animationProgress), 100);
      
      // Update both the state and the style directly
      setProgress(combinedProgress);
      
      // Update the progress bar width directly for immediate visual feedback
      const progressBar = document.querySelector(".progress-bar-fill");
      if (progressBar) {
        progressBar.style.width = `${combinedProgress}%`;
      }
    };
    
    const imageUrls = [
      "/images/noise.webp",
      "/images/hero-left-leaf.png",
      "/images/hero-right-leaf.png",
      "/images/logo.png",
      "/fonts/modern-negra.woff2",
      "/fonts/modern-negra.woff",
      "/images/slider-left-leaf.png",
      "/images/slider-right-leaf.png",
      "/images/mask-img.png",
      "/images/under-img.jpg",
      "/images/check.png"
    ];
    
    totalAssetsRef.current = imageUrls.length + 1; // +1 for fonts
    
    // Track font loading
    document.fonts.ready.then(() => {
      // Fonts are loaded
      loadedAssetsCountRef.current += 1;
      updateProgress();
      
      if (loadedAssetsCountRef.current >= totalAssetsRef.current - 1) {
        assetsLoadedRef.current = true;
        checkComplete();
      }
    });

    // Preload images
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedAssetsCountRef.current += 1;
        updateProgress();
        
        if (loadedAssetsCountRef.current >= totalAssetsRef.current - 1) {
          assetsLoadedRef.current = true;
          checkComplete();
        }
      };
      img.onerror = () => {
        // Count errors as loaded to avoid hanging
        loadedAssetsCountRef.current += 1;
        updateProgress();
        
        if (loadedAssetsCountRef.current >= totalAssetsRef.current - 1) {
          assetsLoadedRef.current = true;
          checkComplete();
        }
      };
    });

    return () => {
      // Clean up any image loading
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [setLoading]);

  // Animation timeline
  useEffect(() => {
    // Function to check if both conditions are met to hide loader
    const checkComplete = () => {
      if (assetsLoadedRef.current && timelineCompletedRef.current) {
        gsap.to(".loader-container", {
          opacity: 0,
          duration: 0.5,
          onComplete: () => setLoading(false),
        });
      }
    };
    
    // Function to update progress consistently
    const updateProgress = () => {
      // Calculate weighted progress (70% assets, 30% timeline)
      const assetProgress = loadedAssetsCountRef.current / totalAssetsRef.current;
      const weightedAssetProgress = Math.min(assetProgress * 70, 70); // 70% weight to assets
      const animationProgress = Math.min(progressRef.current, 30); // 30% weight to animation
      
      // Combined progress
      const combinedProgress = Math.min(Math.round(weightedAssetProgress + animationProgress), 100);
      
      // Update both the state and the style directly
      setProgress(combinedProgress);
      
      // Update the progress bar width directly for immediate visual feedback
      const progressBar = document.querySelector(".progress-bar-fill");
      if (progressBar) {
        progressBar.style.width = `${combinedProgress}%`;
      }
    };
    
    // Create a timeline for the loader animation
    const tl = gsap.timeline({
      onComplete: () => {
        timelineCompletedRef.current = true;
        checkComplete();
      },
    });

    // Animate the logo first
    tl.fromTo(
      ".loader-logo",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
    );

    // Then start the progress bar animation (animation portion only)
    tl.to(".animation-progress", {
      width: "100%",
      duration: 3.5,
      ease: "power2.inOut",
      onUpdate: () => {
        // Update animation progress (30% of total)
        const animProgress = Math.round((tl.progress() * 30));
        progressRef.current = animProgress;
        updateProgress();
      },
    });

    // Add a minimum display time to prevent flashing on fast loads
    const minDisplayTime = setTimeout(() => {
      if (document.readyState === "complete") {
        timelineCompletedRef.current = true;
        checkComplete();
      }
    }, 2500);

    return () => {
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
            {/* Hidden element for animation tracking */}
            <div className="animation-progress hidden"></div>
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
