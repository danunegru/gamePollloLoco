/**
 * Class representing a background object in the game (e.g., scenery layers).
 * Inherits from MovableObject.
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
     * Creates a new BackgroundObject instance with specified image and position.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - X position of the object.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height; 
    }
}
