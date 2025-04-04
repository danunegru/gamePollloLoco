class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    bottleBar = new BottleBar();
    endbossBar = new EndbossBar();
    coinBar = new CoinBar();
    throwableObjects = [];
    runInterval;
    animationFrame;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.coins = this.generateCoins();
        this.bottle = this.generateBottle();
        this.draw();
        this.setWorld();
        this.run();

        // Initialisiere Event-Listener basierend auf der Bildschirmgröße
        this.updateEventListeners();
    }

    // Methode zum Hinzufügen/Entfernen von Event-Listenern
    updateEventListeners() {
        // Entferne alle Event-Listener, falls sie bereits existieren
        this.canvas.removeEventListener('mousedown', this.handleCanvasPress);
        this.canvas.removeEventListener('mouseup', this.handleCanvasPress);
        this.canvas.removeEventListener('touchstart', this.handleCanvasPress);
        this.canvas.removeEventListener('touchend', this.handleCanvasPress);

        // Füge Event-Listener nur hinzu, wenn die Bildschirmbreite < 630px oder die Höhe < 800px ist
        if (window.innerWidth < 630 || window.innerHeight < 800) {
            this.canvas.addEventListener('mousedown', (event) => this.handleCanvasPress(event, true));
            this.canvas.addEventListener('mouseup', (event) => this.handleCanvasPress(event, false));
            this.canvas.addEventListener('touchstart', (event) => this.handleCanvasPress(event, true));
            this.canvas.addEventListener('touchend', (event) => this.handleCanvasPress(event, false));
        }
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                enemy.world = this; // Setze die Welt für den Endboss
            }
        });
    }

    // Virtuelle Button-Positionen (Canvas)
    buttonPositions = {
        left: { x: 50, y: 400, width: 60, height: 60 },
        up: { x: 150, y: 400, width: 60, height: 60 },
        right: { x: 250, y: 400, width: 60, height: 60 },
        throw: { x: 350, y: 400, width: 60, height: 60 },
    };

    handleCanvasPress(event, isPressed) {
        event.preventDefault();

        const { x, y } = getTouchPosition(event);

        if (x === null || y === null) {
            console.error("Touch-Koordinaten ungültig:", event);
            return;
        }

        let buttonPressed = false;

        for (const key in this.buttonPositions) {
            if (this.isInsideButton(x, y, this.buttonPositions[key])) {
                if (key === "left") this.keyboard.LEFT = isPressed;
                if (key === "up") {
                    this.keyboard.UP = isPressed;
                    this.keyboard.SPACE = isPressed;
                }
                if (key === "right") this.keyboard.RIGHT = isPressed;
                if (key === "throw") this.keyboard.D = isPressed;
                buttonPressed = true;
            }
        }

        if (!buttonPressed || !isPressed) {
            this.resetKeyboard();
        }
    }

    updateButtonPositions() {
        const scaleFactor = this.canvas.width / 800; // Basisgröße ist 800px
        this.buttonPositions = {
            left: { x: 50 * scaleFactor, y: 400 * scaleFactor, width: 60 * scaleFactor, height: 60 * scaleFactor },
            up: { x: 150 * scaleFactor, y: 400 * scaleFactor, width: 60 * scaleFactor, height: 60 * scaleFactor },
            right: { x: 250 * scaleFactor, y: 400 * scaleFactor, width: 60 * scaleFactor, height: 60 * scaleFactor },
            throw: { x: 350 * scaleFactor, y: 400 * scaleFactor, width: 60 * scaleFactor, height: 60 * scaleFactor },
        };
    }

    isInsideButton(x, y, button) {
        return x > button.x && x < button.x + button.width && y > button.y && y < button.y + button.height;
    }

    resetKeyboard() {
        this.keyboard.LEFT = false;
        this.keyboard.RIGHT = false;
        this.keyboard.UP = false;
        this.keyboard.SPACE = false;
        this.keyboard.D = false;
    }

    // Virtuelle Buttons im Canvas zeichnen
    drawButtons() {
        // Buttons nur zeichnen, wenn die Bildschirmbreite < 630px oder die Höhe < 800px ist
        if (window.innerWidth < 630 || window.innerHeight < 600) {
            this.ctx.lineWidth = 2; // Rahmenstärke

            for (const key in this.buttonPositions) {
                let btn = this.buttonPositions[key];

                // Zeichne den Button (Kreis)
                this.ctx.beginPath();
                this.ctx.arc(
                    btn.x + btn.width / 2, // Mittelpunkt X
                    btn.y + btn.height / 2, // Mittelpunkt Y
                    btn.width / 2, // Radius
                    0, // Startwinkel
                    2 * Math.PI // Endwinkel (vollständiger Kreis)
                );
                this.ctx.fillStyle = '#e0a800'; // Hintergrundfarbe
                this.ctx.fill();
                this.ctx.strokeStyle = '#b8860b'; // Randfarbe
                this.ctx.stroke();

                // Symbol für die Buttons
                this.ctx.fillStyle = '#000'; // Textfarbe
                this.ctx.font = '20px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';

                let symbol = key === "left" ? "⬅️" :
                    key === "up" ? "⬆️" :
                        key === "right" ? "➡️" :
                            key === "throw" ? "🔄" : "";

                this.ctx.fillText(symbol, btn.x + btn.width / 2, btn.y + btn.height / 2);
            }
        }
    }

    updateCoinBar() {
        const collectedCoins = 10 - this.coins.length; // Anzahl gesammelter Münzen
        const percentage = (collectedCoins / 10) * 100; // Prozentualer Fortschritt
        this.coinBar.setPercentage(percentage); // Fortschrittsanzeige aktualisieren
    }

    updateBottleBar() {
        const percentage = (this.character.collectedBottles / 7) * 100; // Prozentualer Fortschritt
        this.bottleBar.setPercentage(percentage); // Flaschen-Fortschrittsanzeige aktualisieren
    }

    run() {
        if (this.runInterval) return; // Verhindere mehrfaches Starten von run()
        this.runInterval = setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkGameOver(); // Prüfe Spielstatus
            this.level.enemies.forEach((enemy) => {
                if (enemy instanceof Endboss) {
                    enemy.activateIfClose(this.character.x); // Aktiviere Endboss
                }
            });
        }, 200); // Alle 200ms prüfen
    }

    stopGame() {
        clearInterval(this.runInterval); // Stoppe das Spiel-Intervall
        cancelAnimationFrame(this.animationFrame); // Stoppe das Zeichnen
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.collectedBottles > 0) {
            if (this.character.otherDirection) {
                this.throwBottleLeft(); // Flasche nach links werfen
            } else {
                this.throwBottleRight(); // Flasche nach rechts werfen
            }
        }
    }

    throwBottleLeft() {
        const startX = this.character.x; // Startposition X
        const startY = this.character.y + 50; // Startposition Y
        const direction = -1; // Richtung: links
        const bottle = new ThrowableObject(startX, startY, direction, this);
        this.throwableObjects.push(bottle);
        this.character.collectedBottles--; // Flaschenanzahl reduzieren
        this.updateBottleBar(); // Flaschen-Fortschrittsanzeige aktualisieren
    }

    throwBottleRight() {
        const startX = this.character.x + 100; // Startposition X
        const startY = this.character.y + 50; // Startposition Y
        const direction = 1; // Richtung: rechts
        const bottle = new ThrowableObject(startX, startY, direction, this);
        this.throwableObjects.push(bottle);
        this.character.collectedBottles--; // Flaschenanzahl reduzieren
        this.updateBottleBar(); // Flaschen-Fortschrittsanzeige aktualisieren
    }

    checkEndbossDefeated() {
        const endbossExists = this.level.enemies.some(
            enemy => enemy instanceof Endboss
        );
        
        if (!endbossExists) {
            this.stopGame();
            this.showWinScreen();
        }
    }

    checkCollisions() {
        if (!this.character) return;
    
        // Gegner-Kollisionen
        this.level.enemies.forEach((enemy) => {
            // Hühner-Kollisionen
            if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
                if (this.character.isColliding(enemy) && this.character.speedY < 0) {
                    this.character.speedY = 15;
                    enemy.playDeathAnimation();
                }
    
                this.throwableObjects.forEach((bottle, bottleIndex) => {
                    if (bottle.isColliding(enemy)) {
                        bottle.playSplashSound();
                        enemy.playDeathAnimation();
                        this.throwableObjects.splice(bottleIndex, 1);
                    }
                });
    
                if (!enemy.isDead && this.character.isColliding(enemy)) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
    
            // Endboss-Kollisionen
            if (enemy instanceof Endboss && !enemy.isDead) {
                this.throwableObjects.forEach((bottle, bottleIndex) => {
                    if (bottle.isColliding(enemy)) {
                        enemy.loseEnergy(20);
                        this.endbossBar.setPercentage(enemy.energy);
                        this.throwableObjects.splice(bottleIndex, 1);
                    }
                });
    
                if (this.character.isColliding(enemy)) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        
        });
    
        // Münzen sammeln
        this.coins.forEach((coin, coinIndex) => {
            if (this.character.isColliding(coin)) {
                this.coins.splice(coinIndex, 1);
                this.updateCoinBar();
            }
        });
    
        // Flaschen sammeln
        this.bottle.forEach((bottle, bottleIndex) => {
            if (this.character.isColliding(bottle)) {
                if (this.character.canCollectBottle()) {
                    this.bottle.splice(bottleIndex, 1);
                    this.character.addBottle();
                    this.updateBottleBar();
                }
            }
        });
    }

    // In der World-Klasse:
// In World.class.js
async checkGameOver() {
    // Character Tod
    if (this.character.isDead() && !this.character.isDeadState) {
        await this.character.die();
        this.stopGame();
        this.showGameOverScreen();
        return;
    }
    
    // Endboss Tod
    const endboss = this.level.enemies.find(e => e instanceof Endboss);
    if (endboss && endboss.energy <= 0 && !endboss.isMarkedForRemoval) {
        await endboss.die(); // Warte auf die komplette Animation
        
        // Sicherstellen, dass der Endboss wirklich tot ist
        if (endboss.isMarkedForRemoval) {
            this.stopGame();
            this.showWinScreen();
        }
    }
}
    
    
 // In World.class.js
showWinScreen() {
    if (this.gameOverShown) return;
    
    this.winScreenShown = true;
    const winScreen = new WinScreen(this.canvas, this.ctx, 'img/9_intro_outro_screens/win/win_2.png');
    winScreen.display();
}

showGameOverScreen() {
    if (this.winScreenShown) return;
    
    this.gameOverShown = true;
    const gameOverScreen = new GameOverScreen(this.canvas, this.ctx, 'img/9_intro_outro_screens/game_over/game over.png');
    gameOverScreen.display();
}

    generateCoins() {
        let coins = [];
        for (let i = 0; i < 7; i++) {
            const x = Math.random() * 1000;
            const y = Math.random() * 300;
            coins.push(new Coin(x, y));
        }
        return coins;
    }

    generateBottle() {
        let bottles = [];
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * 900;
            const y = 330;
            bottles.push(new Bottle(x, y));
        }
        return bottles;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Canvas löschen
        this.ctx.translate(this.camera_x, 0); // Kamera verschieben

        // Hintergrund zuerst zeichnen
        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0); // Kamera zurücksetzen
        // Feste Objekte (Lebensleisten etc.) zeichnen
        this.addToMap(this.statusBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.endbossBar); // Endboss-Lebensleiste
        this.addToMap(this.coinBar);

        this.ctx.translate(this.camera_x, 0); // Kamera erneut verschieben

        // Zeichne den Charakter nur, wenn er existiert
        if (this.character) {
            this.addToMap(this.character);
        }

        // Restliche Objekte (Gegner, Wolken, Flaschen, Münzen) zeichnen
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottle);
        this.addObjectsToMap(
            this.level.enemies.filter(enemy => !enemy.isDead)
        );

        this.ctx.translate(-this.camera_x, 0); // Kamera zurücksetzen

        // Buttons im Canvas zeichnen
        this.drawButtons();

        // Event-Listener basierend auf der Bildschirmgröße aktualisieren
        this.updateEventListeners();

        // Zeichnung wiederholen
        this.animationFrame = requestAnimationFrame(() => {
            this.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

   
    
    
}