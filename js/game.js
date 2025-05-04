let canvas;
let world;
let keyboard = new Keyboard();

let isTouchActive = false;
let gameStarted = false;
let backgroundSound;
let isMuted = localStorage.getItem('muted') === 'true';

/**
 * Initializes the game UI and start button.
 */
function init() {
    canvas = document.getElementById('canvas');
    const startButton = document.getElementById('startButton');
    initMuteButton();
    startButton.addEventListener('click', startGameHandler);
}

/**
 * Hides the start screen and starts the game.
 */
function startGameHandler() {
    document.getElementById('startScreen').style.display = 'none';
    canvas.style.display = 'block';
    startMainGame();
}

/**
 * Sets up the game world and starts logic.
 */
function startMainGame() {
    if (gameStarted) return;
    gameStarted = true;
    world = new World(canvas, keyboard);
    initBackgroundSound();
    startChickens();
    setupControlEvents();
    setGlobalMute(isMuted);
}

/**
 * Loads and plays background music in a loop.
 */
function initBackgroundSound() {
    world.backgroundSound = new Audio('audio/backgroundsound.wav');
    world.backgroundSound.loop = true;
    world.backgroundSound.volume = 0.5;
    world.backgroundSound.muted = isMuted;
    world.backgroundSound.play().catch(e => console.log("Audio play error:", e));
}

/**
 * Starts movement animations for all chickens.
 */
function startChickens() {
    if (!world?.level?.enemies) return;
    world.level.enemies.forEach(enemy => {
        if ((enemy instanceof Chicken || enemy instanceof SmallChicken) &&
            typeof enemy.startMoving === 'function') {
            enemy.startMoving();
        }
    });
}

/**
 * Sets up both touch and keyboard control events.
 */
function setupControlEvents() {
    setupTouchEvents();
    setupKeyboardEvents();
}

/**
 * Binds touch and mouse press/release events.
 */
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

/**
 * Binds keyboard press/release events.
 */
function setupKeyboardEvents() {
    window.addEventListener('keydown', e => {
        if (!isTouchActive) handleKeyboardPress(e, true);
    });
    window.addEventListener('keyup', e => {
        if (!isTouchActive) handleKeyboardPress(e, false);
    });
}

/**
 * Resets touch state after a short delay.
 */
function resetTouchAfterDelay() {
    setTimeout(() => isTouchActive = false, 500);
}

/**
 * Converts event to canvas-relative coordinates.
 * @param {Event} event - Touch or mouse event.
 * @returns {{x: number|null, y: number|null}}
 */
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

/**
 * Extracts raw x/y coordinates from event.
 * @param {Event} event
 * @param {DOMRect} rect
 * @returns {{x: number, y: number}}
 */
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

/**
 * Handles keyboard press and release for game controls.
 * @param {KeyboardEvent} e - The event.
 * @param {boolean} isPressed - Press state.
 */
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

/**
 * Toggles fullscreen mode for the canvas.
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen?.() || canvas.webkitRequestFullscreen?.();
    } else {
        document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    }
}

// Set up info overlay and orientation handling after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupInfoOverlay();
    setupOrientationListener();
});

/**
 * Sets up click events to show/hide the info overlay.
 */
function setupInfoOverlay() {
    document.getElementById("infoButton").addEventListener("click", () => {
        document.getElementById("overlay").style.display = "block";
    });
    document.getElementById("overlay").addEventListener("click", function () {
        this.style.display = "none";
    });
}

/**
 * Monitors and adjusts UI on device orientation changes.
 */
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

/**
 * Initializes the mute button and applies saved mute state.
 */
function initMuteButton() {
    const muteButton = document.getElementById('muteButton');
    const muteButtonImg = document.getElementById('muteButtonImg');
    muteButtonImg.src = isMuted ? "img/mute-button.png" : "img/muteButton.png";
    setGlobalMute(isMuted);
    muteButton.addEventListener('click', toggleMute);
}

/**
 * Toggles mute state and updates the icon + global audio.
 */
function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('muted', isMuted);
    const muteButtonImg = document.getElementById('muteButtonImg');
    muteButtonImg.src = isMuted ? "img/mute-button.png" : "img/muteButton.png";
    setGlobalMute(isMuted);
}

/**
 * Mutes/unmutes all game-related sounds.
 * @param {boolean} muted
 */
function setGlobalMute(muted) {
    muteWorldSounds(muted);
    muteCharacterSounds(muted);
    muteEnemySounds(muted);
    muteThrowableSounds(muted);
}

/**
 * Mutes/unmutes world/background sounds.
 * @param {boolean} muted
 */
function muteWorldSounds(muted) {
    if (world?.backgroundSound) {
        world.backgroundSound.muted = muted;
    }
}

/**
 * Mutes/unmutes character-related sounds.
 * @param {boolean} muted
 */
function muteCharacterSounds(muted) {
    if (world?.character) {
        world.character.walking_sound.muted = muted;
        world.character.jump_sound.muted = muted;
    }
}

/**
 * Mutes/unmutes enemy-related sounds.
 * @param {boolean} muted
 */
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

/**
 * Mutes/unmutes throwable object sounds.
 * @param {boolean} muted
 */
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
