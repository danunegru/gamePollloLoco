/**
 * Main class controlling the entire game: player, enemies, UI & interactions.
 */
class World {

    /**
     * Initializes game field, UI & enemies.
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {Keyboard} keyboard - Keyboard input handler.
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
        this.buttonPositions = this.helper.updateButtonPositions(canvas);
        this.throwableObjects = [];
        this.camera_x = 0;
        this.draw();
        this.setWorld();
        this.run();
        this.updateEventListeners();
    }

    /**
     * Sets up or removes event listeners for mobile controls.
     */
    updateEventListeners() {
        const events = ['mousedown', 'mouseup', 'touchstart', 'touchend'];
        events.forEach(e => this.canvas.removeEventListener(e, this.handleCanvasPress));
        
        if (this.isMobileOrTablet()) {
            this.canvas.addEventListener('mousedown', e => this.handleCanvasPress(e, true));
            this.canvas.addEventListener('mouseup', e => this.handleCanvasPress(e, false));
            this.canvas.addEventListener('touchstart', e => this.handleCanvasPress(e, true));
            this.canvas.addEventListener('touchend', e => this.handleCanvasPress(e, false));
        }
    }
    
    isResponsiveView() {
        return window.innerWidth < 1400;
    }
    
    


    /**
     * Links character & endboss to this world instance.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(e => { if (e instanceof Endboss) e.world = this; });
    }

    /**
     * Handles mobile button presses.
     * @param {Event} event - Input event.
     * @param {boolean} isPressed - Whether the button is pressed.
     */
    handleCanvasPress(event, isPressed) {
        event.preventDefault();
        const { x, y } = getTouchPosition(event);
        if (x === null || y === null) return;
        let pressed = false;
        for (const key in this.buttonPositions) {
            if (this.helper.isInsideButton(x, y, this.buttonPositions[key])) {
                if (key === "left") this.keyboard.LEFT = isPressed;
                if (key === "up") {
                    this.keyboard.UP = isPressed;
                    this.keyboard.SPACE = isPressed;
                }
                if (key === "right") this.keyboard.RIGHT = isPressed;
                if (key === "throw") this.keyboard.D = isPressed;
                pressed = true;
            }
        }
        if (!pressed || !isPressed) this.helper.resetKeyboard(this.keyboard);
    }

    /** Updates the coin bar based on collected coins. */
    updateCoinBar() {
        const percentage = ((10 - this.coins.length) / 10) * 100;
        this.coinBar.setPercentage(percentage);
    }

    /** Updates the bottle bar (throwable count). */
    updateBottleBar() {
        const percentage = (this.character.collectedBottles / this.character.maxBottles) * 100;
        this.bottleBar.setPercentage(percentage);
    }

    /** Starts the game loop. */
    run() {
        if (this.runInterval) return;
        this.runInterval = setInterval(() => {
            this.checkCollisions();
            this.helper.checkThrowObjects(this);
            this.helper.checkGameOver(this);
            this.level.enemies.forEach(e => {
                if (e instanceof Endboss) e.activateIfClose(this.character.x);
            });
        }, 200);
    }

