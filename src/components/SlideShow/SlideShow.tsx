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
    10,
  );

  // Maintain local state for auto-slide index
  const [currentIndex, setCurrentIndex] = useState(currentRouteIndex);

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

  // Manual navigation on user interaction
  const handleButtUserTriggered = (newIndex: number) => {
    setCurrentIndex(newIndex);
    navigate(`/ricoSlideshow/${slides[newIndex].slug}`);
  };

  // Manual navigation on user interaction
  const handleNextUserTriggered = () => {
    const newIndex = (currentIndex + 1) % slides.length;
    setCurrentIndex(newIndex);
    navigate(`/ricoSlideshow/${slides[newIndex].slug}`);
  };

  return (
    <div className="playstationSlideshow">
      <div className={`${styles.slideContainer}`}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.slide}${index === currentIndex ? ` ${styles.active}` : ""}`}
          >
            <img
              src={"/assets/images/" + slide.background}
              alt={`Slide ${index}`}
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
              src={"/assets/images/" + slides[index].thumbnail}
              alt={slides[index].alt || `Button ${index}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
