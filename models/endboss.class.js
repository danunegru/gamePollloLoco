class Endboss extends MovableObject {
    height = 500;
    width = 250;
    y = -55;
    isActive = false;
    isAttacking = false;
    isHurt = false;
    isDead = false;
    energy = 100;
    leftBoundary = 100;
    hasReachedBoundary = false;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

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

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DIE = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    screamAudio = new Audio('audio/EndbosScream.wav');
    indianScreamAudio = new Audio('audio/indian-scream.mp3');
    movementInterval;
    animationInterval;

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DIE); 
        this.x = 2400;
        this.speed = 1;
        this.animate();
    }

    activateIfClose(characterX) {
        if (characterX > 500 && !this.isActive) {
            this.isActive = true;
            this.indianScreamAudio.play();
        }
    }

    loseEnergy(amount) {
        if (this.isDead) return;
        
        this.energy -= amount;
        this.energy = Math.max(0, this.energy); 
        if (this.energy <= 0) {
            this.die();
        } else {
            this.playHurtAnimation();
            this.playHurtSound();
        }
    }
    
    playHurtSound() {
        try {
            this.screamAudio.currentTime = 0; 
            this.screamAudio.play().catch(e => console.log("Sound error:", e));
        } catch (e) {
            console.warn("Sound failed:", e);
        }
    }

    playHurtAnimation() {
        this.isHurt = true;
        this.playAnimation(this.IMAGES_HURT);

        let backwardSteps = 10;
        let stepCounter = 0;
        let backwardInterval = setInterval(() => {
            if (stepCounter < backwardSteps) {
                this.x += 5;
                stepCounter++;
            } else {
                clearInterval(backwardInterval);
            }
        }, 50);

        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);

        setTimeout(() => {
            this.isHurt = false;
            this.animate();
        }, 1000);
    }

    die() {
        if (this.isDead) return;
        
        console.log("Endboss stirbt jetzt!"); 
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

    removeFromWorld() {
        if (this.world && this.world.level && this.world.level.enemies) {
            this.world.level.enemies = this.world.level.enemies.filter(
                enemy => enemy !== this
            );
            console.log("Endboss wurde entfernt!");
            
            setTimeout(() => {
                if (this.world) {
                    this.world.checkEndbossDefeated();
                }
            }, 500);
        }
    }

    animate() {
        if (!this.isHurt && !this.isDead) {
            this.movementInterval = setInterval(() => {
                if (this.isActive && !this.isAttacking) {
                    this.moveLeft();
                    this.checkBoundary();
                }
            }, 1000 / 60);

            this.animationInterval = setInterval(() => {
                if (this.isActive) {
                    if (this.isAttacking) {
                        this.playAnimation(this.IMAGES_ATTACKING);
                    } else {
                        this.playAnimation(this.IMAGES_WALKING);
                    }
                }
            }, 200);
        }
    }

    checkBoundary() {
        if (this.x <= this.leftBoundary && !this.hasReachedBoundary) {
            this.hasReachedBoundary = true;
            this.triggerGameOver();
        }
    }

    triggerGameOver() {
        this.isDead = true;
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        this.screamAudio.play();

        setTimeout(() => {
            if (this.world) {
                this.world.stopGame();
                this.world.showGameOverScreen();
            }
        }, 1000);
    }
//
    startAttack() {
        this.isAttacking = true;
        this.screamAudio.play();

        setTimeout(() => {
            this.isAttacking = false;
        }, 1500);
    }
}