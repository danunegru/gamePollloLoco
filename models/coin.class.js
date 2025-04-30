/**
 * Class representing a coin collectible in the game.
 * Inherits from DrawableObject.
 */
class Coin extends DrawableObject {
    /**
     * Creates a new Coin instance at the given position.
     * @param {number} x - X position of the coin.
     * @param {number} y - Y position of the coin.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.loadImage('img/8_coin/coin_1.png');
    }
}
