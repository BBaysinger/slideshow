/**
 * Utility to load images in the background to be available in
 * memory by the time they become displayed.
 *
 * @author Bradley Baysinger
 * @since The beginning of time.
 * @version N/A
 */

class ImagePreloader {
  private images: string[];
  private startIndex: number;
  private loadedCount: number;

  constructor(images: string[], startIndex: number) {
    if (!Array.isArray(images) || images.length === 0) {
      throw new Error("Images must be a non-empty array.");
    }
    if (startIndex < 0 || startIndex >= images.length) {
      throw new Error("Start index is out of bounds.");
    }

    this.images = images;
    this.startIndex = startIndex;
    this.loadedCount = 0;
  }

  preload(): void {
    this.preloadImage(this.images[this.startIndex]);

    for (let i = this.startIndex + 1; i < this.images.length; i++) {
      this.preloadImage(this.images[i]);
    }

    for (let i = 0; i < this.startIndex; i++) {
      this.preloadImage(this.images[i]);
    }
  }

  private preloadImage(url: string): void {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);

    link.onload = () => {
      document.head.removeChild(link);
      this.loadedCount++;
      // console.log(`Loaded ${this.loadedCount}/${this.images.length}`);
    };

    link.onerror = () => {
      document.head.removeChild(link);
      console.error(`Failed to preload ${url}`);
    };
  }
}

export default ImagePreloader;
