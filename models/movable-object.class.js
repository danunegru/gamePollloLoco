// Basisklasse für bewegliche Objekte
class MovableObject extends DrawableObject {
    height = 200;
    width = 200;
    speed = 0.10;
    otherDirection = false;
    speedY = 0;
    acceleration = 3;
    energy = 100;
    lastHit = 0;

    // Schwerkraft anwenden
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

    // Überprüft, ob das Objekt über dem Boden ist
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 139;
        }
    }

    // Überprüft, ob eine Kollision mit einem anderen Objekt stattfindet
    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x &&
            this.y < mo.y + mo.height;
    }

    // Spielt eine Animation ab
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    // Bewegt das Objekt nach rechts
    moveRight() {
        this.x += this.speed;
    }

    // Bewegt das Objekt nach links
    moveLeft() {
        this.x -= this.speed;
    }

    // Lässt das Objekt springen
    jump() {
        this.speedY = 33;
    }

    // Wird aufgerufen, wenn das Objekt getroffen wird
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

    // Überprüft, ob das Objekt verletzt ist
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    // Überprüft, ob das Objekt tot ist
    isDead() {
        return this.energy == 0;
    }
}