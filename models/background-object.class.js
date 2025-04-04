class BackgroundObject extends MovableObject {

    width = 720;
    height = 480;
    constructor(imagePath, x) {
        super().loadImage(imagePath);//super weil wir von der übergeorndete class das loadImage wollen
        this.x= x;
        this.y = 480 - this.height;//480 canvas standart groesse - bild groesse
    }
}