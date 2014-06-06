require([], function () {
  Q.Sprite.extend("Fireball",{
    init: function(p) {
      this._super(p, {
        sheet: "fireball",
        dist: 0,
        scale: 0.5
      });
      this.add('2d, aiBounce');

      this.on("bump.left,bump.right,bump.up,bump.down", function (collision) {
        if(collision.obj.isA("Enemy")) {
          collision.obj.destroy();
          this.destroy();
        }

        if(collision.obj.isA('Boss')) {
          this.destroy();
          collision.obj.trigger('fireball_hit');
        }
      });
    },
    step: function (dt) {
      this.p.angle = this.p.x % 360;
      this.p.y = this.p.y + Math.sin(this.p.angle) * 3;
      this.p.dist += 1;

      if (this.p.dist === 60) {
        this.destroy();
      }
    }
  });
});
