Game = function () {};

Game.prototype = {
  init: function (currentLevel, hp) {
    this.hp = hp;
    this.currentLevel = currentLevel.currentLevel || 1;
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

    this.player = new Player(this.game, this.hp, this.PLAYER_SPEED);
    this.player.createBullet.add(this.createPlayerBullet, this);

    this.initBullets();
    this.initEnemies();
    this.loadLevel();

    this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

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
  createPlayerBullet: function (x, y) {
    let bullet = this.playerBullets.getFirstDead();
    if (!bullet) {
      bullet = new PlayerBullet(this.game, x, y);
    } else {
      bullet.reset(x, y);
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
        if (this.currentLevel <= this.numLevels) {
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
          -this.BULLET_SPEED * ((this.player.x - x) / 750);
        bullet.body.velocity.y =
          -this.BULLET_SPEED * ((this.player.y - y) / 750);
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
    if (this.spaceBar.isDown && this.shooting_time >= this.SHOOTING_TIMER) {
      this.shooting_time = 0;
      this.player.shoot();
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
    this.game.input.onDown.add(this.toggle, this);
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
    this.player.hp--;
    console.log(this.player.hp);
    console.log(bullet.position);
    if (this.player.hp == 0) {
      this.orchestra.stop();
      this.game.state.start("GameOver", true, false, this.currentLevel);
    }
  },
  toggle: function () {
    this.showDebug = this.showDebug ? false : true;

    if (!this.showDebug) {
      this.game.debug.reset();
    }
  },
  render: function () {
    if (this.showDebug) {
      this.game.debug.body(this.player);
      this.enemyBullets.forEach(function (enemy) {
        this.game.debug.body(enemy);
      }, this);
    }
  },
};
