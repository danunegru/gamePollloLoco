/**
 * Die zentrale Klasse, die das gesamte Spielgeschehen steuert.
 * Verwaltet Spielfigur, Gegner, Umgebung, UI und Interaktionen.
 */
class World {

    /**
     * Konstruktor: Initialisiert Spielfeld, UI, Gegner und alle Spielobjekte.
     * @param {HTMLCanvasElement} canvas - Zeichenfläche für das Spiel.
     * @param {Keyboard} keyboard - Objekt zur Verwaltung der Tasteneingaben.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.helper = new GameHelper();

        this.character = new Character();
        this.level = createLevel1();

        this.statusBar = new StatusBar();
        this.bottleBar = new BottleBar();
        this.endbossBar = new EndbossBar();
        this.coinBar = new CoinBar();

        this.coins = this.helper.generateCoins();
        this.bottle = this.helper.generateBottles();
        this.buttonPositions = this.helper.updateButtonPositions(this.canvas);
        this.throwableObjects = [];

        this.camera_x = 0;
        this.runInterval;
        this.animationFrame;

        this.draw();
        this.setWorld();
        this.run();
        this.updateEventListeners();
    }

    /**
     * Fügt der Canvas Touch- und Maus-Events für mobile Buttons hinzu.
     */
    updateEventListeners() {
        this.canvas.removeEventListener('mousedown', this.handleCanvasPress);
        this.canvas.removeEventListener('mouseup', this.handleCanvasPress);
        this.canvas.removeEventListener('touchstart', this.handleCanvasPress);
        this.canvas.removeEventListener('touchend', this.handleCanvasPress);

        if (window.innerWidth < 630 || window.innerHeight < 800) {
            this.canvas.addEventListener('mousedown', (event) => this.handleCanvasPress(event, true));
            this.canvas.addEventListener('mouseup', (event) => this.handleCanvasPress(event, false));
            this.canvas.addEventListener('touchstart', (event) => this.handleCanvasPress(event, true));
            this.canvas.addEventListener('touchend', (event) => this.handleCanvasPress(event, false));
        }
    }

