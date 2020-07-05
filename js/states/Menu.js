Menu = function () {};

Menu.prototype = {
  create: function () {
    this.background = this.game.add.tileSprite(
      0,
      0,
      this.game.world.width,
      this.game.world.height,
      "space"
    );
    this.logo = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY - 200,
      "logo"
    );
    this.logo.anchor.setTo(0.5);
    this.logo.scale.setTo(0.5);

    this.button1 = this.add.sprite(0, 0, "greenEnemy");
    this.button1.anchor.setTo(0.5);
    this.button1.x = this.game.width * 0.25;
    this.button1.y = this.game.world.centerY;
    this.button1.width = 2.5 * this.button1.width;
    this.button1.height = 2.5 * this.button1.height;
    this.button1.inputEnabled = true;
    this.button1.currentLevel = 1;
    this.button1.events.onInputDown.add(this.goGame, this, 0, "1");

    this.nivel_1_text = this.game.add.text(
      this.game.width * 0.2,
      this.game.world.centerY - this.button1.height,
      "Nivel 1"
    );
    this.nivel_1_text.fill = "#FFFFFF";

    this.button2 = this.add.sprite(0, 0, "yellowEnemy");
    this.button2.anchor.setTo(0.5);
    this.button2.x = this.game.width * 0.5;
    this.button2.y = this.game.world.centerY;
    this.button2.width = 2.5 * this.button2.width;
    this.button2.height = 2.5 * this.button2.height;
    this.button2.inputEnabled = true;
    this.button2.currentLevel = 2;
    this.button2.events.onInputDown.add(this.goGame, this, 0, "2");

    this.nivel_2_text = this.game.add.text(
      this.game.width * 0.45,
      this.game.world.centerY - this.button2.height,
      "Nivel 2"
    );
    this.nivel_2_text.fill = "#FFFFFF";

    this.button3 = this.add.sprite(0, 0, "redEnemy");
    this.button3.anchor.setTo(0.5);
    this.button3.x = this.game.width * 0.75;
    this.button3.y = this.game.world.centerY;
    this.button3.width = 2.5 * this.button3.width;
    this.button3.height = 2.5 * this.button3.height;
    this.button3.inputEnabled = true;
    this.button3.currentLevel = 3;
    this.button3.events.onInputDown.add(this.goGame, this, 0, "3");

    this.nivel_3_text = this.game.add.text(
      this.game.width * 0.7,
      this.game.world.centerY - this.button3.height,
      "Nivel 3"
    );
    this.nivel_3_text.fill = "#FFFFFF";

    this.alumno_1 = this.add.sprite(0, 0, "man");
    this.alumno_1.anchor.setTo(0.5);
    this.alumno_1.scale.setTo(0.15);
    this.alumno_1.x = this.game.width * 0.1;
    this.alumno_1.y = this.game.height * 0.85;

    this.alumno_1_text = this.game.add.text(
      this.game.width * 0.15,
      this.game.height * 0.85,
      "Renzo Ravelli"
    );
    this.alumno_1_text.fill = "#FFFFFF";

    this.alumno_2 = this.add.sprite(0, 0, "man");
    this.alumno_2.anchor.setTo(0.5);

    this.alumno_2.scale.setTo(-0.15, 0.15);
    this.alumno_2.x = this.game.width * 0.9;
    this.alumno_2.y = this.game.height * 0.85;

    this.alumno_2_text = this.game.add.text(
      this.game.width * 0.575,
      this.game.height * 0.85,
      "Jose Maria Rojas"
    );
    this.alumno_2_text.fill = "#FFFFFF";
  },
  goGame: function (currentLevel) {
    this.state.start("Game", true, false, currentLevel.currentLevel, 3);
  },
};
