let canvas;
let world;
let keyboard = new Keyboard();
let isTouchActive = false;
let gameStarted = false;
let backgroundSound;
let isMuted = false;

function init() {
    canvas = document.getElementById('canvas');
    const startScreen = document.getElementById('startScreen');
    const startButton = document.getElementById('startButton');
    initMuteButton(); // Vor dem Spielstart initialisieren

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        canvas.style.display = 'block';
        startMainGame();
    });
}


function startMainGame() {
    if (!gameStarted) {
        gameStarted = true;
        world = new World(canvas, keyboard);

        // Sound initialisieren und an world übergeben
        world.backgroundSound = new Audio('audio/backgroundsound.wav');
        world.backgroundSound.loop = true;
        world.backgroundSound.volume = 0.5;
        world.backgroundSound.muted = isMuted; // Initialen Status setzen

        world.backgroundSound.play().catch(e => console.log("Audio play error:", e));
        startChickens();
        setupControlEvents();
    }
}

function startChickens() {
    if (world?.level?.enemies) {
        world.level.enemies.forEach(enemy => {
            if ((enemy instanceof Chicken || enemy instanceof SmallChicken) &&
                typeof enemy.startMoving === 'function') {
                enemy.startMoving();
            }
        });
    }
}

function setupControlEvents() {
    ['mousedown', 'touchstart'].forEach(evt => {
        canvas.addEventListener(evt, (e) => {
            isTouchActive = true;
            world.handleCanvasPress(e, true);
        });
    });

    ['mouseup', 'touchend'].forEach(evt => {
        canvas.addEventListener(evt, (e) => {
            world.handleCanvasPress(e, false);
            resetTouchAfterDelay();
        });
    });
    window.addEventListener('keydown', (e) => {
        if (!isTouchActive) handleKeyboardPress(e, true);
    });
    window.addEventListener('keyup', (e) => {
        if (!isTouchActive) handleKeyboardPress(e, false);
    });
}

function resetTouchAfterDelay() {
    setTimeout(() => isTouchActive = false, 500);
}

function getTouchPosition(event) {
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (event.touches?.[0]) {
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
    } else if (event.changedTouches?.[0]) {
        x = event.changedTouches[0].clientX - rect.left;
        y = event.changedTouches[0].clientY - rect.top;
    } else if (event.clientX) {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    }

    if (x !== undefined && y !== undefined) {
        x = (x / rect.width) * canvas.width;
        y = (y / rect.height) * canvas.height;
        return { x, y };
    }
    return { x: null, y: null };
}

function handleKeyboardPress(e, isPressed) {
    switch (e.key) {
        case 'ArrowRight': keyboard.RIGHT = isPressed; break;
        case 'ArrowLeft': keyboard.LEFT = isPressed; break;
        case 'ArrowUp': keyboard.UP = isPressed; break;
        case 'ArrowDown': keyboard.DOWN = isPressed; break;
        case ' ': keyboard.SPACE = isPressed; break;
        case 'd': case 'D': keyboard.D = isPressed; break;
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen?.() ||
            canvas.webkitRequestFullscreen?.();
    } else {
        document.exitFullscreen?.() ||
            document.webkitExitFullscreen?.();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("infoButton").addEventListener("click", () => {
        document.getElementById("overlay").style.display = "block";
    });
    document.getElementById("overlay").addEventListener("click", function () {
        this.style.display = "none";
    });
    const checkOrientation = () => {
        const message = document.getElementById('orientationMessage');
        const showMessage = window.innerWidth < 630 &&
            window.matchMedia("(orientation: portrait)").matches;
        message.style.display = showMessage ? 'block' : 'none';
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
});

function initMuteButton() {
    const muteButton = document.getElementById('muteButton');
    muteButton.addEventListener('click', toggleMute);
} 
function toggleMute() {
    isMuted = !isMuted;

    // Button-Bild aktualisieren
    const muteButtonImg = document.getElementById('muteButtonImg');
    muteButtonImg.src = isMuted ? "img/mute-button.png" : "img/muteButton.png";

    // Sound stumm schalten
    if (world && world.backgroundSound) {
        world.backgroundSound.muted = isMuted;
    }

}