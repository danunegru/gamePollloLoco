class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;
  

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');//jetzt wird von der übergeordnete methode "MovableObject" loadImage aufgerufen
        this.x = 10 + Math.random() * 500;//zahl zufällig generiert zwischen 0 und 500
        this.animate();
    }

    animate() {
       this.moveLeft();
    }
}