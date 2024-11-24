import React from "react";

interface Slide {
  slug: string;
  background: string;
  thumbnail: string;
  foreground?: string;
  alt?: string;
  desc?: string;
  content?: React.ReactNode;
}

interface SlideshowProps {
  slides: Slide[];
  autoSlide?: boolean;
  interval?: number;
  prev?: string;
  next?: string;
  content?: React.ReactNode;
  heading?: React.ReactNode;
}

export type { SlideshowProps, Slide };
