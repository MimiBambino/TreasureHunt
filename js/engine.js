var Engine = (function(global) {
  var doc = global.document,
    win = global.window,
    canvas = doc.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    patterns = {},
    lastTime;

  canvas.width = 909;
  canvas.height = 610;
  doc.getElementById('c').appendChild(canvas);

  function main() {
    var now = Date.now(),
      dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    win.requestAnimationFrame(main);
  };

  function init() {
    //reset();
    lastTime = Date.now();
    main();
  }

  function update(dt) {
    updateEntities(dt);
    // checkCollisions();
  }

  function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
    player.update();
    gem.update();
    for (var i = 0; i < allBullets.length; i++){
      var bullet = allBullets[i];
      bullet.update(dt);
    }
  }

  function render() {
    var rowImages = [
        'images/water-block.png',
        'images/stone-block.png',
        'images/stone-block.png',
        'images/stone-block.png',
        'images/grass-block.png',
        'images/grass-block.png'
      ],
      numRows = 6,
      numCols = 9,
      row, col;

    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    renderEntities();
  }

  function renderEntities() {
    allEnemies.forEach(function(enemy) {
      enemy.render();
    });
    allBullets.forEach(function(bullet){
      bullet.render();
    });
    player.render();
    gem.render();
  }

  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/char-princess-girl.png',
    'images/gemOrange.png',
    'images/gemBlue.png',
    'images/gemGreen.png',
    'images/bullet.png',
    'images/sprites.png'  // Load explosion and bullets
  ]);
  Resources.onReady(init);

  global.ctx = ctx;
})(this);

// Animation helper  from https://github.com/jlongster/canvas-game-bootstrap/blob/a878158f39a91b19725f726675c752683c9e1c08/js/sprite.js
/*
(function() {
    function Sprite(url, pos, size, speed, frames, dir, once) {
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.once = once;
    };

    Sprite.prototype = {
        update: function(dt) {
            this._index += this.speed*dt;
        },

        render: function(ctx) {
            var frame;

            if(this.speed > 0) {
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                frame = this.frames[idx % max];

                if(this.once && idx >= max) {
                    this.done = true;
                    return;
                }
            }
            else {
                frame = 0;
            }

            var x = this.pos[0];
            var y = this.pos[1];

            if(this.dir == 'vertical') {
                y += frame * this.size[1];
            }
            else {
                x += frame * this.size[0];
            }

            ctx.drawImage(resources.get(this.url),
                          x, y,
                          this.size[0], this.size[1],
                          0, 0,
                          this.size[0], this.size[1]);
        }
    };

    window.Sprite = Sprite;
})();
*/
