/**
 * Class representing a bottle collectible in the game.
 * Inherits from DrawableObject.
 */
class Bottle extends DrawableObject {
    /**
     * Creates a new Bottle instance at a specified position.
     * Loads images and randomly selects one for display.
     * @param {number} x - X position of the bottle.
     * @param {number} y - Y position of the bottle.
     */
    constructor(x, y) {
        super();

        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;

        /** Array of bottle image paths. */
        this.IMAGES = [
            'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
            'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
        ];

        this.loadImages(this.IMAGES);
        this.setRandomImage();
    }

    /**
     * Randomly selects one of the loaded images to display.
     */
    setRandomImage() {
        const randomIndex = Math.floor(Math.random() * this.IMAGES.length);
        this.img = this.imageCache[this.IMAGES[randomIndex]];
    }
}
