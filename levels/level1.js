const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss(),
        new SmallChicken(),
        new SmallChicken(),
        new SmallChicken(),
    ],

    [
        new Cloud()
    ],

    [
        new BackgroundObject('img/5_background/layers/air.png', -719),//an der x koordinate 0 wird es eingefügt
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),


        new BackgroundObject('img/5_background/layers/air.png', 0),//an der x koordinate 0 wird es eingefügt
        //merken die anwendung läuft von oben nach unten  heisst die bilder werden auch nacheinander aufgerufen, nach reihenfolge und deshalb wird dieser wolken als erstes aufgerufen um ganz hinten im hintergrund angezeigt um es keine anderen objecte zu verdecken :        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),//wir fügen einen object der "class ""BackgroundObject"
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

        new BackgroundObject('img/5_background/layers/air.png', 719),//an der x koordinate 0 wird es eingefügt
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 2),//an der x koordinate 0 wird es eingefügt
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 3),//an der x koordinate 0 wird es eingefügt
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3),
    ]

);

