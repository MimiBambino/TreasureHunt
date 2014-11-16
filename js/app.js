$(".close").on("click", function(){
  $("#InstructionsModal").removeClass('show');
});
var enemyPosY = [60, 143, 226];
var enemySpeed = [70, 100, 160, 200];
var gemPosX = [0, 101, 202, 303, 404, 505, 606, 707, 808];
var gemImages = ['images/gemOrange.png', 'images/gemBlue.png', 'images/gemGreen.png'];

// Randomly choose an element from an array.
var choice = function (array) {
    return array[Math.floor(Math.random() * array.length)];
};

// Enemies to avoid.
var Enemy = function() {
  this.sprite = 'images/enemy-bug.png';
  this.x = -100;
  this.y = choice(enemyPosY);
  this.speed = choice(enemySpeed);
}
// Update enemy's position.
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if (!game.paused) {
    this.x = this.x + (this.speed * dt);
    if (this.x > 960) {
      this.x = -100;
      this.y = this.y + 83;
      this.speed = choice(enemySpeed);
      if (this.y > 226) {
        this.y = 60;
      }
    }
  }

  if (this.x > -50 && this.x < 50) {
    this.tileX = 0;
  } else if (this.x > 50 && this.x < 150) {
    this.tileX = 101;
  } else if (this.x > 150 && this.x < 250) {
    this.tileX = 202;
  } else if (this.x > 250 && this.x < 350) {
    this.tileX = 303;
  } else if (this.x > 350 && this.x < 450) {
    this.tileX = 404;
  } else if (this.x > 450 && this.x < 550) {
    this.tileX = 505;
  } else if (this.x > 550 && this.x < 650) {
    this.tileX = 606;
  } else if (this.x > 650 && this.x < 750) {
    this.tileX = 707;
  } else if (this.x > 750 && this.x < 850) {
    this.tileX = 808;
  } else if (this.x > 850) {
    this.tileX = 1;
  }

  if (player.x === this.tileX && player.y === this.y) {
    player.reset();
    heartCount.decrease();
  }
}

Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Player class
var Player = function() {
  this.pImg = 'images/char-princess-girl.png';
  this.x = 404;
  this.y = 392;
  this.lives = 3;  // Keep track of how many times player has died.
}

Player.prototype.update = function() {
  if (!game.paused){
    if (this.ctlKey === 'left' && this.x != 0) {
      this.x = this.x - 101;
    } else if (this.ctlKey === 'right' && this.x != 808) {
      this.x = this.x + 101;
    } else if (this.ctlKey === 'up') {
      this.y = this.y - 83;
    } else if (this.ctlKey === 'down' && this.y != 392) {
      this.y = this.y + 83;
    }
    this.ctlKey = null;

    if (this.y < 60) {
      this.reset();
      heartCount.decrease();
    }
  }
}

Player.prototype.reset = function() {
  this.x = 404;
  this.y = 392;
}

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.pImg), this.x, this.y);
}

Player.prototype.handleInput = function(key) {
  this.ctlKey = key;
}

// Choose gem and place on canvas.
var Gem = function() {
  this.gemImg = choice(gemImages);
  this.x = choice(gemPosX);
  this.y = choice(enemyPosY);
  this.count = 0;
}

// Update gem position when player touches it.
Gem.prototype.update = function() {
  if (player.x === this.x && player.y === this.y) {
    this.gemImg = choice(gemImages);
    this.x = choice(gemPosX);
    this.y = choice(enemyPosY);
    this.count += 1;
    if (this.count === 1){
      var scoreHTML = "<p class='score'>%score% Gem collected!</p>";
      var formattedScore = scoreHTML.replace("%score%", this.count);
    } else {
      var scoreHTML = "<p class='score'><span class='num'>%score%<span> Gems collected!</p>";
      var formattedScore = scoreHTML.replace("%score%", this.count);
    }
    $(".score").remove();
    //////////  Update score  //////////
    $(".gems").append(formattedScore);
  }
}

Gem.prototype.render = function() {
  ctx.drawImage(Resources.get(this.gemImg), this.x, this.y);
}

// Keep track of player lives
var Heart = function() {
  this.sprite = 'images/Heartsmall.png';
}

Heart.prototype.decrease = function() {
  if (player.lives > 0) {
    player.lives -= 1;
    this.display();
  } else {
    $(".heart").remove();
    game.paused = true;
    $("#GOModal").modal();
    $(".btn").text('Play Again!');
  }
}

Heart.prototype.display = function() {
  $(".heart").remove();
  for (var i = 0; i < player.lives; i++) {
    var HTML = "<div class='col-md-2 heart'><img src='%img%' alt='heart'></div>";
    var formattedHTML = HTML.replace("%img%", this.sprite);
    $(".hearts").append(formattedHTML);
  }
}

var Game = function(){
  this.paused = false;
};

var introMessage = "";
var gameOverMessage = "<h1>Game Over</h1><p>What a shame and you were doing so well. Would you like to play again?</p>";

////////////// Playing with Guns and Land Mines ///////////////

var bullets = [];
var explosions = [];
var isGunFound = true;
var lastFire = Date.now();

var Bullet = function() {
  this.bImg = 'img/bullet.png';
  this.speed = 500;
  this.shoot = function(){
      if (player.ctlKey === 'space' && isGunFound && Date.now() - lastFire > 100){
        var x = player.x;  // Figure out middle of player
        var y = player.y;  // Figure out middle of player

        bullets.push( { pos: [x, y],
                        dir: 'up',  // What does 'forward' mean?
                        sprite: this.bImg });
        lastFire = Date.now();
        }
    }
}

Bullet.prototype.render = function() {
  ctx.drawImage(Resources.get(this.bImg), this.x, this.y);
}

Bullet.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = this.x + (this.speed * dt);
  if (this.x > 960) {
    this.x = -100;
    this.y = this.y + 83;
    if (this.y > 226) {
      this.y = 60;
    }
  }

  if (this.x > -50 && this.x < 50) {
    this.tileX = 0;
  } else if (this.x > 50 && this.x < 150) {
    this.tileX = 101;
  } else if (this.x > 150 && this.x < 250) {
    this.tileX = 202;
  } else if (this.x > 250 && this.x < 350) {
    this.tileX = 303;
  } else if (this.x > 350 && this.x < 450) {
    this.tileX = 404;
  } else if (this.x > 450 && this.x < 550) {
    this.tileX = 505;
  } else if (this.x > 550 && this.x < 650) {
    this.tileX = 606;
  } else if (this.x > 650 && this.x < 750) {
    this.tileX = 707;
  } else if (this.x > 750 && this.x < 850) {
    this.tileX = 808;
  } else if (this.x > 850) {
    this.tileX = 1;
  }

  if (enemyA.x === this.tileX && enemyA.y === this.y) {
    enemyA.reset();
  }
}

///////////// End Playing with Guns and Land Mines /////////////

// Now instantiate your objects.
var enemyA = new Enemy();
var enemyB = new Enemy();
var enemyC = new Enemy();
var enemyD = new Enemy();
var allEnemies = [enemyA, enemyB, enemyC, enemyD];

var player = new Player();
var gem = new Gem();
var heartCount = new Heart();
var bullet = new Bullet();

var game = new Game();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    32: 'space'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});
// This listens for key presses and disables default scroll actions.
document.addEventListener('keydown', function(e) {
  if ([37, 38, 39, 40, 32].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);
