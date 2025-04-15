class GameOverScreen {
    constructor(canvas, ctx, imagePath) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.imagePath = imagePath;
        this.buttonX = canvas.width / 2 - 150;
        this.buttonY = canvas.height - 100;
        this.buttonWidth = 300;
        this.buttonHeight = 60;
        this.isHovering = false;
        this.listenersBound = false;
    }

    display() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

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

        this.bindListeners();
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
        this.ctx.fillStyle = this.isHovering ? 'rgba(200, 200, 200, 0.9)' : 'rgba(255, 255, 255, 0.9)';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.moveTo(this.buttonX + 10, this.buttonY);
        this.ctx.lineTo(this.buttonX + this.buttonWidth - 10, this.buttonY);
        this.ctx.quadraticCurveTo(this.buttonX + this.buttonWidth, this.buttonY, this.buttonX + this.buttonWidth, this.buttonY + 10);
        this.ctx.lineTo(this.buttonX + this.buttonWidth, this.buttonY + this.buttonHeight - 10);
        this.ctx.quadraticCurveTo(this.buttonX + this.buttonWidth, this.buttonY + this.buttonHeight, this.buttonX + this.buttonWidth - 10, this.buttonY + this.buttonHeight);
        this.ctx.lineTo(this.buttonX + 10, this.buttonY + this.buttonHeight);
        this.ctx.quadraticCurveTo(this.buttonX, this.buttonY + this.buttonHeight, this.buttonX, this.buttonY + this.buttonHeight - 10);
        this.ctx.lineTo(this.buttonX, this.buttonY + 10);
        this.ctx.quadraticCurveTo(this.buttonX, this.buttonY, this.buttonX + 10, this.buttonY);
        this.ctx.closePath();

        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = 'black';
        this.ctx.font = '22px "Permanent Marker"';
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
        const hovering =
            x > this.buttonX &&
            x < this.buttonX + this.buttonWidth &&
            y > this.buttonY &&
            y < this.buttonY + this.buttonHeight;

        if (hovering !== this.isHovering) {
            this.isHovering = hovering;
            this.drawButton();
        }

        this.canvas.style.cursor = hovering ? 'pointer' : 'default';
    }

    checkButtonClick(x, y) {
        if (
            x > this.buttonX &&
            x < this.buttonX + this.buttonWidth &&
            y > this.buttonY &&
            y < this.buttonY + this.buttonHeight
        ) {
            this.restartGame();
        }
    }

    restartGame() {
        this.removeListeners();

        if (world?.backgroundSound) {
            world.backgroundSound.pause();
            world.backgroundSound.currentTime = 0;
        }

        if (world) {
            world.stopGame();
            world = null;
        }

        gameStarted = false;
        document.getElementById('startScreen').style.display = 'none';
        canvas.style.display = 'block';
        startMainGame();
    }
}
