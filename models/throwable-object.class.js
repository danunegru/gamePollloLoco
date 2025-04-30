/**
 * Class representing a throwable object (e.g., a salsa bottle).
 * Inherits from MovableObject and handles throw animation, splash, and removal.
 */
class ThrowableObject extends MovableObject {
    /** Global cooldown flag to prevent rapid throwing */
    static throwCooldown = false;

    /** Time in ms before another throw is allowed */
    static COOLDOWN_TIME = 800;

    /** Global splash sound for all throwable objects */
    static globalSplashSound = new Audio('audio/throwbrocke.ogg');

    /** Instance-level splash sound (shared from static) */
    splashSound = ThrowableObject.globalSplashSound;

    /**
     * Creates a new throwable object.
     * @param {number} x - Initial x position.
     * @param {number} y - Initial y position.
     * @param {number} direction - Direction of throw (1 or -1).
     * @param {Object} world - Reference to the game world object.
     */
    constructor(x, y, direction, world) {
        super().loadImage('img/7_statusbars/3_icons/icon_salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.world = world;
        this.height = 60;
        this.width = 50;
        this.speedX = 7 * direction;
        this.speedY = 20;
        this.groundY = 400;
        this.hasSplashed = false;
        this.splashSound.volume = 0.3;

        this.IMAGES_SPLASH = [
            'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
            'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
            'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
            'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
            'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
            'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
        ];

        this.IMAGES_THROW = [
            'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
            'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
            'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
            'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
        ];

        this.loadImages(this.IMAGES_SPLASH);
        this.loadImages(this.IMAGES_THROW);
        this.throw();
    }

    /**
     * Checks if a new object can be thrown based on cooldown.
     * @returns {boolean} True if throw is allowed.
     */
    static canThrow() {
        return !this.throwCooldown;
    }

    /**
     * Activates throw cooldown to prevent immediate re-throw.
     */
    static activateCooldown() {
        this.throwCooldown = true;
        setTimeout(() => this.throwCooldown = false, this.COOLDOWN_TIME);
    }

    /**
     * Initiates the throw motion, animation and physics.
     */
    throw() {
        if (ThrowableObject.throwCooldown) return;
        this.applyGravity();
        this.movementInterval = setInterval(() => this.move(), 25);
        this.animateThrow();
        ThrowableObject.activateCooldown();
    }

    /**
     * Updates position during movement; handles splash on ground impact.
     */
    move() {
        this.x += this.speedX;
        if (this.y >= this.groundY && !this.hasSplashed) {
            this.handleGroundHit();
        }
    }

    /**
     * Handles impact with the ground: plays splash animation and sound, removes object.
     */
    handleGroundHit() {
        this.hasSplashed = true;
        this.y = this.groundY;
        clearInterval(this.movementInterval);
        this.playSplashSound();
        this.animateSplash();
        setTimeout(() => this.removeFromWorld(), 1000);
    }

    /**
     * Plays splash sound on ground impact.
     */
    playSplashSound() {
        this.splashSound.currentTime = 0;
        this.splashSound.play().catch(() => { });
    }

    /**
     * Animates the bottle's throw rotation.
     */
    animateThrow() {
        let index = 0;
        this.throwInterval = setInterval(() => {
            this.img = this.imageCache[this.IMAGES_THROW[index]];
            index = (index + 1) % this.IMAGES_THROW.length;
        }, 100);
    }

    /**
     * Animates the splash sequence after ground hit.
     */
    animateSplash() {
        clearInterval(this.throwInterval);
        let index = 0;
        this.splashInterval = setInterval(() => {
            if (index < this.IMAGES_SPLASH.length) {
                this.img = this.imageCache[this.IMAGES_SPLASH[index]];
                index++;
            } else {
                clearInterval(this.splashInterval);
            }
        }, 100);
    }

    /**
     * Applies gravity to the object, simulating arc flight.
     */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.y < this.groundY) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                clearInterval(this.gravityInterval);
            }
        }, 40);
    }

    /**
     * Removes the object from the game world after animation ends.
     */
    removeFromWorld() {
        const index = this.world.throwableObjects.indexOf(this);
        if (index > -1) {
            this.world.throwableObjects.splice(index, 1);
        }
    }
}
