class Bottle extends DrawableObject {
    constructor(x, y) {
        super();

        this.x = x; // X-Position, die beim Erstellen der Münze angegeben wird
        this.y = y; // Y-Position
        this.width = 100; // Größe der Münze
        this.height = 100;
        this.IMAGES = [ // Liste der Flaschenbilder
            'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
            'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
        ];
        this.loadImages(this.IMAGES); // Mehrere Bilder laden
        this.setRandomImage(); // Zufälliges Bild auswählen
    }

    // Methode, um ein zufälliges Bild aus der Liste auszuwählen
    setRandomImage() {
        const randomIndex = Math.floor(Math.random() * this.IMAGES.length);
        this.img = this.imageCache[this.IMAGES[randomIndex]];

    }
}


