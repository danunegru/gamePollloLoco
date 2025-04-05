class EndbossBar extends StatusBar {

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
        this.x = 570; 
        this.y = 20;  
        this.setPercentage(100);
    }
}


