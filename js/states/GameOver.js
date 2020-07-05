GameOver = function (game) {};

//prototype: para crear más funcionalidades
GameOver.prototype = {
  init: function (currentLevel) {
    this.msg = currentLevel == 4 ? "VICTORY" : "DEFEAT";
    this.gameover_theme = this.game.add.audio(
      currentLevel == 4 ? "Victoria" : "Derrota"
    );
    this.gameover_theme.play();
  },
  create: function () {
    this.background = this.game.add.tileSprite(
      0,
      0,
      this.game.world.width,
      this.game.world.height,
      "space"
    );

    this.msgTEXT = this.game.add.text(
      this.game.world.width * 0.5,
      this.game.world.height * 0.5,
      this.msg
    );
    this.msgTEXT.fill = "#FFFFFF";
    this.msgTEXT.inputEnabled = true;
    this.msgTEXT.events.onInputDown.add(this.GoToMenu, this);
  },
  GoToMenu: function () {
    this.gameover_theme.stop();
    this.state.start("Menu");
  },
};
