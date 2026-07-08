"use client";

import { useCallback, useEffect, useRef, useState } from "react";
const SPLASH_DURATION = 5500;
const SPLASH_REPLAY_EVENT = "portfolio:replay-splash";

function SplashLogo() {
  return (
    <div id="logo" className="splash_logo_mark" aria-label="Portfolio loading">
      <div className="splash_logo_symbol">
        <img
          src="/logo-soham.png"
          alt="Soham logo"
          className="splash_logo_image"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
        />
      </div>
      <div className="splash_name_line">
        <span className="splash_name_text">Soham Patel</span>
      </div>
    </div>
  );
}

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const timerRef = useRef();

  const replaySplash = useCallback(() => {
    window.clearTimeout(timerRef.current);
    setAnimationKey((current) => current + 1);
    setIsVisible(true);

    timerRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, SPLASH_DURATION);
  }, []);

  const handleSplashAnimationEnd = useCallback((event) => {
    if (event.animationName === "splash-grow") {
      window.clearTimeout(timerRef.current);
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    const logoImage = new Image();
    logoImage.src = "/logo-soham.png";

    timerRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, SPLASH_DURATION);

    window.addEventListener(SPLASH_REPLAY_EVENT, replaySplash);

    return () => {
      window.clearTimeout(timerRef.current);
      window.removeEventListener(SPLASH_REPLAY_EVENT, replaySplash);
    };
  }, [replaySplash]);

  if (!isVisible) {
    return null;
  }

  return (
    <div key={animationKey} className="splash_logo_wrapper" aria-hidden="true">
      <div className="splash_screen" onAnimationEnd={handleSplashAnimationEnd}>
        <SplashLogo />
      </div>
    </div>
  );
}
