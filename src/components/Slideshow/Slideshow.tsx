import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SlideshowProps } from "./Slideshow.types";
import ImagePreloader from "utils/ImagePreloader";
import styles from "./Slideshow.module.scss";

const Slideshow: React.FC<SlideshowProps> = ({
  slides,
  initialAutoSlide = true,
  interval = 6000,
  basePath = "/slideshow",
  enableRouting = true,
  restartDelay = 12000,
  previousLabel = "< Previous",
  nextLabel = "Next >",
  resumeLabel = "Restart",
  pauseLabel = "Pause",
}) => {
  const isFirstRender = useRef(true);
  const stableSlides = useMemo(() => slides, [slides]);

  if (enableRouting && !basePath) {
    console.error("'basePath' is required when routing is enabled.");
  }
  const navigate = useNavigate();

  const navigateRef = useRef(navigate);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const { slug } = useParams<{ slug?: string }>();
  if (enableRouting && !slug) {
    navigateRef.current(`${basePath}/${slides[0].slug}`);
  }

  const currentRouteIndex = enableRouting
    ? stableSlides.findIndex((slide) => slide.slug === slug)
    : -1;

  useEffect(() => {
    const sources = slides.map((slide) => slide.background);
    const preloader = new ImagePreloader(sources, currentRouteIndex);
    preloader.preload();
  }, [currentRouteIndex, slides]);

  const [currentIndex, setCurrentIndex] = useState(() =>
    currentRouteIndex !== -1 ? currentRouteIndex : 0,
  );

  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailRefs = useRef<HTMLButtonElement[]>([]);

  const clearTimer = useCallback(() => {
    console.log("clearTimer");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPaused(true);
  }, []);

  const startAutoSlide = useCallback(
    (immediateSlide = false) => {
      console.log("startAutoSlide");
      clearTimer();
      setIsPaused(false);
      // TODO: Is this the appropriate condition?
      if (initialAutoSlide) {
        if (immediateSlide) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % stableSlides.length);
        }
        timerRef.current = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % stableSlides.length);
        }, interval);
      }
    },
    [initialAutoSlide, interval, stableSlides.length, clearTimer],
  );

  const restartTimer = useCallback(() => {
    clearTimer();
    if (restartDelay === -1) {
      return;
    }
    if (initialAutoSlide && !isPausedRef.current) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % stableSlides.length);
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % stableSlides.length);
      }, interval);
    }
  }, [
    initialAutoSlide,
    interval,
    restartDelay,
    stableSlides.length,
    clearTimer,
  ]);

  useEffect(() => {
    if (!isPausedRef.current) {
      if (enableRouting) {
        if (isFirstRender.current) {
          if (currentRouteIndex !== -1) {
            setCurrentIndex(currentRouteIndex);
          } else {
            navigateRef.current(`${basePath}/${stableSlides[0].slug}`);
          }
          isFirstRender.current = false;
        }
      }
      if (!isFirstRender.current || initialAutoSlide) {
        startAutoSlide();
      }
    }
  }, [
    slug,
    currentRouteIndex,
    stableSlides,
    navigateRef,
    startAutoSlide,
    basePath,
    enableRouting,
    restartDelay,
    initialAutoSlide,
  ]);

  useEffect(() => {
    if (thumbnailRefs.current[currentIndexRef.current]) {
      thumbnailRefs.current[currentIndexRef.current].focus();
    }
  });

  const handleUserInteraction = useCallback(
    (newIndex: number) => {
      setCurrentIndex(newIndex);
      if (enableRouting) {
        const route = `${basePath}/${stableSlides[newIndex].slug}`;
        navigateRef.current(route);
      }
      clearTimer();

      if (restartDelay > 0 && !isPausedRef.current) {
        timerRef.current = setTimeout(() => {
          restartTimer();
        }, restartDelay);
      }
    },
    [
      restartDelay,
      restartTimer,
      clearTimer,
      enableRouting,
      basePath,
      stableSlides,
    ],
  );

  const handlePrevUserTriggered = useCallback(() => {
    const newIndex =
      (currentIndexRef.current - 1 + stableSlides.length) % stableSlides.length;
    handleUserInteraction(newIndex);
  }, [stableSlides, handleUserInteraction]);

  const handleNextUserTriggered = useCallback(() => {
    const newIndex = (currentIndexRef.current + 1) % stableSlides.length;
    handleUserInteraction(newIndex);
  }, [stableSlides, handleUserInteraction]);

  useEffect(() => {
    console.log("useEffect triggered");
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrevUserTriggered();
      } else if (event.key === "ArrowRight") {
        handleNextUserTriggered();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // clearTimer();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePrevUserTriggered, handleNextUserTriggered, clearTimer]);

  const togglePause = () => {
    if (isPausedRef.current) {
      startAutoSlide(true);
    } else {
      clearTimer();
    }
  };

  return (
    <div
      className={`${styles.bbaysingerSlideshow} bbaysinger-slideshow`}
      aria-roledescription="carousel"
      aria-label="Slideshow"
      aria-live="polite"
    >
      <div className={`${styles.slideWrapper}  slide-wrapper`}>
        {stableSlides.map((slide, index) => (
          <div
            tabIndex={index === currentIndex ? 0 : -1}
            key={index}
            className={`${styles.slide} ${
              index === currentIndex ? styles.active : ""
            }`}
            style={{
              backgroundImage: `url(${slide.background})`,
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${
              slide.alt || `Slide ${index + 1} of ${stableSlides.length}`
            }`}
            aria-hidden={index !== currentIndex}
          ></div>
        ))}
      </div>

      <div className={`${styles.contentWrapper} content-wrapper`}>
        {stableSlides.map((_, index) => (
          <div
            key={index}
            className={`${styles.content} ${index === currentIndex && styles.active}`}
          >
            {stableSlides[index].content}
          </div>
        ))}
      </div>

      <div className={`${styles.arrowButtonWrapper} arrow-button-wrapper`}>
        {previousLabel && (
          <button
            onClick={handlePrevUserTriggered}
            aria-label="Previous slide"
            aria-controls="slideshow"
          >
            {previousLabel}
          </button>
        )}
        <button
          onClick={togglePause}
          aria-label={
            isPausedRef.current ? "Restart slideshow" : "Pause slideshow"
          }
        >
          {isPausedRef.current ? resumeLabel : pauseLabel}
        </button>
        {nextLabel && (
          <button
            onClick={handleNextUserTriggered}
            aria-label="Next slide"
            aria-controls="slideshow"
          >
            {nextLabel}
          </button>
        )}
      </div>

      <div
        className={`${styles.thumbnailButtonWrapper} thumbnail-button-wrapper`}
        role="tablist"
      >
        {stableSlides.map((_, index) => (
          <button
            key={index}
            ref={(el) => (thumbnailRefs.current[index] = el!)}
            onClick={() => handleUserInteraction(index)}
            className={`${styles.thumbnail} ${
              index === currentIndex ? `${styles.active} active` : ""
            } thumbnail`}
            role="tab"
            aria-selected={index === currentIndex}
            aria-controls={`slide-${index}`}
            id={`tab-${index}`}
          >
            {stableSlides[index].thumbnail ? (
              <img
                src={stableSlides[index].thumbnail}
                alt={stableSlides[index].alt || `Slide thumbnail ${index + 1}`}
              />
            ) : (
              <span className="visually-hidden">{`Slide ${index + 1}`}</span>
            )}
          </button>
        ))}
      </div>
      <p className={`${styles.visuallyHidden} visually-hidden`}>
        Use the left and right arrow keys to navigate the slideshow.
      </p>
    </div>
  );
};

export default Slideshow;
