
class SmallChicken extends MovableObject {
    y = 360;
    height = 50;
    width = 70;
    isDead = false;
    isMoving = false;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 800 + Math.random() * 500;
        this.speed = 0.75 + Math.random() * 0.25;
    }

    startMoving() {
        if (!this.isMoving) {
            this.isMoving = true;

            this.animate();
        }
    }

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

let chicken = new SmallChicken();
chicken.startMoving(); 