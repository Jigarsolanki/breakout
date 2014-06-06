require([], function () {
  Q.Sprite.extend("Mashroom",{
    init: function(p) {
      this._super(p, {
        sheet: "mashroom",
        vx: 80,
        scale: 0.05
      });
      this.add('2d, aiBounce');

      this.on("bump.left,bump.right,bump.bottom,bump.top", function (collision) {
        if(collision.obj.isA("Player")) {
          this.destroy();
        }
      });
    }
  });
});
