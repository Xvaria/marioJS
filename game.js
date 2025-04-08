/* global Phaser */

import { createAnimations } from "./animations.js";

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 244,
  backgroundColor: "#049cd8",
  parent: "game",
  physics: { default: "arcade", arcade: { gravity: { y: 300 }, debug: true } },
  lifes: 3,
  scene: {
    preload, // se ejecuta para precargar recursos
    create, // se ejecuta cuando el juego comienza
    update, // se ejecuta en cada frame
  },
};

new Phaser.Game(config);
// this -> game -> juego en construccion

function preload() {
  this.load.image("cloud1", "assets/scenery/overworld/cloud1.png");

  this.load.image("floorBricks", "assets/scenery/overworld/floorbricks.png");

  this.load.spritesheet("mario", "assets/entities/mario.png", {
    frameWidth: 18,
    frameHeight: 16,
  });

  this.load.audio("gameOver", "assets/sound/music/gameover.mp3");
  this.load.audio("dayLevel", "assets/sound/music/overworld/theme.mp3");
  this.load.audio("marioJump", "assets/sound/effects/jump.mp3");
} // 1.

function create() {
  // image (x, y, id-del-asset)
  this.add.image(100, 50, "cloud1").setOrigin(0, 0).setScale(0.15);

  this.floor = this.physics.add.staticGroup();

  this.floor
    .create(0, config.height, "floorBricks")
    .setOrigin(0, 1)
    .refreshBody();

  this.floor
    .create(170, config.height, "floorBricks")
    .setOrigin(0, 1)
    .refreshBody();

  // this.mario = this.add.sprite(10, 212, "mario").setOrigin(0, 1);

  this.mario = this.physics.add
    .sprite(50, 100, "mario")
    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setGravityY(300);

  this.physics.add.collider(this.mario, this.floor);
  this.physics.world.setBounds(0, 0, 2000, config.height);

  this.cameras.main.setBounds(0, 0, 2000, config.height);
  this.cameras.main.startFollow(this.mario);

  this.dayLevel = this.sound.add("dayLevel", { volume: 0.2 });
  this.gameOver = this.sound.add("gameOver", { volume: 0.2 });
  this.marioJump = this.sound.add("marioJump", { volume: 0.1 });

  this.dayLevel.play();

  this.keys = this.input.keyboard.createCursorKeys();

  createAnimations(this);
} // 2.

function update() {
  if (!this.mario.isDead) {
  } else {
    return;
  }

  if (this.keys.left.isDown) {
    this.mario.x -= 1;
    this.mario.anims.play("marioWalk", true);
    this.mario.flipX = true;
  } else if (this.keys.right.isDown) {
    this.mario.x += 1;
    this.mario.anims.play("marioWalk", true);
    this.mario.flipX = false;
  } else {
    this.mario.anims.play("marioIdle", true);
  }

  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.setVelocityY(-300);
    this.mario.anims.play("marioJump", true);
    this.marioJump.play();
  }

  if (this.mario.y >= config.height) {
    this.mario.isDead = true;
    this.mario.anims.play("marioDead");
    this.mario.setCollideWorldBounds(false);
    this.dayLevel.stop();
    this.gameOver.play();
    this.mario.lifes -= 1;

    setTimeout(() => {
      this.mario.setVelocityY(-350);
    }, 100);

    if (this.lifes !== 0) {
      setTimeout(() => {
        this.gameOver.stop();
        this.scene.restart();
      }, 3000);
    } else {
      setTimeout(() => {
        this.gameOver.stop();
        this.lifes = 3;
        this.scene.restart();
      }, 5000);
    }
  }
} // 3. continuamente
