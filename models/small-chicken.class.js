
// Klasse für das kleine Huhn
class SmallChicken extends MovableObject {
    y = 360;
    height = 50;
    width = 70;
    isDead = false; // Standardmäßig ist das Huhn lebendig
    isMoving = false; // Steuert, ob das Huhn sich bewegt

    // Bilder für die Laufanimation
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    // Bild für die Todesanimation
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING); // Lade die Laufbilder
        this.loadImages(this.IMAGES_DEAD); // Lade die Todesbilder
        this.x = 800 + Math.random() * 500; // Zufällige Startposition
        this.speed = 0.75 + Math.random() * 0.25; // Zufällige Geschwindigkeit
    }

    // Startet die Bewegung des Huhns
    startMoving() {
        if (!this.isMoving) {
            this.isMoving = true;

            this.animate(); // Starte die Animation
        }
    }

    // Animiert das Huhn (Bewegung und Laufanimation)
    animate() {
        // Bewegung nach links
        this.movementInterval = setInterval(() => {
            if (!this.isDead && this.isMoving) {

                this.moveLeft();
            }
        }, 1000 / 60); // 60 FPS

        // Laufanimation abspielen
        this.animationInterval = setInterval(() => {
            if (!this.isDead && this.isMoving) {

                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200); // Wechsel alle 200 ms
    }

    // Spielt die Todesanimation ab
    playDeathAnimation() {
        this.isDead = true;
        this.speed = 0; // Stoppe die Bewegung
        this.img = this.imageCache[this.IMAGES_DEAD[0]]; // Setze das Todesbild

        // Stoppe die Intervalle für Bewegung und Animation
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);

        // Entferne das Huhn nach 2 Sekunden
        setTimeout(() => {
            this.markForRemoval();
        }, 2000);
    }

    // Markiert das Huhn zur Entfernung aus der Spielwelt
    markForRemoval() {
        this.isMarkedForRemoval = true;
    }
}

// Beispiel: Erstelle ein Huhn und starte die Bewegung
let chicken = new SmallChicken();
chicken.startMoving(); // Starte die Bewegung des Huhns