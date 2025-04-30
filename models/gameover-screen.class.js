/**
 * Class representing the game over screen with restart and menu buttons.
 */
class GameOverScreen {
    /**
     * Creates a game over screen instance.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
     * @param {string} imagePath - Path to the game over background image.
     */
    constructor(canvas, ctx, imagePath) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.imagePath = imagePath;

        this.buttonWidth = 300;
        this.buttonHeight = 60;
        this.menuButtonWidth = 160;
        this.menuButtonHeight = 60;
        const buttonSpacing = 20;
        const totalWidth = this.buttonWidth + buttonSpacing + this.menuButtonWidth;

        this.buttonX = (canvas.width - totalWidth) / 2;
        this.buttonY = canvas.height - 100;
        this.menuButtonX = this.buttonX + this.buttonWidth + buttonSpacing;
        this.menuButtonY = this.buttonY;

        this.isHovering = false;
        this.menuIsHovering = false;
        this.listenersBound = false;
    }

    /**
     * Displays the screen, draws overlay, image and buttons, and binds listeners.
     */
    display() {
        this.drawOverlay();
        this.loadAndDrawImage();
        this.bindListeners();
    }

    /**
     * Draws a semi-transparent overlay over the canvas.
     */
    drawOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Loads the game over image and draws it along with buttons once loaded.
     */
    loadAndDrawImage() {
        const image = new Image();
        image.src = this.imagePath;
        image.onload = () => {
            const imageWidth = this.canvas.width * 0.8;
            const imageHeight = this.canvas.height * 0.6;
            const imageX = (this.canvas.width - imageWidth) / 2;
            const imageY = (this.canvas.height - imageHeight) / 2;
            this.ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);
            this.drawButton();
            this.drawMenuButton();
        };
    }

    /**
     * Binds event listeners for mouse and touch interactions.
     */
    bindListeners() {
        if (this.listenersBound) return;

        this.handleMouseMoveBound = this.handleMouseMove.bind(this);
        this.handleClickBound = this.handleClick.bind(this);
        this.handleTouchBound = this.handleTouch.bind(this);
        this.handleTouchMoveBound = this.handleTouchMove.bind(this);

        this.canvas.addEventListener('mousemove', this.handleMouseMoveBound);
        this.canvas.addEventListener('click', this.handleClickBound);
        this.canvas.addEventListener('touchstart', this.handleTouchBound);
        this.canvas.addEventListener('touchmove', this.handleTouchMoveBound);

        this.listenersBound = true;
    }

    /**
     * Removes all event listeners.
     */
    removeListeners() {
        if (!this.listenersBound) return;

        this.canvas.removeEventListener('mousemove', this.handleMouseMoveBound);
        this.canvas.removeEventListener('click', this.handleClickBound);
        this.canvas.removeEventListener('touchstart', this.handleTouchBound);
        this.canvas.removeEventListener('touchmove', this.handleTouchMoveBound);

        this.listenersBound = false;
    }

    /**
     * Draws the "Play Again" button.
     */
    drawButton() {
        this.ctx.fillStyle = this.isHovering ? 'rgba(200, 200, 200, 0.9)' : 'rgba(255, 255, 255, 0.9)';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.lineWidth = 2;

        this.drawRoundedRect(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
        this.ctx.fillStyle = 'black';
        this.ctx.font = '22px "Permanent Marker"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Noch einmal spielen!', this.buttonX + this.buttonWidth / 2, this.buttonY + this.buttonHeight / 2);
    }

    /**
     * Draws the "Menu" button.
     */
    drawMenuButton() {
        this.ctx.fillStyle = this.menuIsHovering ? 'rgba(200, 200, 200, 0.9)' : 'rgba(255, 255, 255, 0.9)';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.lineWidth = 2;

        this.drawRoundedRect(this.menuButtonX, this.menuButtonY, this.menuButtonWidth, this.menuButtonHeight);
        this.ctx.fillStyle = 'black';
        this.ctx.font = '22px "Permanent Marker"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Menu', this.menuButtonX + this.menuButtonWidth / 2, this.menuButtonY + this.menuButtonHeight / 2);
    }

    /**
     * Draws a rounded rectangle on the canvas.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {number} width - Rectangle width.
     * @param {number} height - Rectangle height.
     */
    drawRoundedRect(x, y, width, height) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + 10, y);
        this.ctx.lineTo(x + width - 10, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + 10);
        this.ctx.lineTo(x + width, y + height - 10);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - 10, y + height);
        this.ctx.lineTo(x + 10, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - 10);
        this.ctx.lineTo(x, y + 10);
        this.ctx.quadraticCurveTo(x, y, x + 10, y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    /**
     * Handles mouse move events to update hover state.
     * @param {MouseEvent} event - Mouse move event.
     */
    handleMouseMove(event) {
        const { x, y } = this.getScaledCoords(event.clientX, event.clientY);
        this.updateHoverState(x, y);
    }

    /**
     * Handles touch move events to update hover state.
     * @param {TouchEvent} event - Touch move event.
     */
    handleTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const { x, y } = this.getScaledCoords(touch.clientX, touch.clientY);
        this.updateHoverState(x, y);
    }

    /**
     * Handles click events to check button actions.
     * @param {MouseEvent} event - Click event.
     */
    handleClick(event) {
        const { x, y } = this.getScaledCoords(event.clientX, event.clientY);
        this.checkButtonClick(x, y);
        this.checkMenuButtonClick(x, y);
    }

    /**
     * Handles touch start events to check button actions.
     * @param {TouchEvent} event - Touch start event.
     */
    handleTouch(event) {
        const touch = event.touches[0];
        const { x, y } = this.getScaledCoords(touch.clientX, touch.clientY);
        this.checkButtonClick(x, y);
        this.checkMenuButtonClick(x, y);
    }

    /**
     * Converts client coordinates to canvas coordinates.
     * @param {number} clientX - X coordinate.
     * @param {number} clientY - Y coordinate.
     * @returns {{x: number, y: number}} Scaled canvas coordinates.
     */
    getScaledCoords(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        return { x, y };
    }

    /**
     * Updates the hover state and redraws buttons if needed.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     */
    updateHoverState(x, y) {
        const hoveringMain = this.checkHover(x, y);
        const hoveringMenu = this.checkHoverMenuButton(x, y);

        if (hoveringMain !== this.isHovering || hoveringMenu !== this.menuIsHovering) {
            this.isHovering = hoveringMain;
            this.menuIsHovering = hoveringMenu;
            this.drawButton();
            this.drawMenuButton();
        }

        this.updateCursor(hoveringMain || hoveringMenu);
    }

    /**
     * Checks if the "Play Again" button is being hovered.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @returns {boolean} True if hovering.
     */
    checkHover(x, y) {
        return (
            x > this.buttonX &&
            x < this.buttonX + this.buttonWidth &&
            y > this.buttonY &&
            y < this.buttonY + this.buttonHeight
        );
    }

    /**
     * Checks if the "Menu" button is being hovered.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @returns {boolean} True if hovering.
     */
    checkHoverMenuButton(x, y) {
        return (
            x > this.menuButtonX &&
            x < this.menuButtonX + this.menuButtonWidth &&
            y > this.menuButtonY &&
            y < this.menuButtonY + this.menuButtonHeight
        );
    }

    /**
     * Updates the cursor style depending on hover state.
     * @param {boolean} hovering - True if any button is being hovered.
     */
    updateCursor(hovering) {
        this.canvas.style.cursor = hovering ? 'pointer' : 'default';
    }

    /**
     * Checks if the "Play Again" button was clicked and restarts game.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     */
    checkButtonClick(x, y) {
        if (this.checkHover(x, y)) {
            this.restartGame();
        }
    }

    /**
     * Checks if the "Menu" button was clicked and returns to menu.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     */
    checkMenuButtonClick(x, y) {
        if (this.checkHoverMenuButton(x, y)) {
            this.goToMenu();
        }
    }

    /**
     * Restarts the game and UI.
     */
    restartGame() {
        this.removeListeners();
        this.resetAudio();
        this.resetWorld();
        this.restartUI();
        startMainGame();
    }

    /**
     * Returns to the main menu.
     */
    goToMenu() {
        this.removeListeners();
        this.resetAudio();
        this.resetWorld();
        document.getElementById('startScreen').style.display = 'block';
        this.canvas.style.display = 'none';
    }

    /**
     * Resets background audio if available.
     */
    resetAudio() {
        if (world?.backgroundSound) {
            world.backgroundSound.pause();
            world.backgroundSound.currentTime = 0;
        }
    }

    /**
     * Stops the game world and clears state.
     */
    resetWorld() {
        if (world) {
            world.stopGame();
            world = null;
        }
        gameStarted = false;
    }

    /**
     * Restores the UI to the initial state.
     */
    restartUI() {
        document.getElementById('startScreen').style.display = 'none';
        this.canvas.style.display = 'block';
    }
}
