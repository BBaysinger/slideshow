/**
 * Preload image utility. Each load occurs sequentially,
 * starting from the passed startIndex, one at a time.
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

  async preload(): Promise<void> {
    const orderedImages = [
      ...this.images.slice(this.startIndex),
      ...this.images.slice(0, this.startIndex),
    ];

    for (const image of orderedImages) {
      try {
        await this.preloadImage(image);
      } catch (error) {
        console.error(error);
      }
    }
  }

  private preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = url;
      document.head.appendChild(link);

      link.onload = () => {
        document.head.removeChild(link);
        this.loadedCount++;
        // console.info(`Loaded ${this.loadedCount}/${this.images.length}`);
        resolve();
      };

      link.onerror = () => {
        document.head.removeChild(link);
        console.error(`Failed to preload ${url}`);
        reject(new Error(`Failed to preload ${url}`));
      };
    });
  }
}

export default ImagePreloader;
