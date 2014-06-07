require(['./src/fireball'], function (Fireball) {
  Q.Sprite.extend('Player',{
    init: function(p) {
      this._super(p, {
        sheet: 'player',
        sprite: 'player',
        flip: 'x',
        canFire: false,
        health: 100
      });

      this.add('2d, platformerControls, animation');

      Q.input.on('fire',this,'fireWeapon');

      this.on('hit.sprite',function (collision) {
        if (collision.obj.isA('Princess')) {
          Q.stageScene('endGame', 1, { label: 'You Won!' });
          this.destroy();
          Q.audio.play('/sounds/world_clear.wav');
        }

        if (collision.obj.isA('Mashroom')){
          // this.p.scale = 1.5;
          this.p.canFire = true;
          Q.audio.play('/sounds/powerup.wav');
        }
      });

      this.on('damage', 'onDemage');
    },
    onDemage: function () {
      this.p.health -= 100;

      if (this.p.health > 0) {
        return;
      }
      Q.audio.play('/sounds/mario_die.wav');
      Q.stageScene("endGame",1, { label: "You Died" });
      this.destroy();
    },
    fireWeapon: function () {
      if (!this.p.canFire) {
        return;
      }

      if (this.p.direction === 'left') {
        this.stage.insert(new Q.Fireball({ x: this.p.x - 15, y: this.p.y, vx: -250 }));
      } else {
        this.stage.insert(new Q.Fireball({ x: this.p.x + 15, y: this.p.y, vx: 250 }));
      }

      Q.audio.play('/sounds/fireball.wav');
    },
    step: function (dt) {
      if(this.p.vx > 0) {
        this.p.flip='x';
        this.play('run_right');
      } else if(this.p.vx < 0) {
        this.p.flip='';
        this.play('run_left');
      } else {
        this.play('stand_' + this.p.direction);
      }
    }
  });
});
