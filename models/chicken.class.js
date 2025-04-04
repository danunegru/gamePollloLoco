class Chicken extends MovableObject {
    y = 340;
    height = 80;
    width = 100;
    isDead = false; // Standardmäßig ist das Huhn lebendig
    isMoving = false; // Neue Eigenschaft, um die Bewegung zu steuern
    walking_sound = new Audio('audio/chicken.mp3');


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
        this.loadImages(this.IMAGES_WALKING); // Lade die Laufbilder
        this.loadImages(this.IMAGES_DEAD); // Lade die Death-Bilder
        this.x = 1000 + Math.random() * 500; // Hühner starten weiter hinten
        this.speed = 0.15 + Math.random() * 0.35; // Zufällige Geschwindigkeit
    }

    /**
     * Startet die Bewegung des Huhns.
     */
    startMoving() {
        if (!this.isMoving) {
            this.isMoving = true;
            this.animate(); // Starte die Animation
        }
    }

    /**
     * Animiert das Huhn (Bewegung und Laufanimation).
     */
    animate() {
        // Bewegung nach links
        this.movementInterval = setInterval(() => {
            if (this.isDead === false && this.isMoving) {
                this.moveLeft();
            }
        }, 1000 / 60); // 60 FPS

        // Laufanimation abspielen
        this.animationInterval = setInterval(() => {
            if (this.isDead === false && this.isMoving) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200); // Wechsel alle 200 ms
    }

    /**
     * Spielt die Todesanimation des Huhns ab.
     */
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

    /**
     * Markiert das Huhn zur Entfernung aus der Spielwelt.
     */
    markForRemoval() {
        this.isMarkedForRemoval = true; // Markiere das Huhn, um es aus der Spielwelt zu entfernen
    }
}