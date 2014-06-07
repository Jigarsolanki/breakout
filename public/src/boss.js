require(['./src/boss_fire'], function (BossFire) {
  Q.Sprite.extend("Boss",{
    init: function(p) {
      this._super(p, {
        sheet: "boss",
        sprite: 'boss',
        frameJumpCount: 0,
        life: 100,
        scale: 1.25,
        fireCollapsedTime: 0
      });
      this.add('2d, aiBounce, animation');

      this.on("bump.left,bump.right,bump.bottom,bump.top",function(collision) {
        if(collision.obj.isA("Player")) {
          collision.obj.trigger('damage');
        }
      });

      this.on('fireball_hit', function () {

        this.p.life -= 10;

        if (this.p.life <= 0) {
          this.destroy();
        }
      })
    },
    step: function (dt) {
      var currentFrame;

      currentFrame = this.p.frameJumpCount++;

      if (currentFrame > 100 && currentFrame < 200 && currentFrame!== 0) {
        this.p.x += 1;
      }

      if (currentFrame > 250 && currentFrame < 350 && currentFrame!== 0) {
        this.p.x -= 1;
      }

      if (currentFrame > 350) {
        this.p.frameJumpCount = 0;
      }

      this.p.fireCollapsedTime += 1;

      if (this.p.fireCollapsedTime >= 200) {
        this.p.fireCollapsedTime = 0;

        this.stage.insert(new Q.BossFire({ x: this.p.x + 30, y: this.p.y, vx: 250, vy: 0 }));

        Q.audio.play('/sounds/boss_fireball.wav');
      }

      this.play('walk');
    }
  });
});
