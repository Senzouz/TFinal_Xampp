Game = function () {};

Game.prototype = {
  init: function (currentLevel, hp) {
    this.currentLevel = currentLevel.currentLevel || 1;
    this.playerHP = hp == 3 ? hp : hp + 1;
    this.numLevels = 3;
    this.PLAYER_SPEED = 200;
    this.BULLET_SPEED = -200;
    this.shooting_time = 0;
    this.SHOOTING_TIMER = 200;
    this.ENEMY_SPAWN_TIMER = 1000 / this.currentLevel;
    this.enemy_spawn_time = 0;
  },
  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.background = this.game.add.tileSprite(
      0,
      0,
      this.game.world.width,
      this.game.world.height,
      "space"
    );
    this.background.autoScroll(0, 30);
    this.orchestra = this.game.add.audio("orchestra");
    //this.orchestra.play();

    this.player = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.height - 50,
      "player"
    );
    this.game.physics.arcade.enable(this.player);
    this.player.anchor.setTo(0.5);
    this.player.body.collideWorldBounds = true;
    this.initBullets();
    this.initEnemies();
    this.loadLevel();
    this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.keys = this.input.keyboard.createCursorKeys();
    this.AKey = this.input.keyboard.addKey(Phaser.Keyboard.A);
    this.DKey = this.input.keyboard.addKey(Phaser.Keyboard.D);
    this.WKey = this.input.keyboard.addKey(Phaser.Keyboard.W);
    this.SKey = this.input.keyboard.addKey(Phaser.Keyboard.S);

    this.score = 0;
    this.scoreText = this.game.add.text(
      this.game.world.width * 0.05,
      this.game.world.height * 0.05,
      "Score :" + this.score
    );
    this.scoreText.fill = "#FFFFFF";
  },
  initEnemies: function () {
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;

    this.enemyBullets = this.game.add.group();
    this.enemyBullets.enableBody = true;
  },
  initBullets: function () {
    this.playerBullets = this.game.add.group();
    this.playerBullets.enableBody = true;
  },
  createPlayerBullet: function () {
    let bullet = this.playerBullets.getFirstDead();
    if (!bullet) {
      bullet = new PlayerBullet(this.game, this.player.x, this.player.y);
    } else {
      bullet.reset(this.player.x, this.player.y);
    }
    this.playerBullets.add(bullet);
    bullet.body.velocity.y = this.BULLET_SPEED;
  },
  loadLevel: function () {
    this.endOfLevelTimer = this.game.time.events.add(
      this.currentLevel * 60 * 1000,
      function () {
        this.orchestra.stop();
        this.currentLevel++;
        if (this.currentLevel > this.numLevels) {
          this.game.state.start(
            "Game",
            true,
            false,
            this.currentLevel,
            this.playerHP
          );
        } else {
          this.game.state.start("GameOver", true, false, this.currentLevel);
        }
      },
      this
    );
  },
  createEnemy: function () {
    let types = ["greenEnemy", "yellowEnemy", "redEnemy"];
    let key = this.game.rnd.integerInRange(0, 2);
    let RandX = this.game.rnd.realInRange(
      0.05 * this.game.world.width,
      0.95 * this.game.world.width
    );
    let Yini = -100;

    let RandVeloX = this.game.rnd.realInRange(-120, 120);
    let RandVeloY = this.game.rnd.integerInRange(40, 100);

    let enemy = this.enemies.getFirstDead();
    if (!enemy) {
      enemy = new Enemy(this.game, RandX, Yini, types[key], 3);
      this.enemies.add(enemy);
    }
    enemy.createBullet.add(this.createBulletEnemy, this);
    enemy.reset(RandX, Yini, 3, types[key], 3, RandVeloX, RandVeloY);
  },
  createBulletEnemy: function (x, y, key) {
    if (key != "greenEnemy") {
      let bullet = this.enemyBullets.getFirstDead();
      if (!bullet) {
        bullet = new EnemyBullet(this.game, x, y);
      } else {
        bullet.reset(this.game, x, y);
      }
      this.enemyBullets.add(bullet);
      if (key == "yellowEnemy") bullet.body.velocity.y = -this.BULLET_SPEED;
      if (key == "redEnemy") {
        bullet.body.velocity.x =
          -this.BULLET_SPEED * ((this.player.x - x) / 500);
        bullet.body.velocity.y =
          -this.BULLET_SPEED * ((this.player.y - y) / 500);
      }
    }
  },
  update: function () {
    this.enemy_spawn_time += this.game.time.elapsed;
    if (this.enemy_spawn_time >= this.ENEMY_SPAWN_TIMER) {
      this.createEnemy();
      this.enemy_spawn_time = 0;
    }

    this.shooting_time += this.game.time.elapsed;
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
    if (this.game.input.activePointer.isDown) {
      let targetX = this.game.input.activePointer.position.x;
      let directionX = targetX >= this.player.x ? 1 : -1;
      this.player.body.velocity.x = directionX * this.PLAYER_SPEED;

      let targetY = this.game.input.activePointer.position.y;
      let directionY = targetY >= this.player.y ? 1 : -1;
      this.player.body.velocity.y = directionY * this.PLAYER_SPEED;
    }
    if (this.spaceBar.isDown && this.shooting_time >= this.SHOOTING_TIMER) {
      this.shooting_time = 0;
      this.createPlayerBullet();
    }
    if (this.keys.left.isDown || this.AKey.isDown) {
      this.player.body.velocity.x = -300;
    }
    if (this.keys.right.isDown || this.DKey.isDown) {
      this.player.body.velocity.x = 300;
    }
    if (this.keys.down.isDown || this.SKey.isDown) {
      this.player.body.velocity.y = 300;
    }
    if (this.keys.up.isDown || this.WKey.isDown) {
      this.player.body.velocity.y = -300;
    }
    this.game.physics.arcade.overlap(
      this.playerBullets,
      this.enemies,
      this.damageEnemy,
      null,
      this
    );
    this.game.physics.arcade.overlap(
      this.player,
      this.enemyBullets,
      this.damagePlayer,
      null,
      this
    );
  },
  isClose: function (actual, target) {
    return Math.abs(actual - target) < 0.1;
  },
  damageEnemy: function (bullet, enemy) {
    enemy.damage(1);
    bullet.kill();
    this.score += 5;
    this.scoreText.text = "Score :" + this.score;
  },
  damagePlayer: function (player, bullet) {
    bullet.kill();
    //player.damage(1)
    this.playerHP--;
    console.log(this.playerHP);
    if (this.playerHP == 0) {
      this.orchestra.stop();
      this.game.state.start("GameOver", true, false, this.currentLevel);
    }
  },
};
