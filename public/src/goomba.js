require([], function () {
  Q.Sprite.extend('Goomba',{
    init: function(p) {
      this._super(p, {
        sheet: 'goomba',
        sprite: 'goomba',
        vx: 100,
        scale: 0.15
      });
      this.add('2d, aiBounce, animation');

      this.on('bump.left,bump.right,bump.bottom',function(collision) {
        if(collision.obj.isA('Player')) {
          collision.obj.trigger('damage');
        }
      });

      this.on('bump.top',function(collision) {
        if(collision.obj.isA('Player')) {
          this.destroy();
          collision.obj.p.vy = -300;
        }
      });
    },
    step: function () {
      this.play('walk');
    }
  });
});
