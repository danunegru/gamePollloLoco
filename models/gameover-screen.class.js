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

        this.canvas.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        this.canvas.addEventListener('click', (event) => this.handleClick(event));
        this.canvas.addEventListener('touchstart', (event) => this.handleTouch(event));
        this.canvas.addEventListener('touchmove', (event) => this.handleTouchMove(event));
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
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        this.updateHoverState(x, y);
    }

    handleTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        this.updateHoverState(x, y);
    }

    updateHoverState(x, y) {
        const isHoveringNow =
            x > this.buttonX &&
            x < this.buttonX + this.buttonWidth &&
            y > this.buttonY &&
            y < this.buttonY + this.buttonHeight;

        if (isHoveringNow !== this.isHovering) {
            this.isHovering = isHoveringNow;
            this.drawButton();
        }

        this.canvas.style.cursor = this.isHovering ? 'pointer' : 'default';
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        this.checkButtonClick(x, y);
    }

    handleTouch(event) {
        const touch = event.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        this.checkButtonClick(x, y);
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
        location.reload();
    }
}