var Q = Quintus({audioSupported: [ 'wav','mp3' ]})
  .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio')
  .setup({ maximize: true })
  .enableSound()
  .controls().touch();

/***********************************
 * 1) Adjusting the game
 **********************************/
var ball_speed = 7;
var ball_size = 2;
var paddle_speed = 2;
var paddle_size = 4;


/***********************************
 * 2) Changin the level
 **********************************/
var brick_level = [
  [0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,2,0,0,0,2,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0]
];


Q.Sprite.extend('Brick', {
  init: function(p) {
    this._super(p, {
      sheet: 'brick',
      scale: 1,
      gravity: 0
    });
    this.add('2d, aiBounce');
    this.on("bump.bottom, bump.top, bump.left, bump.right", function (collision) {
      this.destroy();
    });
  }
});

Q.Sprite.extend('Paddle', {
  init: function(p) {
    this._super(p, {
      sheet: 'bar',
      gravity: 0,
      scale: 0.5,
      started: false
    });
    this.add('2d, aiBounce, platformerControls');
    Q.input.on('fire', this, 'fireBall');
  },
  fireBall: function () {
    if (this.p.started) {
      return;
    }

    this.stage.insert(new Q.Ball({ x: 100, y: this.p.y - 10 }));
    this.p.started = true;
  },
  step: function (dt) {
    this.p.vx *= paddle_speed;
  }
});

Q.Sprite.extend('Ball', {
  init: function(p) {
    this._super(p, {
      sheet: 'ball',
      gravity: 0.2,
      vx: 50 * ball_speed,
      vy: -100 * ball_speed,
      scale: 0.1 * ball_size
    });

    this.add('2d, aiBounce');

    this.on("bump.bottom", function (collision) {
      this.p.vy = -100 * ball_speed;
    });

    this.on("bump.top", function (collision) {
      this.p.vy = 100 * ball_speed;
    });
  }
});

Q.scene('level1',function(stage) {
  stage.collisionLayer(new Q.TileLayer({ dataAsset: '/breakout_stage.json', sheet: 'tiles' }));

  stage.add('viewport');

  for (var br = 0; br < brick_level.length; br ++) {
    var row = brick_level[br];
    for (var i = 0; i < row.length; i ++) {
      if (brick_level[br][i] != 0 ) {
        stage.insert(new Q.Brick({
         x: (3 + ( (i + 1) * 66)),
         y: (100 + ( br * 34)),
         sheet: 'brick_' + brick_level[br][i]
       }));
      }
    }
  }

  stage.insert(new Q.Paddle({ x: 100, y: 700 }));
});

var files;

files = [
  '/breakout_stage.json',
  '/images/tiles.png',
  '/images/brick_1.png',
  '/images/brick_2.png',
  '/images/brick_3.png',
  '/images/brick_4.png',
  '/images/ball.png',
  '/images/bar.png'
];

Q.load(files.join(',') , function() {
  Q.sheet('tiles', '/images/tiles.png', { tilew: 32, tileh: 32 });
  Q.sheet('brick_1', '/images/brick_1.png', { tilew: 66, tileh: 25 });
  Q.sheet('brick_2', '/images/brick_2.png', { tilew: 66, tileh: 25 });
  Q.sheet('brick_3', '/images/brick_3.png', { tilew: 66, tileh: 25 });
  Q.sheet('brick_4', '/images/brick_4.png', { tilew: 66, tileh: 25 });
  Q.sheet('ball', '/images/ball.png', { tilew: 128, tileh: 128 });
  Q.sheet('bar', '/images/bar.png', { tilew: 34.125 * paddle_size, tileh: 34 });

  Q.stageScene('level1');
});
