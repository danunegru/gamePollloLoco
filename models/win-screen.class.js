/**
 * Class representing the win screen with buttons and interactions.
 */
class WinScreen {
    /**
     * Creates a win screen.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
     * @param {string} imagePath - Path to the background image.
     */
    constructor(canvas, ctx, imagePath) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.imagePath = imagePath;

        this.buttonWidth = 300;
        this.menuButtonWidth = 160;
        this.buttonHeight = 60;
        const buttonSpacing = 20;
        const totalWidth = this.buttonWidth + buttonSpacing + this.menuButtonWidth;

        this.buttonX = (canvas.width - totalWidth) / 2;
        this.buttonY = canvas.height - 80;
        this.menuButtonX = this.buttonX + this.buttonWidth + buttonSpacing;
        this.menuButtonY = this.buttonY;

        this.isHovering = false;
        this.menuIsHovering = false;
        this.listenersBound = false;
        this.backgroundImage = new Image();
        this.backgroundImageLoaded = false;
        this.backgroundImage.src = this.imagePath;
        this.backgroundImage.onload = () => {
            this.backgroundImageLoaded = true;
            this.redraw();
        };
    }

    /**
     * Displays the win screen and binds event listeners.
     */
    display() {
        this.bindListeners();
    }

    /**
     * Binds event listeners for mouse and touch events.
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
     * Removes all previously bound event listeners.
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
     * Redraws the win screen including background and buttons.
     */
    redraw() {
        if (!this.backgroundImageLoaded) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawOverlay();

        const imageWidth = this.canvas.width * 0.8;
        const imageHeight = this.canvas.height * 0.6;
        const imageX = (this.canvas.width - imageWidth) / 2;
        const imageY = (this.canvas.height - imageHeight) / 2;
        this.ctx.drawImage(this.backgroundImage, imageX, imageY, imageWidth, imageHeight);

        this.drawButton();
        this.drawMenuButton();
    }

    /**
     * Draws a semi-transparent overlay over the canvas.
     */
    drawOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws the "Play Again" button.
     */
    drawButton() {
        this.ctx.fillStyle = this.isHovering ? 'rgba(200, 200, 200, 0.8)' : 'rgba(255, 255, 255, 0.8)';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.lineWidth = 2;

        this.drawRoundedRect(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);

        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px "Permanent Marker"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Noch einmal spielen!', this.buttonX + this.buttonWidth / 2, this.buttonY + this.buttonHeight / 2);
    }

    /**
     * Draws the "Menu" button.
     */
    drawMenuButton() {
        this.ctx.fillStyle = this.menuIsHovering ? 'rgba(200, 200, 200, 0.8)' : 'rgba(255, 255, 255, 0.8)';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.lineWidth = 2;

        this.drawRoundedRect(this.menuButtonX, this.menuButtonY, this.menuButtonWidth, this.buttonHeight);

        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px "Permanent Marker"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Menu', this.menuButtonX + this.menuButtonWidth / 2, this.menuButtonY + this.buttonHeight / 2);
    }

    /**
     * Draws a rounded rectangle.
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
     * Handles mouse move events to update button hover states.
     * @param {MouseEvent} event - Mouse event.
     */
    handleMouseMove(event) {
        const { x, y } = this.getScaledCoords(event.clientX, event.clientY);
        this.updateHoverState(x, y);
    }

    /**
     * Handles touch move events to update button hover states.
     * @param {TouchEvent} event - Touch event.
     */
    handleTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const { x, y } = this.getScaledCoords(touch.clientX, touch.clientY);
        this.updateHoverState(x, y);
    }

    /**
     * Handles click events and triggers button actions.
     * @param {MouseEvent} event - Mouse event.
     */
    handleClick(event) {
        const { x, y } = this.getScaledCoords(event.clientX, event.clientY);
        this.checkButtonClick(x, y);
        this.checkMenuButtonClick(x, y);
    }

    /**
     * Handles touch start events and triggers button actions.
     * @param {TouchEvent} event - Touch event.
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
     * @returns {Object} Scaled coordinates {x, y}.
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
     * Updates hover states for buttons based on position.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     */
    updateHoverState(x, y) {
        const hovering = this.checkHover(x, y);
        const hoveringMenu = this.checkHoverMenuButton(x, y);

        if (hovering !== this.isHovering || hoveringMenu !== this.menuIsHovering) {
            this.isHovering = hovering;
            this.menuIsHovering = hoveringMenu;
            this.redraw();
        }

        this.updateCursor(hovering || hoveringMenu);
    }

    /**
     * Checks if the play again button is being hovered.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
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
     * Checks if the menu button is being hovered.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @returns {boolean} True if hovering.
     */
    checkHoverMenuButton(x, y) {
        return (
            x > this.menuButtonX &&
            x < this.menuButtonX + this.menuButtonWidth &&
            y > this.menuButtonY &&
            y < this.menuButtonY + this.buttonHeight
        );
    }

    /**
     * Updates the cursor based on hover state.
     * @param {boolean} hovering - Whether hovering over a button.
     */
    updateCursor(hovering) {
        this.canvas.style.cursor = hovering ? 'pointer' : 'default';
    }

    /**
     * Checks if the play again button was clicked and restarts the game.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     */
    checkButtonClick(x, y) {
        if (this.checkHover(x, y)) {
            this.restartGame();
        }
    }

    /**
     * Checks if the menu button was clicked and returns to menu.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     */
    checkMenuButtonClick(x, y) {
        if (this.checkHoverMenuButton(x, y)) {
            this.goToMenu();
        }
    }

    /**
     * Restarts the game.
     */
    restartGame() {
        this.removeListeners();
        this.resetAudio();
        this.resetWorld();
        this.restartUI();
        startMainGame();
    }

    /**
     * Navigates back to the main menu.
     */
    goToMenu() {
        this.removeListeners();
        this.resetAudio();
        this.resetWorld();
        document.getElementById('startScreen').style.display = 'block';
        this.canvas.style.display = 'none';
    }

    /**
     * Resets and stops background audio.
     */
    resetAudio() {
        if (world?.backgroundSound) {
            world.backgroundSound.pause();
            world.backgroundSound.currentTime = 0;
        }
    }

    /**
     * Stops the game world and resets the state.
     */
    resetWorld() {
        if (world) {
            world.stopGame();
            world = null;
        }
        gameStarted = false;
    }

    /**
     * Restarts the UI to start screen view.
     */
    restartUI() {
        document.getElementById('startScreen').style.display = 'none';
        this.canvas.style.display = 'block';
    }
}
