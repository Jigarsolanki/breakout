require([], function () {
  Q.Sprite.extend("Fireball",{
    init: function(p) {
      this._super(p, {
        sheet: "fireball",
        dist: 0,
        scale: 0.5,
        sensor: true
      });

      this.add('2d, aiBounce');

      this.on("bump.left,bump.right", function (collision) {
        if (collision.obj.isA('Player')) {
          return;
        }

        // if (collision.obj.isDamagable()) {
          this.destroy();
        // }
      });
    },
    step: function (dt) {
      this.p.dist += 1;

      if (this.p.dist === 100) {
        this.destroy();
      }
    }
  });
});
