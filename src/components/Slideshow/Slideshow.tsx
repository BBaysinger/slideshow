import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SlideshowProps } from "./Slideshow.types";
import styles from "./Slideshow.module.scss";

const Slideshow: React.FC<SlideshowProps> = ({
  slides,
  autoSlide = true,
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
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailRefs = useRef<HTMLButtonElement[]>([]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPaused(true);
  }, []);

  const startAutoSlide = useCallback(
    (immediateSlide = false) => {
      clearTimer();
      setIsPaused(false);
      if (autoSlide) {
        if (immediateSlide) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }
        timerRef.current = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, interval);
      }
    },
    [autoSlide, interval, slides.length, clearTimer],
  );

  const restartTimer = useCallback(() => {
    clearTimer();
    if (restartDelay === -1) {
      return;
    }
    if (autoSlide && !isPaused) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, interval);
    }
  }, [autoSlide, interval, restartDelay, slides.length, clearTimer, isPaused]);

  const handleUserInteraction = useCallback(
    (newIndex: number, action: () => void) => {
      setCurrentIndex(newIndex);
      action();
      clearTimer();

      if (restartDelay > 0 && !isPaused) {
        timerRef.current = setTimeout(() => {
          restartTimer();
        }, restartDelay);
      }
    },
    [restartDelay, restartTimer, clearTimer, isPaused],
  );

  useEffect(() => {
    if (!isPaused) {
      if (enableRouting) {
        if (isFirstRender.current) {
          if (currentRouteIndex !== -1) {
            setCurrentIndex(currentRouteIndex);
          } else {
            navigate(`${basePath}/${slides[0].slug}`);
          }
          isFirstRender.current = false;
        }
      }
      startAutoSlide();
    }
  }, [
    slug,
    currentRouteIndex,
    slides,
    navigate,
    startAutoSlide,
    basePath,
    enableRouting,
    restartDelay,
    isPaused,
  ]);

  // TODO: Handle garbage collection and figure if this is otherwise necessary.
  // useEffect(() => {
  //   if (autoSlide && restartDelay !== -1) {
  //     startAutoSlide();
  //   }
  //   return clearTimer;
  // }, [autoSlide, startAutoSlide, restartDelay, clearTimer]);

  useEffect(() => {
    if (thumbnailRefs.current[currentIndex]) {
      thumbnailRefs.current[currentIndex].focus();
    }
  }, [currentIndex]);

  const handlePrevUserTriggered = useCallback(() => {
    handleUserInteraction(
      (currentIndex - 1 + slides.length) % slides.length,
      () => {
        if (enableRouting) {
          navigate(
            `${basePath}/${slides[(currentIndex - 1 + slides.length) % slides.length].slug}`,
          );
        }
      },
    );
  }, [
    currentIndex,
    slides,
    enableRouting,
    basePath,
    navigate,
    handleUserInteraction,
  ]);

  const handleButtonUserTriggered = useCallback(
    (newIndex: number) => {
      handleUserInteraction(newIndex, () => {
        if (enableRouting) {
          navigate(`${basePath}/${slides[newIndex].slug}`);
        }
      });
    },
    [basePath, slides, enableRouting, navigate, handleUserInteraction],
  );

  const handleNextUserTriggered = useCallback(() => {
    handleUserInteraction((currentIndex + 1) % slides.length, () => {
      if (enableRouting) {
        navigate(
          `${basePath}/${slides[(currentIndex + 1) % slides.length].slug}`,
        );
      }
    });
  }, [
    currentIndex,
    slides,
    enableRouting,
    basePath,
    navigate,
    handleUserInteraction,
  ]);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrevUserTriggered();
      } else if (event.key === "ArrowRight") {
        handleNextUserTriggered();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePrevUserTriggered, handleNextUserTriggered]);

  const togglePause = () => {
    if (isPaused) {
      startAutoSlide(true);
    } else {
      clearTimer();
    }
  };

  return (
    <div
      className={`${"bbaysingerSlideshow"} bbaysinger-slideshow`}
      aria-roledescription="carousel"
      aria-label="Slideshow"
      aria-live="polite"
    >
      <div className={`${styles.slideWrapper}  slide-wrapper`}>
        {slides.map((slide, index) => (
          <div
            tabIndex={index === currentIndex ? 0 : -1}
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

      <div className={`${styles.contentWrapper} content-wrapper`}>
        {slides.map((_, index) => (
          <div
            key={index}
            className={`${styles.content} ${index === currentIndex && styles.active}`}
          >
            {slides[index].content}
          </div>
        ))}
      </div>

      <div className={styles.arrowButtonControls}>
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
          aria-label={isPaused ? "Restart slideshow" : "Pause slideshow"}
        >
          {isPaused ? resumeLabel : pauseLabel}
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

      <div className={styles.buttonControls} role="tablist">
        {slides.map((_, index) => (
          <button
            key={index}
            ref={(el) => (thumbnailRefs.current[index] = el!)}
            onClick={() => handleButtonUserTriggered(index)}
            className={`${styles.thumbnail} ${
              index === currentIndex ? styles.active : ""
            }`}
            role="tab"
            aria-selected={index === currentIndex}
            aria-controls={`slide-${index}`}
            id={`tab-${index}`}
          >
            {slides[index].thumbnail ? (
              <img
                src={`/assets/images/${slides[index].thumbnail}`}
                alt={slides[index].alt || `Slide thumbnail ${index + 1}`}
              />
            ) : (
              <span className="visually-hidden">{`Slide ${index + 1}`}</span>
            )}
          </button>
        ))}
      </div>
      <p className="visually-hidden">
        Use the left and right arrow keys to navigate the slideshow.
      </p>
    </div>
  );
};

export default Slideshow;
