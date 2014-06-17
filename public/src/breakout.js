var Q = Quintus({audioSupported: [ 'wav','mp3' ]})
  .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio')
  .setup({ maximize: true })
  .enableSound()
  .controls().touch();

var number_of_bricks = 0;
var total_score = 0;

/***********************************
 * 1) Adjusting the game
 **********************************/
var ball_speed = 5;
var ball_size = 7;
var paddle_speed = 5;
var paddle_size = 20;
var your_name = 'Jigar';


/***********************************
 * 2) Changin the level
 **********************************/
var brick_level = [
  [0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,0,0,0,0],
  [0,0,0,0,0,3,0,0,0,0,0],
  [0,0,0,2,0,3,0,2,0,0,0],
  [0,0,0,0,0,4,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0]
];

function playSound(soundFilePath) {
  Q.audio.play('/sounds/' + soundFilePath);
};

Q.Sprite.extend('Brick', {
  init: function(p) {
    this._super(p, {
      sheet: 'brick',
      scale: 1,
      gravity: 0,
      value: 0
    });
    this.add('2d, aiBounce');
    this.on("bump.bottom, bump.top, bump.left, bump.right", function (collision) {
      Q.stageScene('brickDestroyed', 1, { score: this.p.value });
      this.destroy();
    });
    number_of_bricks += 1;
  }
});

Q.Sprite.extend('Paddle', {
  init: function(p) {
    this._super(p, {
      sheet: 'paddle',
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

    this.stage.insert(new Q.Ball({ x: this.p.x, y: this.p.y - 100 }));
    this.p.started = true;

    this.on('hit.sprite', function (collision) {
      this.p.vx = 0;
    });
  },
  step: function (dt) {
    this.p.vx *= paddle_speed;
    console.log(this.p.x, this.p.vx);
  }
});

Q.Sprite.extend('Ball', {
  init: function(p) {
    this._super(p, {
      sheet: 'ball',
      gravity: 0,
      vx: 50 * ball_speed,
      vy: -100 * ball_speed,
      scale: 0.1 * ball_size
    });

    this.add('2d, aiBounce');

    this.on("bump.bottom", function (collision) {
      this.p.vy = -100 * ball_speed;

      if (collision.obj.isA('TileLayer')) {
        this.destroy();
        Q.stageScene('endGame', 1, { label: 'You lost, ' + your_name + '!' });
      } else if (collision.obj.isA('Paddle')) {
        if (
          (collision.obj.p.vx > 0 && this.p.vx < 0)
          ||
          (collision.obj.p.vx < 0 && this.p.vx > 0)
          ) {
          debugger;
          this.p.vx = -1 * this.p.vx;
        }
      }
    });

    this.on("bump.top", function (collision) {
      this.p.vy = 100 * ball_speed;
    });

    this.on('bump.bottom, bump.top, bump.left, bump.right', function () {
      /***********************************
       * 3) Add sound code here
       **********************************/
      playSound('collision.wav');
    });
  },
  step: function () {
    if (number_of_bricks <= 0) {
      this.destroy();
    }
  }
});

Q.scene('level1',function(stage) {
  number_of_bricks = 0;
  total_score = 0;

  stage.collisionLayer(new Q.TileLayer({ dataAsset: '/breakout_stage.json', sheet: 'tiles' }));
  stage.add('viewport');

  for (var br = 0; br < brick_level.length; br++) {
    var row = brick_level[br];
    for (var i = 0; i < row.length; i++) {
      if (brick_level[br][i] != 0 ) {
        stage.insert(
          new Q.Brick({
            x: (3 + ((i + 1) * 66)),
            y: (100 + ( br * 34)),
            sheet: 'brick_' + brick_level[br][i],
            value: (10 * brick_level[br][i])
          })
        );

      }
    }
  }

  stage.insert(new Q.Paddle({ x: 400, y: 800 }));
});

Q.scene('hud',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: 50, y: 0
  }));

  var label = container.insert(new Q.UI.Text({
    x: 50,
    y: 20,
    label: "Score: " + total_score,
    color: "white"
  }));

  container.fit(20);
});

Q.scene('brickDestroyed',function(stage) {
  number_of_bricks -= 1;

  total_score += stage.options.score;
  Q.stageScene('hud', 3);

  if(number_of_bricks <= 0) {
    Q.stageScene('endGame', 1, { label: 'You won, ' + your_name + '!' });
  }
});

Q.scene('endGame',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: 400, y: Q.height/2, fill: 'rgba(0,0,0,0.5)'
  }));

  var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: '#CCCCCC', label: 'Play Again' }))
  var label = box.insert(new Q.UI.Text({ x:10, y: -10 - button.p.h, label: stage.options.label }));
  button.on('click',function() {
    Q.clearStages();
    Q.stageScene('level1');
  });

  box.fit(20);
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
  '/images/paddle.png',
  '/sounds/collision.wav'
];

Q.load(files.join(',') , function() {
  Q.sheet('tiles', '/images/tiles.png', { tilew: 32, tileh: 32 });
  Q.sheet('brick_1', '/images/brick_1.png', { tilew: 66, tileh: 25 });
  Q.sheet('brick_2', '/images/brick_2.png', { tilew: 66, tileh: 25 });
  Q.sheet('brick_3', '/images/brick_3.png', { tilew: 66, tileh: 25 });
  Q.sheet('brick_4', '/images/brick_4.png', { tilew: 66, tileh: 25 });
  Q.sheet('ball', '/images/ball.png', { tilew: 128, tileh: 128 });
  Q.sheet('paddle', '/images/paddle.png', { tilew: 34.125 * paddle_size, tileh: 50 });

  Q.stageScene('level1');
});
