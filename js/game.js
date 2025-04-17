let canvas;
let world;
let keyboard = new Keyboard();
let isTouchActive = false;
let gameStarted = false;
let backgroundSound;
let isMuted = localStorage.getItem('muted') === 'true';

function init() {
    canvas = document.getElementById('canvas');
    const startScreen = document.getElementById('startScreen');
    const startButton = document.getElementById('startButton');
    initMuteButton();
    startButton.addEventListener('click', startGameHandler);
}

function startGameHandler() {
    document.getElementById('startScreen').style.display = 'none';
    canvas.style.display = 'block';
    startMainGame();
}

function startMainGame() {
    if (gameStarted) return;

    gameStarted = true;
    world = new World(canvas, keyboard);
    initBackgroundSound();
    startChickens();
    setupControlEvents();
    setGlobalMute(isMuted);
}

function initBackgroundSound() {
    world.backgroundSound = new Audio('audio/backgroundsound.wav');
    world.backgroundSound.loop = true;
    world.backgroundSound.volume = 0.5;
    world.backgroundSound.muted = isMuted;
    world.backgroundSound.play().catch(e => console.log("Audio play error:", e));
}

function startChickens() {
    if (!world?.level?.enemies) return;

    world.level.enemies.forEach(enemy => {
        if ((enemy instanceof Chicken || enemy instanceof SmallChicken) &&
            typeof enemy.startMoving === 'function') {
            enemy.startMoving();
        }
    });
}

function setupControlEvents() {
    setupTouchEvents();
    setupKeyboardEvents();
}

function setupTouchEvents() {
    ['mousedown', 'touchstart'].forEach(evt => {
        canvas.addEventListener(evt, e => {
            isTouchActive = true;
            world.handleCanvasPress(e, true);
        });
    });

    ['mouseup', 'touchend'].forEach(evt => {
        canvas.addEventListener(evt, e => {
            world.handleCanvasPress(e, false);
            resetTouchAfterDelay();
        });
    });
}

function setupKeyboardEvents() {
    window.addEventListener('keydown', e => {
        if (!isTouchActive) handleKeyboardPress(e, true);
    });

    window.addEventListener('keyup', e => {
        if (!isTouchActive) handleKeyboardPress(e, false);
    });
}

function resetTouchAfterDelay() {
    setTimeout(() => isTouchActive = false, 500);
}

function getTouchPosition(event) {
    const rect = canvas.getBoundingClientRect();
    let { x, y } = getRawTouchCoordinates(event, rect);

    if (x !== undefined && y !== undefined) {
        x = (x / rect.width) * canvas.width;
        y = (y / rect.height) * canvas.height;
        return { x, y };
    }

    return { x: null, y: null };
}

function getRawTouchCoordinates(event, rect) {
    if (event.touches?.[0]) {
        return {
            x: event.touches[0].clientX - rect.left,
            y: event.touches[0].clientY - rect.top
        };
    } else if (event.changedTouches?.[0]) {
        return {
            x: event.changedTouches[0].clientX - rect.left,
            y: event.changedTouches[0].clientY - rect.top
        };
    } else if (event.clientX) {
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
    return {};
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
        canvas.requestFullscreen?.() || canvas.webkitRequestFullscreen?.();
    } else {
        document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupInfoOverlay();
    setupOrientationListener();
});

function setupInfoOverlay() {
    document.getElementById("infoButton").addEventListener("click", () => {
        document.getElementById("overlay").style.display = "block";
    });

    document.getElementById("overlay").addEventListener("click", function () {
        this.style.display = "none";
    });
}

function setupOrientationListener() {
    const checkOrientation = () => {
        const message = document.getElementById('orientationMessage');
        const isPortrait = window.innerWidth < 630 &&
            window.matchMedia("(orientation: portrait)").matches;
        message.style.display = isPortrait ? 'block' : 'none';
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
}

function initMuteButton() {
    const muteButton = document.getElementById('muteButton');
    const muteButtonImg = document.getElementById('muteButtonImg');

    muteButtonImg.src = isMuted ? "img/mute-button.png" : "img/muteButton.png";
    setGlobalMute(isMuted);
    muteButton.addEventListener('click', toggleMute);
}

function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('muted', isMuted);

    const muteButtonImg = document.getElementById('muteButtonImg');
    muteButtonImg.src = isMuted ? "img/mute-button.png" : "img/muteButton.png";

    setGlobalMute(isMuted);
}

function setGlobalMute(muted) {
    muteWorldSounds(muted);
    muteCharacterSounds(muted);
    muteEnemySounds(muted);
    muteThrowableSounds(muted);
}

function muteWorldSounds(muted) {
    if (world?.backgroundSound) {
        world.backgroundSound.muted = muted;
    }
}

function muteCharacterSounds(muted) {
    if (world?.character) {
        world.character.walking_sound.muted = muted;
        world.character.jump_sound.muted = muted;
    }
}

function muteEnemySounds(muted) {
    if (world?.level?.enemies) {
        world.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                enemy.screamAudio.muted = muted;
                enemy.indianScreamAudio.muted = muted;
            }
        });
    }
}

function muteThrowableSounds(muted) {
    if (ThrowableObject?.globalSplashSound) {
        ThrowableObject.globalSplashSound.muted = muted;
    }

    if (world?.throwableObjects?.length) {
        world.throwableObjects.forEach(obj => {
            if (obj instanceof ThrowableObject && obj.splashSound) {
                obj.splashSound.muted = muted;
            }
        });
    }
}
