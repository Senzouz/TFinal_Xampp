Preload = function(){

}

Preload.prototype = {
    preload:function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //centrar el juego horizontalmente
        this.scale.pageAlignHorizontally = true;
        //centrar el juego verticalmente
        this.scale.pageAlignVertically = true;
        this.load.image("bullet", "assets/images/bullet.png");
        this.load.image("enemyParticle", "assets/images/enemyParticle.png");
        this.load.image("space", "assets/images/space.png");
        this.load.image("logo", "assets/images/logo.png");
        this.load.image("player", "assets/images/player.png");
        this.load.spritesheet("redEnemy","assets/images/red_enemy.png",50,46,3);
        this.load.spritesheet("greenEnemy","assets/images/green_enemy.png",50,46,3);
        this.load.spritesheet("yellowEnemy","assets/images/yellow_enemy.png",50,46,3);
        this.load.text("level1","assets/data/level1.json");
        this.load.text("level2","assets/data/level2.json");
        this.load.text("level3","assets/data/level3.json");
        this.load.audio("orchestra",["assets/audio/8bit-orchestra.mp3",
                        "assets/audio/8bit-orchestra.ogg"]);
    },
    create:function(){
        this.state.start("Menu");
    }
}