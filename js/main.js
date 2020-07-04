window.onload = function () {
  let game = new Phaser.Game("100%", "100%", Phaser.AUTO);
  game.state.add("Preload", Preload);
  game.state.add("Menu", Menu);
  game.state.add("Game", Game);
  game.state.add("GameOver", GameOver);
  game.state.start("Preload");
};
