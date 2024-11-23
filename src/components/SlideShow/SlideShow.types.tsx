interface Slide {
  id: string;
  filename: string;
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
  navigation?: boolean;
  loop?: boolean;
}

export type { SlideshowProps, Slide };
