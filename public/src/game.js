var Q = Quintus({audioSupported: [ 'wav','mp3' ]})
      .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio')
      .setup({ maximize: true })
      .enableSound()
      .controls().touch();

Q.animations('player', {
  run_left: { frames: [3, 1, 2], rate: 1/5 },
  run_right: { frames: [3, 1, 2], rate: 1/5 },
  stand_right: { frames: [4], rate: 1/3 },
  stand_left: { frames: [4], rate: 1/3 },
});

Q.animations('princess', {
  cry: { frames: [1, 2, 3, 4, 5, 6, 7], rate: 1/2 }
});

Q.animations('boss', {
  walk: { frames: [1, 2, 3, 4, 5], rate: 1/2 }
});

Q.animations('coin', {
  shine: { frames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], rate: 1/10 }
});

require(['./src/player', './src/boss', './src/mashroom', './src/princess', './src/coin'], function (Player, Boss, Mashroom, Princess, Coin) {
  Q.Sprite.extend("Enemy",{
    init: function(p) {
      this._super(p, { sheet: 'enemy', vx: 100 });
      this.add('2d, aiBounce');

      this.on("bump.left,bump.right,bump.bottom",function(collision) {
        if(collision.obj.isA("Player")) {
          Q.audio.play('/sounds/mario_die.wav');
          Q.stageScene("endGame",1, { label: "You Died" });
          collision.obj.destroy();
        }
      });

      this.on("bump.top",function(collision) {
        if(collision.obj.isA("Player")) {
          this.destroy();
          collision.obj.p.vy = -300;
        }
      });
    }
  });

  Q.scene("level1",function(stage) {
    stage.insert(new Q.Repeater({ asset: "/images/background.png", speedX: 0.5, speedY: 0.5, scale: 1 }));
    stage.collisionLayer(new Q.TileLayer({ dataAsset: '/level.json', sheet: 'tiles' }));
    var player = stage.insert(new Q.Player({ x: 400, y: 0 }));
    // var boss = stage.insert(new Q.Boss({ x: 150, y: 70 }));
    var mashroom = stage.insert(new Q.Mashroom({ x: 250, y: 150 }))

    stage.add("viewport").follow(player);

    stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    stage.insert(new Q.Enemy({ x: 700, y: 100 }));

    stage.insert(new Q.Princess({ x: 40, y: 0 }));

    stage.insert(new Q.Coin({ x: 70, y: 190 }));
    stage.insert(new Q.Coin({ x: 100, y: 190 }));
    stage.insert(new Q.Coin({ x: 130, y: 190 }));
    stage.insert(new Q.Coin({ x: 160, y: 190 }));
    stage.insert(new Q.Coin({ x: 190, y: 190 }));
    stage.insert(new Q.Coin({ x: 220, y: 190 }));
    stage.insert(new Q.Coin({ x: 250, y: 190 }));
  });

  Q.scene('endGame',function(stage) {
    var box = stage.insert(new Q.UI.Container({
      x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
    }));

    var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", label: "Play Again" }))
    var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h,
                                          label: stage.options.label }));
    button.on("click",function() {
      Q.clearStages();
      Q.stageScene('level1');
    });

    box.fit(20);
  });

  var images;

  images = [
    '/images/mashroom.png',
    '/images/background.png',
    '/level.json',
    '/images/tiles.png',
    '/images/princess.gif',
    '/images/goomba.gif',
    '/images/boss.png',
    '/images/mario1.png',
    '/images/mario_fireball.gif',
    '/images/boss_fireball.gif',
    '/images/coin.png',
    '/sounds/fireball.wav',
    '/sounds/boss_fireball.wav',
    '/sounds/mario_die.wav',
    '/sounds/coin.wav'
  ];

  Q.load(images.join(',') , function() {
    Q.sheet("tiles","/images/tiles.png", { tilew: 32, tileh: 32 });
    Q.sheet("player", "/images/mario1.png", { tilew: 25, tileh: 32 });
    Q.sheet("princess", "/images/princess.gif", { tilew: 24, tileh: 44 });
    Q.sheet("boss", "/images/boss.png", { tilew: 51 , tileh: 46 });
    Q.sheet("enemy", "/images/goomba.gif", { tilew: 32, tileh: 32 });
    Q.sheet("mashroom", "/images/mashroom.png", { tilew: 483, tileh: 480 });
    Q.sheet("fireball", "/images/mario_fireball.gif", { tilew: 20, tileh: 20 });
    Q.sheet("bossfire", "/images/boss_fireball.gif", { tilew: 48, tileh: 16 });
    Q.sheet("coin", "/images/coin.png", { tilew: 32, tileh: 32 });
    Q.stageScene("level1");
  });
});
