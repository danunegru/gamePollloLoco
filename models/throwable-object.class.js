class ThrowableObject extends MovableObject {
    static throwCooldown = false;
    static COOLDOWN_TIME = 800; // 800ms Wartezeit zwischen Würfen
    
    constructor(x, y, direction, world) {
        super().loadImage('img/7_statusbars/3_icons/icon_salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.world = world;
        this.height = 60;
        this.width = 50;
        this.speedX = 7 * this.direction;
        this.speedY = 20;
        this.groundY = 400;
        this.hasSplashed = false;
        this.splashSound = new Audio('audio/throwbrocke.ogg');
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

    static canThrow() {
        return !this.throwCooldown;
    }

    static activateCooldown() {
        this.throwCooldown = true;
        setTimeout(() => {
            this.throwCooldown = false;
        }, this.COOLDOWN_TIME);
    }

    throw() {
        if (ThrowableObject.throwCooldown) return;
        
        this.applyGravity();
        this.movementInterval = setInterval(() => this.move(), 25);
        this.animateThrow();
        ThrowableObject.activateCooldown();
    }

    move() {
        this.x += this.speedX;
        if (this.y >= this.groundY && !this.hasSplashed) {
            this.handleGroundHit();
        }
    }

    handleGroundHit() {
        this.hasSplashed = true;
        this.y = this.groundY;
        clearInterval(this.movementInterval);
        this.playSplashSound();
        this.animateSplash();
        setTimeout(() => this.removeFromWorld(), 1000);
    }

    playSplashSound() {
        try {
            this.splashSound.currentTime = 0;
            this.splashSound.play().catch(e => console.log("Sound error:", e));
        } catch (e) {
            console.warn("Sound failed:", e);
        }
    }

    animateThrow() {
        let currentImageIndex = 0;
        this.throwInterval = setInterval(() => {
            this.img = this.imageCache[this.IMAGES_THROW[currentImageIndex]];
            currentImageIndex = (currentImageIndex + 1) % this.IMAGES_THROW.length;
        }, 100);
    }

    animateSplash() {
        clearInterval(this.throwInterval);
        let currentImageIndex = 0;
        this.splashInterval = setInterval(() => {
            if (currentImageIndex < this.IMAGES_SPLASH.length) {
                this.img = this.imageCache[this.IMAGES_SPLASH[currentImageIndex]];
                currentImageIndex++;
            } else {
                clearInterval(this.splashInterval);
            }
        }, 100);
    }

    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.y < this.groundY) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                clearInterval(this.gravityInterval);
            }
        }, 1000 / 25);
    }

    removeFromWorld() {
        const index = this.world.throwableObjects.indexOf(this);
        if (index > -1) {
            this.world.throwableObjects.splice(index, 1);
        }
    }
}