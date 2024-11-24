import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SlideshowProps } from "./Slideshow.types";
import styles from "./Slideshow.module.scss";

const Slideshow: React.FC<SlideshowProps> = ({
  slides,
  autoSlide = true,
  interval = 6000,
  prev = "Previous",
  next = "Next",
  basePath = "/slideshow",
  enableRouting = true,
  stopAutoSlideOnInteraction = false,
}) => {
  if (enableRouting && !basePath) {
    throw new Error("basePath is required when routing is enabled.");
  }

  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const currentRouteIndex = enableRouting
    ? slides.findIndex((slide) => slide.slug === slug)
    : -1;

  const [currentIndex, setCurrentIndex] = useState(() =>
    currentRouteIndex !== -1 ? currentRouteIndex : 0,
  );
  const [loadedImages, setLoadedImages] = useState<Set<number>>(
    new Set([currentIndex]),
  );
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const restartTimer = useCallback(() => {
    clearTimer();
    if (autoSlide && (!stopAutoSlideOnInteraction || !isUserInteracted)) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, interval);
    }
  }, [
    autoSlide,
    interval,
    slides.length,
    isUserInteracted,
    stopAutoSlideOnInteraction,
  ]);

  useEffect(() => {
    if (enableRouting) {
      if (currentRouteIndex !== -1) {
        setCurrentIndex(currentRouteIndex);
      } else {
        navigate(`${basePath}/${slides[0].slug}`);
      }
    }
    restartTimer();
  }, [
    slug,
    currentRouteIndex,
    slides,
    navigate,
    restartTimer,
    basePath,
    enableRouting,
  ]);

  useEffect(() => {
    restartTimer();
    return clearTimer;
  }, [restartTimer]);

  const handleUserInteraction = (newIndex: number, action: () => void) => {
    setCurrentIndex(newIndex);
    setIsUserInteracted(true);
    action();
  };

  const handlePrevUserTriggered = () =>
    handleUserInteraction(
      (currentIndex - 1 + slides.length) % slides.length,
      () => {
        if (enableRouting) {
          navigate(
            `${basePath}/${slides[(currentIndex - 1 + slides.length) % slides.length].slug}`,
          );
        }
        restartTimer();
      },
    );

  const handleButtonUserTriggered = (newIndex: number) =>
    handleUserInteraction(newIndex, () => {
      if (enableRouting) {
        navigate(`${basePath}/${slides[newIndex].slug}`);
      }
      restartTimer();
    });

  const handleNextUserTriggered = () =>
    handleUserInteraction((currentIndex + 1) % slides.length, () => {
      if (enableRouting) {
        navigate(
          `${basePath}/${slides[(currentIndex + 1) % slides.length].slug}`,
        );
      }
      restartTimer();
    });

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  const getLoadingAttribute = (index: number): "eager" | "lazy" | undefined => {
    if (index === currentIndex) return "eager";
    if (loadedImages.has((index - 1 + slides.length) % slides.length)) {
      return "lazy";
    }
    return undefined;
  };

  return (
    <div
      className="playstationSlideshow"
      aria-roledescription="carousel"
      aria-label="Slideshow"
    >
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
            role="group"
            aria-roledescription="slide"
            aria-label={`${
              slide.alt || `Slide ${index + 1} of ${slides.length}`
            }`}
            aria-hidden={index !== currentIndex}
          >
            <img
              loading={getLoadingAttribute(index)}
              src={`/assets/images/${slide.background}`}
              alt={slide.alt || `Slide ${index + 1}`}
              onLoad={() => handleImageLoad(index)}
              style={{ display: "none" }}
            />
          </div>
        ))}
      </div>

      <div className={styles.slideshowNavigation}>
        {prev && (
          <button
            onClick={handlePrevUserTriggered}
            aria-label="Previous slide"
            aria-controls="slideshow"
          >
            {prev}
          </button>
        )}
        {next && (
          <button
            onClick={handleNextUserTriggered}
            aria-label="Next slide"
            aria-controls="slideshow"
          >
            {next}
          </button>
        )}
      </div>

      <div className={styles.slideshowIndicators} role="tablist">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleButtonUserTriggered(index)}
            className={`${styles.thumbnail} ${
              index === currentIndex ? styles.active : ""
            }`}
            role="tab"
            aria-selected={index === currentIndex}
            aria-controls={`slide-${index}`}
            id={`tab-${index}`}
          >
            <img
              src={`/assets/images/${slides[index].thumbnail}`}
              alt={slides[index].alt || `Slide thumbnail ${index + 1}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
