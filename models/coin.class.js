class Coin extends DrawableObject {
    constructor(x, y) {
        super();

        this.x = x; // X-Position, die beim Erstellen der Münze angegeben wird
        this.y = y; // Y-Position
        this.width = 100; // Größe der Münze
        this.height = 100;
        this.loadImage('img/8_coin/coin_1.png'); // Bild der Münze laden


    }



}
