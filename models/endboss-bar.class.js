class EndbossBar extends StatusBar {

    constructor() {
        super();//damit wir die metoden des übergeordneten objects initialisieren
        this.IMAGES = [
            'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
        ];
        

        this.loadImages(this.IMAGES);
        this.x = 570; // Mehr in der Mitte des Canvas
        this.y = 20;  // Weiter oben für bessere Sichtbarkeit
        this.setPercentage(100); // Initialwert
    }
}


