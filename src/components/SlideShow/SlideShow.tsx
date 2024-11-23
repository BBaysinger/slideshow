import React, { useState, useEffect, useCallback } from "react";
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

  // Handle manual navigation
  const handlePrevUserTriggered = () => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    setCurrentIndex(prevIndex);
    navigate(`/ricoSlides/${prevIndex}`);
  };

  const handleButtUserTriggered = (index: number) => {
    setCurrentIndex(index);
    navigate(`/ricoSlides/${index}`);
  };

  // Sync currentIndex to Redux/store on user interaction
  const handleNextUserTriggered = () => {
    const nextIndex = (currentIndex + 1) % slides.length;
    setCurrentIndex(nextIndex);
    navigate(`/ricoSlides/${nextIndex}`);
  };

  return (
    <div className="slideshow">
      <div className="slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? "active" : ""}`}
          >
            <img
              src={"/assets/images/" + slide.filename}
              alt={`Slide ${index}`}
            />
          </div>
        ))}
      </div>
      <button onClick={handlePrevUserTriggered}>Previous</button>
      <button onClick={handleNextUserTriggered}>Next</button>
      <div className="slideshow-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleButtUserTriggered(index)}
            className={index === currentIndex ? "active" : ""}
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
