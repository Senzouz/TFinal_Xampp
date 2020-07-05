Enemy = function (game, x, y, key, health) {
  Phaser.Sprite.call(this, game, x, y, key);
  this.anchor.setTo(0.5);
  this.game = game;
  this.health = health;

  this.shoot_factor =
    key == "greenEnemy" ? 2.5 : key == "yellowEnemy" ? 1 : 0.5;

  this.init_tp = this.game.add.audio("int_tp");
  this.init_tp.volume = 0.15;

  this.out_tp = this.game.add.audio("out_tp");
  this.out_tp.volume = 0.15;

  this.die = this.game.add.audio("enemy_die");
  this.die.volume = 0.25;

  this.setEntrance();

  this.animations.add("getHit", [0, 1, 2, 1, 0], 25, false);

  this.createBullet = new Phaser.Signal();
  this.enemyTimer = this.game.time.create(false);
  this.enemyTimer.start();
  this.scheduleShooting();

  this.goUpdate = true;
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
  if (!this.goUpdate) return;
  if (this.x < this.width) {
    this.x = this.width + 10;
    this.body.velocity.x *= -1;
  } else if (this.x > this.game.width - this.width) {
    this.x = this.game.width - this.width - 10;
    this.body.velocity.x *= -1;
  }
  if (this.y > this.game.height - this.height) {
    this.out_move = this.game.add
      .tween(this)
      .to({ y: this.game.height + this.height }, 100);
    this.out_move.start();
    this.out_move.onComplete.add(this.setDead, this);
  }
};

Enemy.prototype.damage = function (amount) {
  Phaser.Sprite.prototype.damage.call(this, amount);
  this.play("getHit");
  if (this.health <= 0) {
    this.die.play();
    let emitter = this.game.add.emitter(this.x, this.y, 100);
    emitter.makeParticles("enemyParticle");
    emitter.minParticleSpeed.setTo(-200, -200);
    emitter.maxParticleSpeed.setTo(200, 200);
    emitter.gravity = 0;
    emitter.start(true, 500, null, 100);
    this.enemyTimer.pause(this.setDead, this);
  }
};
Enemy.prototype.reset = function (x, y, scale, key, health, speedX, speedY) {
  Phaser.Sprite.prototype.reset.call(this, x, y, health);

  this.setEntrance();

  this.goUpdate = true;

  this.loadTexture(key);
  this.scale.setTo(scale / 2);
  this.body.velocity.x = speedX;
  this.body.velocity.y = speedY;
  this.enemyTimer.resume();
};

Enemy.prototype.scheduleShooting = function () {
  this.shoot();
  this.enemyTimer.add(
    Phaser.Timer.SECOND * this.shoot_factor,
    this.scheduleShooting,
    this
  );
};

Enemy.prototype.shoot = function () {
  if (
    this.x > 0 &&
    this.x < this.game.width &&
    this.y > 0 &&
    this.y < this.game.height &&
    this.goUpdate
  ) {
    this.createBullet.dispatch(this.x, this.y, this.key);
  }
};

Enemy.prototype.setEntrance = function () {
  this.y = -this.height;
  this.init_move = this.game.add.tween(this).to({ y: this.height * 0.75 }, 100);
  this.init_move.start();
  this.init_move.onComplete.add(function () {
    this.init_tp.play();
  }, this);
};

Enemy.prototype.setDead = function () {
  if (this.goUpdate) {
    this.out_tp.play();
  }
  this.goUpdate = false;
  this.kill();
};
