/**
 * Class representing a movable object.
 * Inherits from DrawableObject and adds movement, collision, and health logic.
 */
class MovableObject extends DrawableObject {
    /** Height of the object. */
    height = 200;

    /** Width of the object. */
    width = 200;

    /** Horizontal movement speed. */
    speed = 0.10;

    /** Whether the object faces the opposite direction. */
    otherDirection = false;

    /** Vertical speed for jumps and falling. */
    speedY = 0;

    /** Downward acceleration due to gravity. */
    acceleration = 3;

    /** Energy or health points of the object. */
    energy = 100;

    /** Timestamp of the last hit received. */
    lastHit = 0;

    /**
     * Applies gravity to the object, pulling it down if above ground.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.y = this.groundY;
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    /**
     * Checks if the object is currently above the ground level.
     * @returns {boolean} True if above ground.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < this.groundY;
        }
    }

    /**
     * Checks for collision with another movable object.
     * @param {MovableObject} mo - Another movable object.
     * @returns {boolean} True if colliding.
     */
    isColliding(mo) {
        if (this.isJumpingOn(mo)) {
            return true;
        }
        return this.x + this.width - 25 > mo.x + 25 &&
               this.y + this.height - 15 > mo.y + 10 &&
               this.x + 25 < mo.x + mo.width - 25 &&
               this.y + 10 < mo.y + mo.height - 5;
    }

    /**
     * Checks if the object is jumping on another object from above.
     * @param {MovableObject} mo - Another movable object.
     * @returns {boolean} True if jumping on.
     */
    isJumpingOn(mo) {
        return this.y + this.height >= mo.y &&
               this.y + this.height <= mo.y + mo.height / 2 &&
               this.x + this.width - 30 > mo.x + 30 &&
               this.x + 30 < mo.x + mo.width - 30 &&
               this.speedY < 0;
    }

    /**
     * Plays an animation by cycling through a given set of images.
     * @param {string[]} images - Array of image paths.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the object jump by setting an upward speed.
     */
    jump() {
        this.speedY = 33;
    }

    /**
     * Reduces the object's energy when hit if enough time has passed.
     */
    hit() {
        let now = new Date().getTime();
        if (now - this.lastHit > 1000) {
            this.energy -= 17;
            if (this.energy < 0) {
                this.energy = 0;
            }
            this.lastHit = now;
        }
    }

    /**
     * Checks if the object is currently in a hurt state after a hit.
     * @returns {boolean} True if hurt.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Checks if the object is dead (energy depleted).
     * @returns {boolean} True if dead.
     */
    isDead() {
        return this.energy == 0;
    }
}
