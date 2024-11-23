import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { SlideshowProps } from "./Slideshow.types";
import styles from "./Slideshow.module.scss";

/**
 * Slideshow Component
 *
 * A reusable slideshow component that supports auto-sliding and user-controlled navigation.
 * - Auto-sliding: Slides advance automatically at a configurable interval without affecting the URL.
 * - User navigation: Supports next/previous buttons and clickable slide indicators, which update the URL and notify Redux.
 * - Route integration: Extracts the current slide index from the URL for synchronization but decouples auto-sliding from routing.
 *
 * Props:
 * - slides: An array of slide data, each with an image filename and optional alt text.
 * - autoSlide (boolean): Enables or disables automatic sliding (default: true).
 * - interval (number): Time in milliseconds between auto-slides (default: 3000ms).
 * - navigation (boolean): Enables or disables 'previous' and 'next' controls (default: true).
 */
const Slideshow: React.FC<SlideshowProps> = ({
  slides,
  autoSlide = true,
  interval = 3000,
  prev = "Previous",
  next = "Next",
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the current slide index from the route for user-triggered navigation
  const currentRouteIndex = parseInt(
    new URLSearchParams(location.search).get("slide") || "0",
    10
  );

  // Maintain local state for auto-slide index
  const [currentIndex, setCurrentIndex] = useState(currentRouteIndex);

  // Keep track of which slides have been preloaded
  const [preloadedSlides, setPreloadedSlides] = useState(new Set<number>([currentRouteIndex]));

  // Sync local state with route on user-triggered navigation
  useEffect(() => {
    setCurrentIndex(currentRouteIndex);
  }, [currentRouteIndex]);

  // Handle navigation to the next slide
  const handleNextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  // Handle auto-slide functionality
  useEffect(() => {
    if (!autoSlide) return;

    const slideInterval = setInterval(() => {
      handleNextSlide();
    }, interval);

    return () => clearInterval(slideInterval);
  }, [handleNextSlide, autoSlide, interval]);

  // Manual navigation on user interaction
  const handlePrevUserTriggered = () => {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    setCurrentIndex(newIndex);
    navigate(`/ricoSlideshow/${slides[newIndex].slug}`);
  };

  const handleButtUserTriggered = (newIndex: number) => {
    setCurrentIndex(newIndex);
    navigate(`/ricoSlideshow/${slides[newIndex].slug}`);
  };

  const handleNextUserTriggered = () => {
    const newIndex = (currentIndex + 1) % slides.length;
    setCurrentIndex(newIndex);
    navigate(`/ricoSlideshow/${slides[newIndex].slug}`);
  };

  // Sequentially preload background images
  useEffect(() => {
    const preloadSlide = (index: number) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = `/assets/images/${slides[index].background}`;
        img.onload = () => resolve();
      });
    };

    const sequentialPreload = async () => {
      for (let i = 1; i < slides.length; i++) {
        const nextIndex = (currentRouteIndex + i) % slides.length; // Preload in slideshow order
        await preloadSlide(nextIndex);
        setPreloadedSlides((prev) => new Set(prev).add(nextIndex)); // Mark as preloaded
      }
    };

    sequentialPreload();
  }, [currentRouteIndex, slides]);

  return (
    <div className="playstationSlideshow">
      <div className={`${styles.slideContainer}`}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.slide}${index === currentIndex ? ` ${styles.active}` : ""}`}
            style={{
              backgroundImage: `url(/assets/images/${slide.background})`,
              opacity: preloadedSlides.has(index) || index === currentIndex ? 1 : 0,
              transition: "opacity 0.5s ease-in-out", // Optional: smooth fade-in
            }}
          >
            {/* Hidden <img> tag for fallback preloading */}
            <img
              loading="lazy"
              src={`/assets/images/${slide.background}`}
              alt={`Slide ${index}`}
              style={{ display: "none" }} // Prevent visible image flash
            />
          </div>
        ))}
      </div>

      <div className="slideshowNavigation">
        {prev && <button onClick={handlePrevUserTriggered}>{prev}</button>}
        {next && <button onClick={handleNextUserTriggered}>{next}</button>}
      </div>

      <div className="slideshowIndicators">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleButtUserTriggered(index)}
            className={`${styles.thumbnail}${index === currentIndex ? ` ${styles.active}` : ""}`}
          >
            <img
              src={`/assets/images/${slides[index].thumbnail}`}
              alt={slides[index].alt || `Button ${index}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
