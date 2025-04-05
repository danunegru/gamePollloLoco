class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 100;
    y = 0;
    height = 200;
    width = 200;
    missingImagePlaceholder = 'img/fallback.png'; 

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

    _setFallbackImage() {
        const fallback = new Image();
        fallback.src = this.missingImagePlaceholder;
        this.img = fallback;
    }

    draw(ctx) {
        try {
            if (this.img && this.img.complete) {
                ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            }
        } catch (e) {
            console.warn('Zeichnen fehlgeschlagen:', e);
        }
    }

    
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

    setImageFromCache(path) {
        if (this.imageCache[path]) {
            this.img = this.imageCache[path];
        } else {
            console.warn(`Bild nicht im Cache: ${path}`);
            this._setFallbackImage();
        }
    }

  
    _cacheFallback(path) {
        const fallback = new Image();
        fallback.src = this.missingImagePlaceholder;
        this.imageCache[path] = fallback;
    }

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
