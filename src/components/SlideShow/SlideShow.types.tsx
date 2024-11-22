interface Slide {
  id: string;
  content?: React.ReactNode;
  filename: string;
}

interface SlideShowProps {
  slides: Slide[];
  autoSlide?: boolean;
  interval?: number;
  navigation?: boolean;
  loop?: boolean;
}

export type { SlideShowProps, Slide };
