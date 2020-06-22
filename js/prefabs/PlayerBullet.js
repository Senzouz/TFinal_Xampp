PlayerBullet = function(game,x,y){
    Phaser.Sprite.call(this,game,x,y,'bullet');
    this.anchor.setTo(0.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    /*this.events.onOutOfBounds.add(function(){
        console.log("me mori :v");
    },this);*/
}

PlayerBullet.prototype = Object.create(Phaser.Sprite.prototype);
PlayerBullet.prototype.constructor = PlayerBullet;