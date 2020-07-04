Player = function (game, hp, speed) {
  Phaser.Sprite.call(this, game, 0, 0, "player");
  this.anchor.setTo(0.5);
  this.game = game;
  this.hp = hp > 3 ? hp : hp + 1;

  this.x = this.game.world.centerX;
  this.y = this.game.height + this.height;
  this.init_move = this.game.add
    .tween(this)
    .to({ y: this.game.height - this.height }, 100);
  this.init_move.start();

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
};

//Igual al prototype de Phazer dando todas sus propiedades
Player.prototype = Object.create(Phaser.Sprite.prototype);
//Inicialziacion del objeto recibe la función Player - sobrescribe el constructor default por este de Player
Player.prototype.constructor = Player;

Player.prototype.update = function () {
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