    /** Stops game loop and animations. */
    stopGame() {
        if (this.runInterval) {
            clearInterval(this.runInterval);
            this.runInterval = null;
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    /** Throws a bottle to the left. */
    throwBottleLeft() {
        this.createBottle(this.character.x, this.character.y + 50, -1);
    }

    /** Throws a bottle to the right. */
    throwBottleRight() {
        this.createBottle(this.character.x + 100, this.character.y + 50, 1);
    }

    /**
     * Creates a throwable bottle.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {number} direction - Direction (-1 or 1).
     */
    createBottle(x, y, direction) {
        const bottle = new ThrowableObject(x, y, direction, this);
        this.throwableObjects.push(bottle);
        this.character.collectedBottles--;
        this.updateBottleBar();
    }

    /** Displays the win screen. */
    showWinScreen() {
        if (this.winScreenShown) return;
        this.winScreenShown = true;
        new WinScreen(this.canvas, this.ctx, 'img/9_intro_outro_screens/win/win_2.png').display();
    }

    /** Displays the game over screen. */
    showGameOverScreen() {
        if (this.gameOverShown) return;
        this.gameOverShown = true;
        new GameOverScreen(this.canvas, this.ctx, 'img/9_intro_outro_screens/game_over/game over.png').display();
    }

    /** Checks all game collisions. */
    checkCollisions() {
        if (!this.character) return;
        this.level.enemies.forEach(e => this.checkEnemyCollision(e));
        this.coins.forEach((coin, i) => this.checkCoinCollision(coin, i));
        this.bottle.forEach((bottle, i) => this.checkBottleCollision(bottle, i));
    }

    /**
     * Handles enemy collisions.
     * @param {Object} enemy - The enemy object.
     */
    checkEnemyCollision(enemy) {
        if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
            this.handleChickenCollision(enemy);
        }
        if (enemy instanceof Endboss && !enemy.isDead) {
            this.handleEndbossCollision(enemy);
        }
    }

    /**
     * Handles collisions with chickens.
     * @param {Object} enemy - Chicken enemy.
     */
    handleChickenCollision(enemy) {
        if (this.character.isColliding(enemy)) {
            if (this.character.speedY < 0 && !enemy.isDead) {
                enemy.playDeathAnimation();
            } else if (!enemy.isDead) {
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

    /**
     * Handles collisions with the endboss.
     * @param {Object} enemy - Endboss.
     */
    handleEndbossCollision(enemy) {
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

    /**
     * Checks coin collisions.
     * @param {Object} coin - Coin object.
     * @param {number} index - Index in array.
     */
    checkCoinCollision(coin, index) {
        if (this.character.isColliding(coin)) {
            this.coins.splice(index, 1);
            this.updateCoinBar();
        }
    }

    /**
     * Checks bottle pickup collisions.
     * @param {Object} bottle - Bottle object.
     * @param {number} index - Index in array.
     */
    checkBottleCollision(bottle, index) {
        if (this.character.isColliding(bottle)) {
            if (this.character.canCollectBottle()) {
                this.bottle.splice(index, 1);
                this.character.addBottle();
                this.updateBottleBar();
            }
        }
    }

    /** Main draw loop (called via requestAnimationFrame). */
    draw() {
        this.clearAndTranslateCanvas();
        this.drawLevelObjects();
        this.drawUI();
        this.drawButtons();
        this.updateEventListeners();
        this.animationFrame = requestAnimationFrame(() => this.draw());
    }

    /** Clears canvas & translates the camera. */
    clearAndTranslateCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
    }

    /** Draws all level objects. */
    drawLevelObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.drawCharacter();
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottle);
        this.addObjectsToMap(this.level.enemies.filter(e => !e.isDead));
        this.ctx.translate(-this.camera_x, 0);
    }

    /** Draws the main character. */
    drawCharacter() {
        if (this.character) this.addToMap(this.character);
    }

    /** Draws the UI (bars etc.). */
    drawUI() {
        [this.statusBar, this.bottleBar, this.endbossBar, this.coinBar].forEach(ui => this.addToMap(ui));
    }

    /** Draws on-screen control buttons for mobile. */
 drawButtons() {
    if (this.isResponsiveView()) {
        this.ctx.lineWidth = 2;
        for (const key in this.buttonPositions) {
            this.drawSingleButton(key, this.buttonPositions[key]);
        }
    }
}


    /**
 * Checks if the device is mobile or tablet (based on size or touch support).
 * @returns {boolean}
 */
isMobileOrTablet() {
    return (
        window.innerWidth < 800 ||
        window.innerHeight < 800 ||
        'ontouchstart' in window
    );
}

    /**
     * Draws a single control button.
     * @param {string} key - Button key.
     * @param {Object} btn - Button object.
     */
    drawSingleButton(key, btn) {
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
        const symbol = { left: "⬅️", up: "⬆️", right: "➡️", throw: "🔄" }[key] || "";
        this.ctx.fillText(symbol, btn.x + btn.width / 2, btn.y + btn.height / 2);
    }

    /**
     * Adds multiple objects to the canvas.
     * @param {Array} objects - Game objects.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Adds a single object to the canvas.
     * @param {Object} mo - Movable object.
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Flips image horizontally.
     * @param {Object} mo - Movable object.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x *= -1;
    }

    /**
     * Restores image flip.
     * @param {Object} mo - Movable object.
     */
    flipImageBack(mo) {
        mo.x *= -1;
        this.ctx.restore();
    }

    /** Mutes/unmutes all sounds. */
    muteAllSounds() {
        if (this.backgroundSound) {
            this.backgroundSound.muted = !this.backgroundSound.muted;
        }
    }

    /** Checks if the endboss is defeated. */
    checkEndbossDefeated() {
        const bossAlive = this.level.enemies.some(e => e instanceof Endboss);
        if (!bossAlive) {
            this.stopGame();
            this.showWinScreen();
        }
    }
}
