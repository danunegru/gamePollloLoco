/**
 * Class representing a level in the game.
 */
class Level {
    /** Array of enemies present in the level. */
    enemies;

    /** Array of clouds in the level. */
    clouds;

    /** Array of background objects in the level. */
    backgroundObjects;

    /** X-coordinate where the level ends. */
    level_end_x = 2140;

    /**
     * Creates a new Level instance.
     * @param {Array} enemies - Array of enemy objects.
     * @param {Array} clouds - Array of cloud objects.
     * @param {Array} backgroundObjects - Array of background object instances.
     */
    constructor(enemies, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}
