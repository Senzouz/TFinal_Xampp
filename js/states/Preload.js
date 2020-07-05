Preload = function () {};

Preload.prototype = {
  preload: function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //centrar el juego horizontalmente
    this.scale.pageAlignHorizontally = true;
    //centrar el juego verticalmente
    this.scale.pageAlignVertically = true;
    this.load.image("burbuja", "assets/images/burbuja.png");
    this.load.image("bullet", "assets/images/bullet.png");
    this.load.image("enemyParticle", "assets/images/enemyParticle.png");
    this.load.image("space", "assets/images/space.png");
    this.load.image("logo", "assets/images/logo.png");
    this.load.image("player", "assets/images/player.png");
    this.load.spritesheet("redEnemy", "assets/images/red_enemy.png", 52, 48, 3);
    this.load.spritesheet(
      "greenEnemy",
      "assets/images/green_enemy.png",
      52,
      48,
      3
    );
    this.load.spritesheet(
      "yellowEnemy",
      "assets/images/yellow_enemy.png",
      52,
      48,
      3
    );
    this.load.text("level1", "assets/data/level1.json");
    this.load.text("level2", "assets/data/level2.json");
    this.load.text("level3", "assets/data/level3.json");
    //Load Music
    this.load.audio("orchestra", ["assets/audio/8bit-orchestra.ogg"]);
    this.load.audio("Victoria", ["assets/audio/Victoria.ogg"]);
    this.load.audio("Derrota", ["assets/audio/Derrota.ogg"]);
    //Load audios
    this.load.audio("end_level", ["assets/audio/end_level.wav"]);
    this.load.audio("enemy_die", ["assets/audio/enemy_die.wav"]);
    this.load.audio("enemy_shoot", ["assets/audio/enemy_shoot.mp3"]);
    this.load.audio("int_tp", ["assets/audio/in_tp.wav"]);
    this.load.audio("init_level", ["assets/audio/init_level.wav"]);
    this.load.audio("out_tp", ["assets/audio/out_tp.wav"]);
    this.load.audio("player_die", ["assets/audio/player_die.wav"]);
    this.load.audio("player_shoot", ["assets/audio/player_shoot.wav"]);
  },
  create: function () {
    this.state.start("Menu");
  },
};
