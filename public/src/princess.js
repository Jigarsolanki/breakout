require([], function () {
  Q.Sprite.extend("Princess", {
    init: function(p) {
      this._super(p, {
        sheet: 'princess',
        sprite: 'princess'
    });
      this.add('2d, animation');
    },
    step: function (dt) {
      this.play('cry');
    }
  });
});
