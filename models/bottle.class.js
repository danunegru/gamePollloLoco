class Bottle extends DrawableObject {
    constructor(x, y) {
        super();

        this.x = x; this.y = y;
        this.width = 100;
        this.height = 100;
        this.IMAGES = [
            'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
            'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
        ];
        this.loadImages(this.IMAGES);
        this.setRandomImage();
    }

    setRandomImage() {
        const randomIndex = Math.floor(Math.random() * this.IMAGES.length);
        this.img = this.imageCache[this.IMAGES[randomIndex]];

    }
}


