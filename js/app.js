var rows = [60, 143, 226];
var enemySpeed = [70, 100, 160, 200];
var columns = [0, 101, 202, 303, 404, 505, 606, 707, 808];
var gemImages = ['images/gemOrange.png', 'images/gemBlue.png', 'images/gemGreen.png'];
var bulletImages = ['images/Star.png', 'images/Rock.png'];
var gamePaused = true;

// Randomly choose an element from an array.
var choice = function (array) {
    return array[Math.floor(Math.random() * array.length)];
};



// Enemies to avoid.
var Enemy = function() {
  this.sprite = 'images/enemy-bug.png';
  this.x = -100;
  this.y = choice(rows);
  this.width = 70;
  this.height = 83;
  this.speed = choice(enemySpeed);
}
// Update enemy's position.
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if (!gamePaused) {
    this.x += this.speed * dt;
    // if bug crawls off the canvas
    if (this.x > 960) {
      // place him back at the beginning
      this.reset();
    }
  }
  // Check for collision with player
  if (this.checkCollision()){
    player.reset();
    heartCount.decrease();
  }
  // Check for collision with bullet
  for (var i = 0; i < allBullets.length; i++){
    var bullet = allBullets[i];
    if (bullet.checkCollision(this)){
      this.reset();
      allBullets.splice(bullet);
      score.bugsKilled += 1;
      //  Update score  //
      $(".numKills").text(score.bugsKilled);
    }
  }
}

Enemy.prototype.checkCollision = function(){
        // create enemy variables for comparison
    var charX = this.x,
        charWidth = this.width,
        charY = this.y,
        charHeight = this.height,
        // Create bullet variables for comparison
        obstacleX = player.x,
        obstacleWidth = player.width,
        obstacleY = player.y,
        obstacleHeight = player.height,
        // Define vars to track collision on x axis and on y axis
        verticalCollision = false,
        horizontalCollision = false,
        // Define bounds of character and obstacle
        charRight = charX + charWidth,
        charBottom = charY + charHeight,
        obstacleRight = obstacleX + obstacleWidth,
        obstacleBottom = obstacleY + obstacleHeight;
      // Is character's top or bottom is between the top and bottom of obstacle?
      if ((charY > obstacleY && charY < obstacleBottom) ||
         (charBottom > obstacleY && charY < obstacleBottom)){
           verticalCollision = true;
         }
      // Is character's left or right is between the left and right of obstacle
      if ((charX > obstacleX && charX < obstacleRight) ||
         (charRight > obstacleX && charX < obstacleRight )){
           horizontalCollision = true;
         }
    return verticalCollision && horizontalCollision;
  }

Enemy.prototype.reset = function() {
  this.x = -100;
  this.y = this.y + 83;
  this.speed = choice(enemySpeed);
  if (this.y > 226) {
    this.y = 60;
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
  this.width = 50;
  this.height = 50;
  this.lives = 3;  // Keep track of player lives.
  this.gunFound = false;
}

Player.prototype.update = function() {
  if (!gamePaused){
    if (this.ctlKey === 'left' && this.x != 0) {
      this.x = this.x - 101;
    } else if (this.ctlKey === 'right' && this.x != 808) {
      this.x = this.x + 101;
    } else if (this.ctlKey === 'up') {
      this.y = this.y - 83;
    } else if (this.ctlKey === 'down' && this.y != 392) {
      this.y = this.y + 83;
    } else if (this.ctlKey === 'space' && this.gunFound) {
      allBullets.push(new Bullet());
    }
    this.ctlKey = null;

    if (this.y < 60) {
      player.reset();
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
  this.x = choice(columns);
  this.y = choice(rows);
  this.count = 0;
}

// Update gem position when player touches it.
Gem.prototype.update = function() {
  if (player.x === this.x && player.y === this.y) {
    this.gemImg = choice(gemImages);
    this.x = choice(columns);
    this.y = choice(rows);
    this.count += 1;
    //////////  Update score  //////////
    $(".numGems").text(this.count);
    // Award Gun if 10 gems collected
    if (this.count == 10){
      gamePaused = true;
      player.gunFound = true;
      $("#GunModal").addClass('show');
      $(".kills").css("visibility", 'visible');
      $(".close").on("click", function(){
        gamePaused = false;
        $("#GunModal").removeClass('show');
      });
    }
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
    gamePaused = true;
    $("#GOModal").addClass('show');
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

var Bullet = function() {
  this.sprite = 'images/Star.png';
  this.speed = 500;
  this.x = player.x + 30;
  this.y = player.y + 35;
  this.height = 10;
  this.width = 13;
}

Bullet.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Bullet.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if (!gamePaused){
    this.y -= this.speed * dt;
    // Remove the bullet if it goes offscreen
  }
  if (this.y < 65){
    allBullets.splice(this);
  }
}
Bullet.prototype.checkCollision = function(enemy){
        // create enemy variables for comparison
    var charX = enemy.x,
        charWidth = enemy.width,
        charY = enemy.y,
        charHeight = enemy.height,
        // Create bullet variables for comparison
        obstacleX = this.x,
        obstacleWidth = this.width,
        obstacleY = this.y,
        obstacleHeight = this.height,
        // Define vars to track collision on x axis and on y axis
        verticalCollision = false,
        horizontalCollision = false,
        // Define bounds of character and obstacle
        charRight = charX + charWidth,
        charBottom = charY + charHeight,
        obstacleRight = obstacleX + obstacleWidth,
        obstacleBottom = obstacleY + obstacleHeight;
      // Is character's top or bottom is between the top and bottom of obstacle?
      if ((charY > obstacleY && charY < obstacleBottom) ||
         (charBottom > obstacleY && charY < obstacleBottom)){
           verticalCollision = true;
         }
      // Is character's left or right is between the left and right of obstacle
      if ((charX > obstacleX && charX < obstacleRight) ||
         (charRight > obstacleX && charX < obstacleRight )){
           horizontalCollision = true;
         }
    return verticalCollision && horizontalCollision;
  }

var score = {
  bugsKilled: 0,
  gemsCollected: 0
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
var bulletA = new Bullet();
var bulletB = new Bullet();
var bulletC = new Bullet();
var allBullets = [];

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

$("#InstructionsModal .close").on("click", function(){
  $("#InstructionsModal").removeClass('show')
  gamePaused = false;
});
