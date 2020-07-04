EnemyBullet = function (game, x, y) {
  Phaser.Sprite.call(this, game, x, y, "bullet");
  this.anchor.setTo(0.5);
  this.scale.setTo(1.0);
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
};

EnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
EnemyBullet.prototype.constructor = EnemyBullet;
