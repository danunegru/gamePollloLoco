/**
 * Class representing a normal-sized enemy chicken.
 * Inherits from MovableObject.
 */
class Chicken extends MovableObject {
    /** Y position of the chicken. */
    y = 340;

    /** Height of the chicken. */
    height = 80;

    /** Width of the chicken. */
    width = 100;

    /** Indicates if the chicken is dead. */
    isDead = false;

    /** Indicates if the chicken is currently moving. */
    isMoving = false;

    /** Sound effect for chicken movement. */
    walking_sound = new Audio('audio/chicken.mp3');

    /** Array of images used for walking animation. */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    /** Image used when the chicken is dead. */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /**
     * Creates a new Chicken instance with randomized position and speed.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 1000 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.75;
    }

    /**
     * Starts the chicken's movement and walking animation.
     */
    startMoving() {
        if (!this.isMoving) {
            this.isMoving = true;
            this.animate();
        }
    }

    /**
     * Starts the animation intervals for movement and sprite changes.
     */
    animate() {
        this.movementInterval = setInterval(() => {
            if (this.isDead === false && this.isMoving) {
                this.moveLeft();
            }
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (this.isDead === false && this.isMoving) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Plays the death animation and stops the chicken's movement.
     */
    playDeathAnimation() {
        this.isDead = true;
        this.speed = 0;
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        setTimeout(() => {
            this.markForRemoval();
        }, 2000);
    }

    /**
     * Marks the chicken for removal from the game world.
     */
    markForRemoval() {
        this.isMarkedForRemoval = true;
    }
}
