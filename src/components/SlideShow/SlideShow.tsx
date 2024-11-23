import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { SlideshowProps } from "./Slideshow.types";
import styles from "./Slideshow.module.scss";

const Slideshow: React.FC<SlideshowProps> = ({
  slides,
  autoSlide = true,
  interval = 3000,
  prev = "Previous",
  next = "Next",
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentRouteIndex = parseInt(
    new URLSearchParams(location.search).get("slide") || "0",
    10,
  );

  const [currentIndex, setCurrentIndex] = useState(currentRouteIndex);

  useEffect(() => {
    setCurrentIndex(currentRouteIndex);
  }, [currentRouteIndex]);

  const handleNextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoSlide) return;

    const slideInterval = setInterval(() => {
      handleNextSlide();
    }, interval);

    return () => clearInterval(slideInterval);
  }, [handleNextSlide, autoSlide, interval]);

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

  return (
    <div className="playstationSlideshow">
      <div className={styles.slideContainer}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.slide} ${
              index === currentIndex ? styles.active : ""
            }`}
            style={{
              backgroundImage: `url(/assets/images/${slide.background})`,
            }}
          >
            {/* Fallback hidden image for preloading */}
            <img
              loading="lazy"
              src={`/assets/images/${slide.background}`}
              alt={slide.alt || `Slide ${index}`}
              style={{ display: "none" }}
            />
          </div>
        ))}
      </div>

      <div className={styles.slideshowNavigation}>
        {prev && <button onClick={handlePrevUserTriggered}>{prev}</button>}
        {next && <button onClick={handleNextUserTriggered}>{next}</button>}
      </div>

      <div className={styles.slideshowIndicators}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleButtUserTriggered(index)}
            className={`${styles.thumbnail} ${
              index === currentIndex ? styles.active : ""
            }`}
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
