interface Slide {
  slug: string;
  background: string;
  thumbnail: string;
  foreground?: string;
  content?: React.ReactNode;
  alt?: string;
  desc?: string;
}

interface SlideshowProps {
  slides: Slide[];
  autoSlide?: boolean;
  interval?: number;
  prev?: string;
  next?: string;
}

export type { SlideshowProps, Slide };
