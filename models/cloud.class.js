/**
 * Class representing a moving cloud in the background.
 * Inherits from MovableObject.
 */
class Cloud extends MovableObject {
    /** Y position of the cloud. */
    y = 20;

    /** Width of the cloud. */
    width = 500;

    /** Height of the cloud. */
    height = 250;

    /**
     * Creates a new Cloud instance at a random X position.
     * Loads the cloud image and starts animation.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = 10 + Math.random() * 500;
        this.animate();
    }

    /**
     * Starts the movement animation of the cloud.
     * Moves the cloud slowly to the left.
     */
    animate() {
        this.moveLeft();
    }
}
