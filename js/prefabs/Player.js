Player = function (game, hp, speed) {
  Phaser.Sprite.call(this, game, 0, 0, "player");
  this.anchor.setTo(0.5);
  this.game = game;
  this.hp = hp > 2 ? hp : hp + 1;

  this.x = this.game.world.centerX;
  this.y = this.game.height + this.height;
  this.init_move = this.game.add
    .tween(this)
    .to({ y: this.game.world.centerY + this.height }, 500);
  this.init_move.start();

  this.init_tp = this.game.add.audio("int_tp");
  this.init_tp.volume = 0.15;
  this.init_tp.play();

  this.PLAYER_SPEED = speed;

  this.game.add.existing(this);

  this.game.physics.arcade.enable(this);
  this.anchor.setTo(0.5);
  this.body.collideWorldBounds = true;

  this.createBullet = new Phaser.Signal();

  this.keys = this.game.input.keyboard.createCursorKeys();
  this.AKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.DKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.WKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.SKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

  this.player_cant_act = false;
};

//Igual al prototype de Phazer dando todas sus propiedades
Player.prototype = Object.create(Phaser.Sprite.prototype);
//Inicialziacion del objeto recibe la función Player - sobrescribe el constructor default por este de Player
Player.prototype.constructor = Player;

Player.prototype.update = function () {
  if (this.player_cant_act) return;

  this.body.velocity.x = 0;
  this.body.velocity.y = 0;
  if (this.game.input.activePointer.isDown) {
    let targetX = this.game.input.activePointer.position.x;
    let directionX = targetX >= this.x ? 1 : -1;
    this.body.velocity.x = directionX * this.PLAYER_SPEED;

    let targetY = this.game.input.activePointer.position.y;
    let directionY = targetY >= this.y ? 1 : -1;
    this.body.velocity.y = directionY * this.PLAYER_SPEED;
  }
  if (this.keys.left.isDown || this.AKey.isDown) {
    this.body.velocity.x = -300;
  }
  if (this.keys.right.isDown || this.DKey.isDown) {
    this.body.velocity.x = 300;
  }
  if (this.keys.down.isDown || this.SKey.isDown) {
    this.body.velocity.y = 300;
  }
  if (this.keys.up.isDown || this.WKey.isDown) {
    this.body.velocity.y = -300;
  }
};

Player.prototype.shoot = function () {
  this.createBullet.dispatch(this.x, this.y);
};

Player.prototype.endGame = function () {
  this.body.collideWorldBounds = false;
  this.player_cant_act = true;
  this.out_prepare = this.game.add
    .tween(this)
    .to({ x: this.game.world.centerX, y: this.game.width * 0.75 }, 5250);
  this.out_prepare.start();
  this.out_prepare.onComplete.add(function () {
    this.out_level = this.out_prepare = this.game.add
      .tween(this)
      .to({ y: -this.height }, 200);
    this.out_level.start();
  }, this);
};
