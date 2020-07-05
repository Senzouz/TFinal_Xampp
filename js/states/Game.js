Game = function () {};

Game.prototype = {
  init: function (currentLevel, hp) {
    this.hp = hp || 3;
    this.currentLevel = currentLevel || 1;
    this.numLevels = 3;
    this.PLAYER_SPEED = 200;
    this.BULLET_SPEED = -200;

    this.shooting_time = 0;
    this.SHOOTING_TIMER = 120;
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

    this.es_sfx = this.game.add.audio("enemy_shoot");
    this.es_sfx.volume = 0.5;

    this.ps_sfx = this.game.add.audio("player_shoot");
    this.ps_sfx.volume = 0.1;

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

    this.hpText = this.game.add.text(
      this.game.world.width * 0.9,
      this.game.world.height * 0.05,
      "HP :" + this.player.hp
    );
    this.hpText.fill = "#FFFFFF";

    this.timeText = this.game.add.text(
      this.game.world.centerX,
      this.game.world.height * 0.05,
      "0:00" + this.player.hp
    );
    this.timeText.fill = "#FFFFFF";

    this.level_ended = false;

    /*this.shootingTimer = this.game.time.events.loop(
      Phaser.Timer.SECONDS / 5,
      this.createPlayerBullet,
      this
    );*/
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
      this.playerBullets.add(bullet);
    } else {
      bullet.reset(x, y);
    }
    this.ps_sfx.play();
    bullet.body.velocity.y = this.BULLET_SPEED;
  },
  loadLevel: function () {
    this.currentIndexEnemy = 0;
    this.levelData = JSON.parse(
      this.game.cache.getText("level" + this.currentLevel)
    );
    this.level_time = this.levelData.duration * 1000;
    this.endOfLevelTimer = this.game.time.events.add(
      this.levelData.duration * 1000,
      function () {
        this.currentLevel++;
        if (this.currentLevel <= this.numLevels) {
          this.game.state.start(
            "Game",
            true,
            false,
            this.currentLevel,
            this.player.hp
          );
        } else {
          this.orchestra.stop();
          this.game.state.start("GameOver", true, false, this.currentLevel);
        }
      },
      this
    );
    console.log(this.levelData.enemies.length);
    this.scheduleNextEnemy();
  },
  scheduleNextEnemy: function () {
    let nextEnemy = this.levelData.enemies[this.currentIndexEnemy];
    //    console.log(nextEnemy);

    if (nextEnemy) {
      let nextTime =
        500 *
        (nextEnemy.time -
          (this.currentIndexEnemy == 0
            ? 1
            : this.levelData.enemies[this.currentIndexEnemy - 1].time));
      //console.log(this.levelData.enemies[this.currentIndexEnemy].time);
      this.nextEnemyTimer = this.game.time.events.add(
        nextTime,
        function () {
          this.createEnemy(
            nextEnemy.x * this.game.world.width,
            -100,
            nextEnemy.health,
            nextEnemy.key,
            nextEnemy.scale,
            nextEnemy.speedX,
            nextEnemy.speedY
          );
          this.currentIndexEnemy++;
          this.scheduleNextEnemy();
        },
        this
      );
    }
  },
  createEnemy: function (x, y, health, key, scale, speedX, speedY) {
    let enemy = this.enemies.getFirstDead();
    if (!enemy) {
      enemy = new Enemy(this.game, x, y, key, health);
      this.enemies.add(enemy);
    }
    enemy.createBullet.add(this.createBulletEnemy, this);
    enemy.reset(x, y, scale, key, health, speedX, speedY);

    /*let types = ["greenEnemy", "yellowEnemy", "redEnemy"];
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
    enemy.reset(RandX, Yini, 3, types[key], 3, RandVeloX, RandVeloY);*/
  },
  createBulletEnemy: function (x, y,key) {
    /*let bullet = this.enemyBullets.getFirstDead();
    if (!bullet) {
      bullet = new EnemyBullet(this.game, x, y);
      this.enemyBullets.add(bullet);
    } else {
      bullet.reset(x, y);
    }
    bullet.body.velocity.y = -this.BULLET_SPEED;*/
    if (key != "greenEnemy") {
      let bullet = this.enemyBullets.getFirstDead();
      if (!bullet) {
        bullet = new EnemyBullet(this.game, x, y);
        this.enemyBullets.add(bullet);
      } else {
        bullet.reset(x, y);
      }
      this.es_sfx.play();
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
    this.level_time -= this.game.time.elapsed;

    if (this.level_time > 0) {
      this.timeText.text = (this.level_time / 1000).toFixed(2);
    } else {
      this.timeText.text = "0.00";
    }
    if (!this.level_ended && this.level_time < 5.5 * 1000) {
      this.level_ended = true;
      this.end_level = this.game.add.audio("end_level");
      this.end_level.volume = 0.4;
      this.end_level.play();
      this.player.endGame();
    }
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
    console.log(player.position);
    console.log(bullet.position);
    bullet.kill();
    this.player.hp--;
    this.hpText.text = "HP :" + this.player.hp;
    if (this.player.hp == 0) {
      this.die_player = this.game.add.audio("player_die");
      this.die_player.volume = 0.5;
      this.die_player.play();
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
