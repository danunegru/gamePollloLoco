class MovableObject extends DrawableObject {
    height = 200;
    width = 200;
    speed = 0.10;
    otherDirection = false;
    speedY = 0;
    acceleration = 3;
    energy = 100;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 138;
        }
    }

    isColliding(mo) {
        if (this.isJumpingOn(mo)) {
            return true;
        }
        
        
        return this.x + this.width - 25 > mo.x + 25 &&
               this.y + this.height - 15 > mo.y + 10 &&
               this.x + 25 < mo.x + mo.width - 25 &&
               this.y + 10 < mo.y + mo.height - 5;
    }
    
    isJumpingOn(mo) {
        return this.y + this.height >= mo.y &&
               this.y + this.height <= mo.y + mo.height / 2 &&
               this.x + this.width - 30 > mo.x + 30 &&
               this.x + 30 < mo.x + mo.width - 30 &&
               this.speedY < 0; // Nur wenn fallend
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    jump() {
        this.speedY = 33;
    }

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

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    isDead() {
        return this.energy == 0;
    }
}