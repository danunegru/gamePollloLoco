class BottleBar extends StatusBar {

    constructor() {
        super();//damit wir die metoden des übergeordneten objects initialisieren
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
        this.setPercentage(100); // Initialwert
    }
}


