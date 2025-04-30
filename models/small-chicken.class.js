/**
 * Class representing a small chicken enemy.
 * Inherits from MovableObject.
 */
class SmallChicken extends MovableObject {
    /** Y position of the small chicken. */
    y = 360;

    /** Height of the small chicken. */
    height = 50;

    /** Width of the small chicken. */
    width = 70;

    /** Indicates if the small chicken is dead. */
    isDead = false;

    /** Indicates if the small chicken is currently moving. */
    isMoving = false;

    /** Array of images for walking animation. */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    /** Array of images for dead animation. */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * Creates a new SmallChicken instance.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 800 + Math.random() * 500;
        this.speed = 0.75 + Math.random() * 0.25;
    }

    /**
     * Starts the movement and animation of the small chicken if not already moving.
     */
    startMoving() {
        if (!this.isMoving) {
            this.isMoving = true;
            this.animate();
        }
    }

    /**
     * Handles continuous movement and walking animation of the small chicken.
     */
    animate() {
        this.movementInterval = setInterval(() => {
            if (!this.isDead && this.isMoving) {
                this.moveLeft();
            }
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (!this.isDead && this.isMoving) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Plays the death animation, stops movement and schedules removal.
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

/** Example: create and start a moving small chicken. */
let chicken = new SmallChicken();
chicken.startMoving();
