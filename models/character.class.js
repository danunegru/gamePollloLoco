class Character extends MovableObject {
    static walking_sound = new Audio('audio/run.mp3');
    static jump_sound = new Audio('audio/222571__coby12388__minijump.wav');

    walking_sound = Character.walking_sound;
    jump_sound = Character.jump_sound;

    collectedBottles = 0;
    maxBottles = 4;
    height = 280;
    y = 100;
    speed = 5;
    justBounced = false;

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
    ];
    
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',
    ];
    
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];
    
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ];
    
    STAY_NORMAL = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];
    
    STAY_LONG = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];
    
    currentImage = 0;
    isDeadState = false;
    idleTimer = 0;
    world;

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.STAY_NORMAL);
        this.loadImages(this.STAY_LONG);
        this.applyGravity();
        this.animate();
        this.jump_sound.load();
    }

    canCollectBottle() {
        return this.collectedBottles < this.maxBottles;
    }

    addBottle() {
        if (this.canCollectBottle()) {
            this.collectedBottles++;
            return true;
        }
        return false;
    }

    animate() {
        setInterval(() => {
            if (!this.isDeadState) {
                this.walking_sound.pause();
                if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                    this.moveRight();
                    this.otherDirection = false;
                    this.walking_sound.play();
                    this.idleTimer = 0;
                }

                if (this.world.keyboard.LEFT && this.x > 0) {
                    this.moveLeft();
                    this.walking_sound.play();
                    this.otherDirection = true;
                    this.idleTimer = 0;
                }

                if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                    this.jump();
                    this.idleTimer = 0;
                }

                this.world.camera_x = -this.x + 100;
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.die();
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                    this.idleTimer = 0;
                }
            }
        }, 50);

        setInterval(() => {
            if (!this.isDeadState && !this.isHurt() && !this.isAboveGround() && !(this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
                this.idleTimer += 200;
                if (this.idleTimer < 5000) {
                    this.playAnimation(this.STAY_NORMAL);
                } else {
                    this.playAnimation(this.STAY_LONG);
                }
            }
        }, 200);
    }

    isDead() {
        return this.energy <= 0;
    }

    die() {
        return new Promise((resolve) => {
            if (!this.isDeadState) {
                this.isDeadState = true;
                let index = 0;
                const dieInterval = setInterval(() => {
                    if (index < this.IMAGES_DEAD.length) {
                        this.img = this.imageCache[this.IMAGES_DEAD[index]];
                        index++;
                    } else {
                        clearInterval(dieInterval);
                        resolve();
                    }
                }, 200);
                setTimeout(() => clearInterval(dieInterval), 2000);
            }
        });
    }

    jump() {
        if (!this.isAboveGround()) {
            this.speedY = 25;
            this.jump_sound.currentTime = 0;
            this.jump_sound.play().catch(() => {});
        }
    }
}
