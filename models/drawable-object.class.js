/**
 * Base class for all drawable objects on the canvas.
 * Provides image loading, caching, drawing, and fallback handling.
 */
class DrawableObject {
    /** The image currently used for rendering. */
    img;

    /** Cache of loaded images keyed by their path. */
    imageCache = {};

    /** Index of the current animation frame. */
    currentImage = 0;

    /** X position on the canvas. */
    x = 100;

    /** Y position on the canvas. */
    y = 0;

    /** Height of the object. */
    height = 200;

    /** Width of the object. */
    width = 200;

    /** Fallback image path if loading fails. */
    missingImagePlaceholder = 'img/fallback.png';

    /**
     * Loads a single image and sets it as the current image.
     * Uses fallback if loading fails.
     * @param {string} path - Path to the image file.
     * @returns {Promise<void>}
     */
    loadImage(path) {
        return new Promise((resolve, reject) => {
            this.img = new Image();
            this.img.onload = () => {
                resolve();
            };
            this.img.onerror = () => {
                console.error(`Fehler beim Laden: ${path}`);
                this._setFallbackImage();
                reject();
            };
            this.img.src = path;
        });
    }

    /**
     * Sets the fallback image if loading fails.
     * Private method.
     */
    _setFallbackImage() {
        const fallback = new Image();
        fallback.src = this.missingImagePlaceholder;
        this.img = fallback;
    }

    /**
     * Draws the current image to the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
     */
    draw(ctx) {
        try {
            if (this.img && this.img.complete) {
                ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            }
        } catch (e) {
            console.warn('Zeichnen fehlgeschlagen:', e);
        }
    }

    /**
     * Loads multiple images into the image cache.
     * Sets the first image as the default display image.
     * @param {string[]} arr - Array of image paths.
     * @returns {Promise<void>}
     */
    loadImages(arr) {
        return Promise.all(
            arr.map(path => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        this.imageCache[path] = img;
                        resolve();
                    };
                    img.onerror = () => {
                        console.warn(`Bild nicht gefunden: ${path}`);
                        this._cacheFallback(path);
                        resolve();
                    };
                    img.src = path;
                });
            })
        ).then(() => {
            if (arr.length > 0 && this.imageCache[arr[0]]) {
                this.img = this.imageCache[arr[0]];
            }
        });
    }

    /**
     * Sets the current image from the image cache.
     * If not cached, uses fallback image.
     * @param {string} path - Path of the image to display.
     */
    setImageFromCache(path) {
        if (this.imageCache[path]) {
            this.img = this.imageCache[path];
        } else {
            console.warn(`Bild nicht im Cache: ${path}`);
            this._setFallbackImage();
        }
    }

    /**
     * Caches the fallback image for a specific path.
     * Private method.
     * @param {string} path - Path to assign fallback image to.
     */
    _cacheFallback(path) {
        const fallback = new Image();
        fallback.src = this.missingImagePlaceholder;
        this.imageCache[path] = fallback;
    }

    /**
     * Draws a blue frame around the object for debug purposes.
     * Only applies to Character or Chicken instances.
     * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }
}
