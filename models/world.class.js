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

        this.updateEventListeners();
    }

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

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                enemy.world = this;
            }
        });
    }

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


    drawButtons() {
        if (window.innerWidth < 630 || window.innerHeight < 600) {
            this.ctx.lineWidth = 2;

            for (const key in this.buttonPositions) {
                let btn = this.buttonPositions[key];

                this.ctx.beginPath();
                this.ctx.arc(
                    btn.x + btn.width / 2,
                    btn.y + btn.height / 2,
                    btn.width / 2,
                    0,
                    2 * Math.PI
                );
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

    updateCoinBar() {
        const collectedCoins = 10 - this.coins.length;
        const percentage = (collectedCoins / 10) * 100;
        this.coinBar.setPercentage(percentage);
    }

    updateBottleBar() {
        const percentage = (this.character.collectedBottles / 7) * 100;
        this.bottleBar.setPercentage(percentage);
    }

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

    stopGame() {
        clearInterval(this.runInterval);
        cancelAnimationFrame(this.animationFrame);
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.collectedBottles > 0 && ThrowableObject.canThrow()) {
            if (this.character.otherDirection) {
                this.throwBottleLeft();
            } else {
                this.throwBottleRight();
            }
        }
    }

    throwBottleLeft() {
        const startX = this.character.x;
        const startY = this.character.y + 50;
        const direction = -1;
        const bottle = new ThrowableObject(startX, startY, direction, this);
        this.throwableObjects.push(bottle);
        this.character.collectedBottles--;
        this.updateBottleBar();
    }

    throwBottleRight() {
        const startX = this.character.x + 100;
        const startY = this.character.y + 50;
        const direction = 1;
        const bottle = new ThrowableObject(startX, startY, direction, this);
        this.throwableObjects.push(bottle);
        this.character.collectedBottles--;
        this.updateBottleBar();
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
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
                if (this.character.isColliding(enemy)) {
                    if (this.character.speedY < 0 && !enemy.isDead) {
                        if (!this.character.justBounced) {
                            this.character.speedY = 15;
                            this.character.justBounced = true;
                            setTimeout(() => {
                                this.character.justBounced = false;
                            }, 500);
                        }
                        enemy.playDeathAnimation();
                    } else if (!enemy.isDead && this.character.speedY >= 0) {
                        this.character.hit();
                        this.statusBar.setPercentage(this.character.energy);
                    }
                }

                this.throwableObjects.forEach((bottle, bottleIndex) => {
                    if (bottle.isColliding(enemy)) {
                        bottle.playSplashSound();
                        enemy.playDeathAnimation();
                        this.throwableObjects.splice(bottleIndex, 1);
                    }
                });
            }

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

        this.coins.forEach((coin, coinIndex) => {
            if (this.character.isColliding(coin)) {
                this.coins.splice(coinIndex, 1);
                this.updateCoinBar();
            }
        });

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

    async checkGameOver() {
        if (this.character.isDead() && !this.character.isDeadState) {
            await this.character.die();
            this.stopGame();
            this.showGameOverScreen();
            return;
        }

        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.energy <= 0 && !endboss.isMarkedForRemoval) {
            await endboss.die();

            if (endboss.isMarkedForRemoval) {
                this.stopGame();
                this.showWinScreen();
            }
        }
    }

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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0); this.addToMap(this.statusBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.endbossBar);
        this.addToMap(this.coinBar);

        this.ctx.translate(this.camera_x, 0);

        if (this.character) {
            this.addToMap(this.character);
        }
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottle);
        this.addObjectsToMap(
            this.level.enemies.filter(enemy => !enemy.isDead)
        );

        this.ctx.translate(-this.camera_x, 0);
        this.drawButtons();
        this.updateEventListeners();
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

    muteAllSounds() {
        if (this.backgroundSound) {
            this.backgroundSound.muted = !this.backgroundSound.muted;
        }
        // Füge hier weitere Sounds hinzu wenn nötig
    }
}