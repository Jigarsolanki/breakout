require([], function () {
  Q.Sprite.extend("Coin",{
    init: function(p) {
      this._super(p, {
        sheet: "coin",
        sprite: "coin",
        distance: 0,
        scale: 0.75,
        gravity: 0,
        sensor: true
      });

      this.add("animation");
      this.on("sensor");
    },
    sensor: function (obj) {
      if (obj.isA('Player')) {
        Q.audio.play('/sounds/coin.wav');
        this.destroy();
      }
    },
    step: function (dt) {
      this.play('shine');
    }
  });
});
