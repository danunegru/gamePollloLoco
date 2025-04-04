let canvas;
let world;
let keyboard = new Keyboard();
let isTouchActive = false;
let gameStarted = false;

function init() {
    canvas = document.getElementById('canvas');
    const startScreen = document.getElementById('startScreen');
    const startButton = document.getElementById('startButton');

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

        // Hintergrundmusik mit Error-Handling
        const backgroundSound = new Audio('audio/backgroundsound.wav');
        backgroundSound.loop = true;
        backgroundSound.volume = 0.5;
        backgroundSound.play().catch(e => {});

        // Hühnerbewegung starten
        startChickens();

        // Steuerungs-Events
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
    // Touch/Maus Events
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

    // Tastatur Events
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
    switch(e.key) {
        case 'ArrowRight': keyboard.RIGHT = isPressed; break;
        case 'ArrowLeft': keyboard.LEFT = isPressed; break;
        case 'ArrowUp': keyboard.UP = isPressed; break;
        case 'ArrowDown': keyboard.DOWN = isPressed; break;
        case ' ': keyboard.SPACE = isPressed; break;
        case 'd': case 'D': keyboard.D = isPressed; break;
    }
}

// Vollbild-Funktion
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen?.() ||
        canvas.webkitRequestFullscreen?.();
    } else {
        document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.();
    }
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    // Info-Overlay
    document.getElementById("infoButton").addEventListener("click", () => {
        document.getElementById("overlay").style.display = "block";
    });
    document.getElementById("overlay").addEventListener("click", function() {
        this.style.display = "none";
    });

    // Orientierungsprüfung
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