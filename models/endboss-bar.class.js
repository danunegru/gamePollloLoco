/**
 * Class representing the status bar for the Endboss.
 * Inherits from StatusBar.
 */
class EndbossBar extends StatusBar {

    /**
     * Creates a new EndbossBar instance.
     * Initializes position, loads images, and sets full health.
     */
    constructor() {
        super();
        this.IMAGES = [
            'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
        ];

        this.loadImages(this.IMAGES);
        this.x = 570;      // X position on screen
        this.y = 20;       // Y position on screen
        this.setPercentage(100);  // Full health initially
    }
}
