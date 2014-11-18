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
    lastTime = Date.now();
    main();
  }

  function update(dt) {
    updateEntities(dt);
    allEnemies.forEach(function(enemy){
      allBullets.forEach(function(bullet){
      bullet.checkCollision(enemy);
      })
    })
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
    'images/Star.png',
  ]);
  Resources.onReady(init);

  global.ctx = ctx;
})(this);
