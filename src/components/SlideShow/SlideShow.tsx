import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [loadedImages, setLoadedImages] = useState<Set<number>>(
    new Set([currentRouteIndex]), // Start with the deep-linked image loaded
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const restartTimer = useCallback(() => {
    clearTimer();
    if (autoSlide) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, interval);
    }
  }, [autoSlide, interval, slides.length]);

  useEffect(() => {
    setCurrentIndex(currentRouteIndex);
    restartTimer();
  }, [currentRouteIndex, restartTimer]);

  useEffect(() => {
    restartTimer();
    return clearTimer; // Clear timer on component unmount
  }, [restartTimer]);

  const handlePrevUserTriggered = () => {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    setCurrentIndex(newIndex);
    navigate(`/ricoSlideshow/${slides[newIndex].slug}`);
    restartTimer();
  };

  const handleButtUserTriggered = (newIndex: number) => {
    setCurrentIndex(newIndex);
    navigate(`/ricoSlideshow/${slides[newIndex].slug}`);
    restartTimer();
  };

  const handleNextUserTriggered = () => {
    const newIndex = (currentIndex + 1) % slides.length;
    setCurrentIndex(newIndex);
    navigate(`/ricoSlideshow/${slides[newIndex].slug}`);
    restartTimer();
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index)); // Mark image as loaded
  };

  const getLoadingAttribute = (index: number): "eager" | "lazy" | undefined => {
    if (index === currentIndex) return "eager"; // Load the deep-linked image eagerly
    if (loadedImages.has((index - 1 + slides.length) % slides.length)) {
      return "lazy"; // Load sequentially only if the previous slide is loaded
    }
    return undefined; // Defer loading until the previous slide is ready
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
            <img
              loading={getLoadingAttribute(index)}
              src={`/assets/images/${slide.background}`}
              alt={slide.alt || `Slide ${index}`}
              onLoad={() => handleImageLoad(index)} // Notify when image is loaded
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
