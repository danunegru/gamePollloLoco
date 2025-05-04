/**
 * GameHelper dient als Hilfsklasse zur Verwaltung allgemeiner Spiellogik,
 * wie z. B. das Erzeugen von Objekten, Tastenzurücksetzung und Button-Handling.
 */
class GameHelper {

    /**
     * Generiert eine Liste von zufällig positionierten Münzen (Coins).
     * @param {number} count - Anzahl der Münzen (Standard: 7)
     * @returns {Coin[]} Liste der erstellten Coin-Objekte
     */
    generateCoins(count = 7) {
        let coins = [];
        for (let i = 0; i < count; i++) {
            const x = Math.random() * 1000;
            const y = Math.random() * 300;
            coins.push(new Coin(x, y));
        }
        return coins;
    }

    /**
     * Generiert eine Liste von zufällig positionierten Flaschen (Bottles).
     * @param {number} count - Anzahl der Flaschen (Standard: 10)
     * @returns {Bottle[]} Liste der erstellten Bottle-Objekte
     */
    generateBottles(count = 10) {
        let bottles = [];
        for (let i = 0; i < count; i++) {
            const x = Math.random() * 900;
            const y = 330;
            bottles.push(new Bottle(x, y));
        }
        return bottles;
    }

    /**
     * Setzt alle Steuerungstasten im Keyboard-Objekt auf false.
     * @param {Object} keyboard - Das Tastatursteuerungsobjekt
     */
    resetKeyboard(keyboard) {
        keyboard.LEFT = false;
        keyboard.RIGHT = false;
        keyboard.UP = false;
        keyboard.SPACE = false;
        keyboard.D = false;
    }

    /**
     * Prüft, ob die Koordinaten (x, y) innerhalb eines gegebenen Buttons liegen.
     * @param {number} x - X-Koordinate
     * @param {number} y - Y-Koordinate
     * @param {Object} button - Button-Objekt mit x, y, width, height
     * @returns {boolean} true, wenn sich (x, y) im Buttonbereich befinden
     */
    isInsideButton(x, y, button) {
        return x > button.x && x < button.x + button.width &&
               y > button.y && y < button.y + button.height;
    }

    /**
     * Berechnet die Positionen der Touch-Buttons je nach Canvas-Größe.
     * @param {HTMLCanvasElement} canvas - Die Zeichenfläche des Spiels
     * @returns {Object} Objekt mit den Positionen der Buttons
     */
    updateButtonPositions(canvas) {
        const scaleFactor = canvas.width / 800;
        return {
            left: { x: 50 * scaleFactor, y: 400 * scaleFactor, width: 60 * scaleFactor, height: 60 * scaleFactor },
            up: { x: 150 * scaleFactor, y: 400 * scaleFactor, width: 60 * scaleFactor, height: 60 * scaleFactor },
            right: { x: 250 * scaleFactor, y: 400 * scaleFactor, width: 60 * scaleFactor, height: 60 * scaleFactor },
            throw: { x: 350 * scaleFactor, y: 400 * scaleFactor, width: 60 * scaleFactor, height: 60 * scaleFactor },
        };
    }

    checkThrowObjects(world) {
        if (world.keyboard.D && world.character.collectedBottles > 0 && ThrowableObject.canThrow()) {
            if (world.character.otherDirection) {
                world.throwBottleLeft();
            } else {
                world.throwBottleRight();
            }
        }
    }

    async checkGameOver(world) {
        if (world.character.isDead() && !world.character.isDeadState) {
            await world.character.die();
            world.stopGame();
            world.showGameOverScreen();
            return;
        }
    
        const endboss = world.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.energy <= 0 && !endboss.isDead) {
            await endboss.die();
            world.stopGame();
            world.showWinScreen();
        }
    }
    
    
}