    /**
     * Verknüpft die Spielfigur und Endgegner mit der World-Instanz.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                enemy.world = this;
            }
        });
    }

    /**
     * Verarbeitet Klicks auf Touch-Buttons für die mobile Steuerung.
     * @param {Event} event - Eingabeereignis (Touch/Maus)
     * @param {boolean} isPressed - Gibt an, ob gedrückt oder losgelassen wurde.
     */
    handleCanvasPress(event, isPressed) {
        event.preventDefault();
        const { x, y } = getTouchPosition(event);
        if (x === null || y === null) return;

        let buttonPressed = false;
        for (const key in this.buttonPositions) {
            if (this.helper.isInsideButton(x, y, this.buttonPositions[key])) {
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
            this.helper.resetKeyboard(this.keyboard);
        }
    }

    /**
     * Aktualisiert die Münz-Anzeige basierend auf verbliebenen Coins.
     */
    updateCoinBar() {
        const collectedCoins = 10 - this.coins.length;
        const percentage = (collectedCoins / 10) * 100;
        this.coinBar.setPercentage(percentage);
    }

    /**
     * Aktualisiert die Flaschenanzeige (Wurfanzahl).
     */
    updateBottleBar() {
        const percentage = (this.character.collectedBottles / this.character.maxBottles) * 100;
        this.bottleBar.setPercentage(percentage);
    }

    /**
     * Haupt-Game-Loop, prüft regelmäßig Spielstatus und Kollisionen.
     */
    run() {
        if (this.runInterval) return;
        this.runInterval = setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkGameOver();
            this.level.enemies.forEach((enemy) => {
                if (enemy instanceof Endboss) {
                    enemy.activateIfClose(this.character.x);
                }
            });
        }, 200);
    }

    /**
     * Stoppt Spielablauf und Zeichenfunktion.
     */
    stopGame() {
        clearInterval(this.runInterval);
        cancelAnimationFrame(this.animationFrame);
    }

    /**
     * Prüft ob eine Flasche geworfen werden darf und erstellt sie.
     */
    checkThrowObjects() {
        if (this.keyboard.D && this.character.collectedBottles > 0 && ThrowableObject.canThrow()) {
            if (this.character.otherDirection) {
                this.throwBottleLeft();
            } else {
                this.throwBottleRight();
            }
        }
    }

    /**
     * Erstellt eine Flasche nach links.
     */
    throwBottleLeft() {
        const startX = this.character.x;
        const startY = this.character.y + 50;
        const direction = -1;
        const bottle = new ThrowableObject(startX, startY, direction, this);
        this.throwableObjects.push(bottle);
        this.character.collectedBottles--;
        this.updateBottleBar();
    }

    /**
     * Erstellt eine Flasche nach rechts.
     */
    throwBottleRight() {
        const startX = this.character.x + 100;
        const startY = this.character.y + 50;
        const direction = 1;
        const bottle = new ThrowableObject(startX, startY, direction, this);
        this.throwableObjects.push(bottle);
        this.character.collectedBottles--;
        this.updateBottleBar();
    }

    /**
     * Prüft ob das Spiel zu Ende ist (Sieg oder Niederlage).
     */
    async checkGameOver() {
        if (this.character.isDead() && !this.character.isDeadState) {
            await this.character.die();
            this.stopGame();
            this.showGameOverScreen();
            return;
        }

        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.energy <= 0 && !endboss.isDead) {
            await endboss.die();
            this.stopGame();
            this.showWinScreen();
        }
    }

    /**
     * Zeigt den Gewinnbildschirm.
     */
    showWinScreen() {
        if (this.winScreenShown) return;
        this.winScreenShown = true;
        const winScreen = new WinScreen(this.canvas, this.ctx, 'img/9_intro_outro_screens/win/win_2.png');
        winScreen.display();
    }

    /**
     * Zeigt den Game Over-Bildschirm.
     */
    showGameOverScreen() {
        if (this.gameOverShown) return;
        this.gameOverShown = true;
        const gameOverScreen = new GameOverScreen(this.canvas, this.ctx, 'img/9_intro_outro_screens/game_over/game over.png');
        gameOverScreen.display();
    }

    /**
     * Prüft alle relevanten Kollisionen im Spiel.
     */
    checkCollisions() {
        if (!this.character) return;

        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
                if (this.character.isColliding(enemy)) {
                    if (this.character.speedY < 0 && !enemy.isDead) {
                        enemy.playDeathAnimation();
                    } else if (!enemy.isDead && this.character.speedY >= 0) {
                        this.character.hit();
                        this.statusBar.setPercentage(this.character.energy);
                    }
                }
                this.throwableObjects.forEach((bottle, i) => {
                    if (bottle.isColliding(enemy)) {
                        bottle.playSplashSound();
                        enemy.playDeathAnimation();
                        this.throwableObjects.splice(i, 1);
                    }
                });
            }

            if (enemy instanceof Endboss && !enemy.isDead) {
                this.throwableObjects.forEach((bottle, i) => {
                    if (bottle.isColliding(enemy)) {
                        enemy.loseEnergy(20);
                        this.endbossBar.setPercentage(enemy.energy);
                        this.throwableObjects.splice(i, 1);
                    }
                });
                if (this.character.isColliding(enemy)) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        });

        this.coins.forEach((coin, i) => {
            if (this.character.isColliding(coin)) {
                this.coins.splice(i, 1);
                this.updateCoinBar();
            }
        });

        this.bottle.forEach((bottle, i) => {
            if (this.character.isColliding(bottle)) {
                if (this.character.canCollectBottle()) {
                    this.bottle.splice(i, 1);
                    this.character.addBottle();
                    this.updateBottleBar();
                }
            }
        });
    }

    /**
     * Hauptzeichenfunktion. Wird dauerhaft per requestAnimationFrame aufgerufen.
     */
    draw() {
        this.clearAndTranslateCanvas();
        this.drawLevelObjects();
        this.drawUI();
        this.drawButtons();
        this.updateEventListeners();
        this.animationFrame = requestAnimationFrame(() => this.draw());
    }

    clearAndTranslateCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
    }

    drawLevelObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        if (this.character) this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottle);
        this.addObjectsToMap(this.level.enemies.filter(enemy => !enemy.isDead));
        this.ctx.translate(-this.camera_x, 0);
    }

    drawUI() {
        this.addToMap(this.statusBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.endbossBar);
        this.addToMap(this.coinBar);
    }

    drawButtons() {
        if (window.innerWidth < 630 || window.innerHeight < 600) {
            this.ctx.lineWidth = 2;
            for (const key in this.buttonPositions) {
                let btn = this.buttonPositions[key];
                this.ctx.beginPath();
                this.ctx.arc(btn.x + btn.width / 2, btn.y + btn.height / 2, btn.width / 2, 0, 2 * Math.PI);
                this.ctx.fillStyle = '#e0a800';
                this.ctx.fill();
                this.ctx.strokeStyle = '#b8860b';
                this.ctx.stroke();

                this.ctx.fillStyle = '#000';
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

    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x *= -1;
    }

    flipImageBack(mo) {
        mo.x *= -1;
        this.ctx.restore();
    }

    muteAllSounds() {
        if (this.backgroundSound) {
            this.backgroundSound.muted = !this.backgroundSound.muted;
        }
    }

    /**
     * Alternative Sieganzeige ohne Endboss-Animation.
     */
    checkEndbossDefeated() {
        const endbossExists = this.level.enemies.some(
            enemy => enemy instanceof Endboss
        );

        if (!endbossExists) {
            this.stopGame();
            this.showWinScreen();
        }
    }
}
