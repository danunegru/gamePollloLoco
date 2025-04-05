class CoinBar extends StatusBar {

    constructor() {
        super();
        this.IMAGES = [
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png', // (100%)
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',  // 80%
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',  // 60%
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',  // 40%
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',  // 20%
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',   //  (0%)
        ];
        
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 107;
        this.setPercentage(100); 
    }
}


