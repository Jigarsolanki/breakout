var Q = Quintus({audioSupported: [ 'wav','mp3' ]})
  .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio')
  .setup({ maximize: true })
  .enableSound()
  .controls().touch();

Q.gravityY = 0;
Q.gravityX = 0;

var total_score = 0;

/***********************************
 * 1) Adjusting the game
 **********************************/
var ball_speed = 100; // Max is 1500
var ball_size = 4; // Max is 45

var paddle_speed = 10; // Max is 30
var paddle_size = 5; // Max is 40


var your_name = 'The Great One!'; // Change this to your name


/***********************************
 * 2) Changin the level
 *  ------------------------------
 * | No | Color         | Points  |
 *  ------------------------------
 * | 1  | Green         | 10      |
 * | 2  | Orange        | 20      |
 * | 1  | Blue          | 30      |
 * | 2  | Purple        | 40      |
 *  ------------------------------
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

function playSound(soundFilePath) {
  Q.audio.play('/sounds/' + soundFilePath);
};

if (ball_speed > 1500 ) { ball_speed = 1500 };
if (ball_size > 45 ) { ball_size = 45 };
if (paddle_speed > 30) { paddle_speed = 30; }
if (paddle_size > 40) { paddle_size  = 40; }

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
      this.destroy();

      Q.stageScene('brickDestroyed', 1, { score: this.p.value });
    });
  }
});

Q.Sprite.extend('Paddle', {
  init: function(p) {
    this._super(p, {
      sheet: 'paddle',
      gravity: 0,
      scale: 0.5,
      started: false,
      initialY: p.y
    });
    this.add('2d, animation, platformerControls');
    Q.input.on('fire', this, 'fireBall');
  },
  fireBall: function () {
    if (this.p.started) {
      return;
    }

    this.stage.insert(new Q.Ball({ x: this.p.x, y: this.p.y - 10 }));
    this.p.started = true;

    this.on('hit.sprite', function (collision) {
      this.p.vx = 0;
    });
  },
  step: function (dt) {
    this.p.vx *= paddle_speed;
    this.p.y = this.p.initialY;

    if (this.p.started && Q('Ball').length <= 0 && Q('Brick').length != 0) {
      this.destroy();
      Q.stageScene('endGame', 1, { label: 'You lost, ' + your_name + '!' });
    }
  }
});

Q.Sprite.extend("Ball", {
    init: function(p) {
      this._super({
        sheet:"ball",
        sprite: "ball",
        speed: ball_speed,
        collisionMask: Q.SPRITE_DEFAULT,
        vx: 0,
        vy: 0,
        scale: 0.1 * ball_size
      },p);

      this.add("animation");
      this.on("inserted");
      this.on("hit",this,"collide");

    },
    collide: function(col) {
      /**********************************
       * 3) Call function here to add sound to ball collision
       **********************************/


      if(col.obj.isA("Paddle")) {
        var dx = (this.p.x - col.obj.p.x) / col.obj.p.w * 2.5;

        if(col.normalY <= 0) {
          this.p.vy = -this.p.speed;
        }
        this.p.vx = dx * this.p.speed;
      } else {
        if(col.normalY < -0.3) {
            this.p.vy = -Math.abs(this.p.vy);
        }
        if(col.normalY > 0.3) {
            this.p.vy = Math.abs(this.p.vy);
        }

        if(col.normalX < -0.3) {
            this.p.vx = -Math.abs(this.p.vx);
        }
        if(col.normalX > 0.3) {
            this.p.vx = Math.abs(this.p.vx);
        }
      }

      this.p.x -= col.separate[0];
      this.p.y -= col.separate[1];
    },
    inserted:function() {
      this.p.vy = this.p.speed;
      this.p.vx = this.p.speed;
    },
    step: function(dt) {
      this.p.x += this.p.vx * dt;
      this.p.y += this.p.vy * dt;

      this.stage.collide(this);

      if(this.p.x < 24) { this.p.vx = Math.abs(this.p.vx); }
      if(this.p.x > Q.width - 24) { this.p.vx = -Math.abs(this.p.vx); }

      if(this.p.y < 24) { this.p.vy = Math.abs(this.p.vy); }

      if(this.p.y > Q.height || Q('Brick').length <= 0) {
        this.destroy(); // Remove the ball if it's off the screen
      }
    }
});

Q.scene('level1',function(stage) {
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

  stage.insert(new Q.Paddle({ x: 400, y: 590 }));
  Q.stageScene('hud', 3);
});

Q.scene('hud',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: 40, y: -5
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
  total_score += stage.options.score;
  Q.stageScene('hud', 3);

  if(Q('Brick').length <= 1) {
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
