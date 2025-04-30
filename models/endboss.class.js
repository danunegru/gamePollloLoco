/**
 * Class representing the Endboss enemy in the game.
 * Inherits from MovableObject.
 */
class Endboss extends MovableObject {
    /** Walking animation image paths. */
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    /** Attacking animation image paths. */
    IMAGES_ATTACKING = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    /** Hurt animation image paths. */
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    /** Death animation image paths. */
    IMAGES_DIE = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    /** Static audio for scream. */
    static screamAudio = new Audio('audio/EndbosScream.wav');

    /** Static audio for initial scream when activated. */
    static indianScreamAudio = new Audio('audio/indian-scream.mp3');

    /** Instance scream audio reference. */
    screamAudio = Endboss.screamAudio;

    /** Instance Indian scream audio reference. */
    indianScreamAudio = Endboss.indianScreamAudio;

    /** Boss height in pixels. */
    height = 500;

    /** Boss width in pixels. */
    width = 250;

    /** Y position on canvas. */
    y = -55;

    /** Activation state of the boss. */
    isActive = false;

    /** Attack animation state. */
    isAttacking = false;

    /** Hurt animation state. */
    isHurt = false;

    /** Death state. */
    isDead = false;

    /** Health points of the boss. */
    energy = 100;

    /** Left movement boundary (boss stops here). */
    leftBoundary = 100;

    /** Whether the boss has reached its boundary. */
    hasReachedBoundary = false;

    /** ID of movement interval. */
    movementInterval;

    /** ID of animation interval. */
    animationInterval;

    /**
     * Creates a new Endboss instance, loads animations, and starts movement.
     */
    constructor() {
        super().loadImage('img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DIE);
        this.x = 2400;
        this.speed = 2.5;
        this.animate();
    }

    /**
     * Activates the boss if the character is close enough.
     * @param {number} characterX - Current X position of the character.
     */
    activateIfClose(characterX) {
        if (characterX > 500 && !this.isActive) {
            this.isActive = true;
            this.indianScreamAudio.play().catch(() => {});
        }
    }

    /**
     * Reduces boss energy and handles hurt or death state.
     * @param {number} amount - Damage amount.
     */
    loseEnergy(amount) {
        if (this.isDead) return;
        this.energy -= amount;
        if (this.energy <= 0) {
            this.energy = 0;
            this.die();
        } else {
            this.playHurtAnimation();
            this.playHurtSound();
        }
    }

    /**
     * Plays the hurt sound effect.
     */
    playHurtSound() {
        this.screamAudio.currentTime = 0;
        this.screamAudio.play().catch(() => {});
    }

    /**
     * Plays the hurt animation and briefly interrupts movement.
     */
    playHurtAnimation() {
        this.isHurt = true;
        this.playAnimation(this.IMAGES_HURT);
        let step = 0;
        const backward = setInterval(() => {
            if (step++ < 10) this.x += 5;
            else clearInterval(backward);
        }, 50);

        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        setTimeout(() => {
            this.isHurt = false;
            this.animate();
        }, 1000);
    }

    /**
     * Plays the death animation and removes the boss from the world.
     */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        let frame = 0;
        const deathAnim = setInterval(() => {
            if (frame < this.IMAGES_DIE.length) {
                this.img = this.imageCache[this.IMAGES_DIE[frame]];
                frame++;
            } else {
                clearInterval(deathAnim);
                this.removeFromWorld();
            }
        }, 100);
    }

    /**
     * Removes the boss from the game world and checks for level end.
     */
    removeFromWorld() {
        if (this.world) {
            this.world.level.enemies = this.world.level.enemies.filter(e => e !== this);
            setTimeout(() => this.world.checkEndbossDefeated(), 500);
        }
    }

    /**
     * Starts movement and animation loops based on state.
     */
    animate() {
        this.movementInterval = setInterval(() => {
            if (this.isActive && !this.isAttacking) {
                this.moveLeft();
                this.checkBoundary();
            }
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (this.isActive) {
                if (this.isAttacking) this.playAnimation(this.IMAGES_ATTACKING);
                else this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Checks if boss has reached left boundary and triggers game over.
     */
    checkBoundary() {
        if (this.x <= this.leftBoundary && !this.hasReachedBoundary) {
            this.hasReachedBoundary = true;
            this.triggerGameOver();
        }
    }

    /**
     * Stops the game and shows game over screen.
     */
    triggerGameOver() {
        this.isDead = true;
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        this.screamAudio.play().catch(() => {});
        setTimeout(() => {
            if (this.world) {
                this.world.stopGame();
                this.world.showGameOverScreen();
            }
        }, 1000);
    }

    /**
     * Starts the attack sequence.
     */
    startAttack() {
        this.isAttacking = true;
        this.screamAudio.play().catch(() => {});
        setTimeout(() => {
            this.isAttacking = false;
        }, 1500);
    }
}
