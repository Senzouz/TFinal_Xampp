PlayerBullet = function (game, x, y) {
  Phaser.Sprite.call(this, game, x, y, "burbuja");
  this.anchor.setTo(0.5);
  this.scale.setTo(0.035);
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
};

PlayerBullet.prototype = Object.create(Phaser.Sprite.prototype);
PlayerBullet.prototype.constructor = PlayerBullet;
