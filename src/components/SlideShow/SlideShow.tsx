import React, { useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./Slideshow.module.scss";
import { SlideshowProps } from "./Slideshow.types";

const Slideshow: React.FC<SlideshowProps> = ({
  slides,
  autoSlide = true,
  interval = 3000,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the current slide index from the route
  const currentIndex = parseInt(
    new URLSearchParams(location.search).get("slide") || "0",
    10,
  );

  // Handle navigation to the next slide
  const handleNextSlide = useCallback(() => {
    const nextIndex = (currentIndex + 1) % slides.length;
    navigate(`/ricoSlides/${nextIndex}`);
  }, [currentIndex, slides.length, navigate]);

  // Handle auto-slide functionality
  useEffect(() => {
    if (!autoSlide) return;

    const slideInterval = setInterval(() => {
      handleNextSlide();
    }, interval);

    return () => clearInterval(slideInterval);
  }, [handleNextSlide, autoSlide, interval]);

  // Handle manual navigation
  const handlePreviousSlide = () => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    navigate(`/ricoSlides/${prevIndex}`);
  };

  const handleSelectSlide = (index: number) => {
    navigate(`/ricoSlides/${index}`);
  };

  return (
    <div className="slideshow">
      test
      <div className="slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? "active" : ""}`}
          >
            <img src={slide.filename} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
      <button onClick={handlePreviousSlide}>Previous</button>
      <button onClick={handleNextSlide}>Next</button>
      <div className="slideshow-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSelectSlide(index)}
            className={index === currentIndex ? "active" : ""}
          >
            <img
              src={slides[index].filename}
              alt={slides[index].alt || `Slide ${index}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
