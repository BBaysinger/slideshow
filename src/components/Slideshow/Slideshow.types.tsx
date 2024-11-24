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
  basePath: string;
  content?: React.ReactNode;
  heading?: React.ReactNode;
  enableRouting?: boolean;
}

export type { SlideshowProps, Slide };
