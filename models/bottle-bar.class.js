/**
 * Class representing the status bar for collected bottles.
 * Inherits from StatusBar.
 */
class BottleBar extends StatusBar {

    /**
     * Creates a new BottleBar instance.
     * Initializes position, loads bottle status images, and sets to full.
     */
    constructor() {
        super();

        /** Array of image paths representing the bottle status in 20% steps. */
        this.IMAGES = [
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
        ];

        this.loadImages(this.IMAGES);
        this.x = 40;      
        this.y = 53;    
        this.setPercentage(100); 
    }
}
