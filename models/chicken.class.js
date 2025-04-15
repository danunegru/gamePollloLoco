class Chicken extends MovableObject {
    y = 340;
    height = 80;
    width = 100;
    isDead = false; isMoving = false; walking_sound = new Audio('audio/chicken.mp3');


    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 1000 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.75;
    }

    startMoving() {
        if (!this.isMoving) {
            this.isMoving = true;
            this.animate();
        }
    }


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

    markForRemoval() {
        this.isMarkedForRemoval = true;
    }
}