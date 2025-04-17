class WinScreen {
    constructor(canvas, ctx, imagePath) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.imagePath = imagePath;
        this.buttonX = canvas.width / 2 - 150;
        this.buttonY = canvas.height - 80;
        this.buttonWidth = 300;
        this.buttonHeight = 60;
        this.isHovering = false;
        this.listenersBound = false;
    }

    display() {
        this.drawOverlay();
        this.loadAndDrawImage();
        this.bindListeners();
    }

    drawOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

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
        };
    }

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

    removeListeners() {
        if (!this.listenersBound) return;

        this.canvas.removeEventListener('mousemove', this.handleMouseMoveBound);
        this.canvas.removeEventListener('click', this.handleClickBound);
        this.canvas.removeEventListener('touchstart', this.handleTouchBound);
        this.canvas.removeEventListener('touchmove', this.handleTouchMoveBound);

        this.listenersBound = false;
    }

    drawButton() {
        this.setupButtonStyles();
        this.drawButtonShape();
        this.drawButtonText();
    }

    setupButtonStyles() {
        this.ctx.fillStyle = this.isHovering ? 'rgba(200, 200, 200, 0.8)' : 'rgba(255, 255, 255, 0.8)';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.lineWidth = 2;
    }

    drawButtonShape() {
        const bx = this.buttonX, by = this.buttonY, bw = this.buttonWidth, bh = this.buttonHeight;

        this.ctx.beginPath();
        this.ctx.moveTo(bx + 10, by);
        this.ctx.lineTo(bx + bw - 10, by);
        this.ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + 10);
        this.ctx.lineTo(bx + bw, by + bh - 10);
        this.ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - 10, by + bh);
        this.ctx.lineTo(bx + 10, by + bh);
        this.ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - 10);
        this.ctx.lineTo(bx, by + 10);
        this.ctx.quadraticCurveTo(bx, by, bx + 10, by);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawButtonText() {
        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px "Permanent Marker"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Noch einmal spielen!', this.canvas.width / 2, this.buttonY + this.buttonHeight / 2);
    }

    handleMouseMove(event) {
        const { x, y } = this.getScaledCoords(event.clientX, event.clientY);
        this.updateHoverState(x, y);
    }

    handleTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const { x, y } = this.getScaledCoords(touch.clientX, touch.clientY);
        this.updateHoverState(x, y);
    }

    handleClick(event) {
        const { x, y } = this.getScaledCoords(event.clientX, event.clientY);
        this.checkButtonClick(x, y);
    }

    handleTouch(event) {
        const touch = event.touches[0];
        const { x, y } = this.getScaledCoords(touch.clientX, touch.clientY);
        this.checkButtonClick(x, y);
    }

    getScaledCoords(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        return { x, y };
    }

    updateHoverState(x, y) {
        const hovering = this.checkHover(x, y);
        if (hovering !== this.isHovering) {
            this.isHovering = hovering;
            this.drawButton();
        }
        this.updateCursor(hovering);
    }

    checkHover(x, y) {
        return (
            x > this.buttonX &&
            x < this.buttonX + this.buttonWidth &&
            y > this.buttonY &&
            y < this.buttonY + this.buttonHeight
        );
    }

    updateCursor(hovering) {
        this.canvas.style.cursor = hovering ? 'pointer' : 'default';
    }

    checkButtonClick(x, y) {
        if (this.checkHover(x, y)) {
            this.restartGame();
        }
    }

    restartGame() {
        this.removeListeners();
        this.resetAudio();
        this.resetWorld();
        this.restartUI();
        startMainGame();
    }

    resetAudio() {
        if (world?.backgroundSound) {
            world.backgroundSound.pause();
            world.backgroundSound.currentTime = 0;
        }
    }

    resetWorld() {
        if (world) {
            world.stopGame();
            world = null;
        }
        gameStarted = false;
    }

    restartUI() {
        document.getElementById('startScreen').style.display = 'none';
        canvas.style.display = 'block';
    }
}
