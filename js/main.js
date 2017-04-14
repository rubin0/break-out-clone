//BEGIN game objects

//Bar Object
function Bar(game, x, y){
	Phaser.Sprite.call(this, game, x, y, 'bar');
	
	this.game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.body.allowGravity = false;
	this.body.immovable = true;
	
	game.add.existing(this);
}

Bar.prototype = Object.create(Phaser.Sprite.prototype);
Bar.prototype.constructor = Bar;

Bar.prototype.move = function (direction) {
	const speed = 500;
    this.body.velocity.x = direction * speed;
};

//Ball Object
function Ball(game, x, y){
	Phaser.Sprite.call(this, game, x, y, 'ball');
	
	this.game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.body.allowGravity = false;
	this.body.bounce.set(1);
	
	game.add.existing(this);
}

Ball.prototype = Object.create(Phaser.Sprite.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.move = function (directionX, directionY) {
	const speed = 500;
    this.body.velocity.x = directionX * speed;
	this.body.velocity.y = directionY * speed;
};

//Block Object
function Block(game, x, y){
	Phaser.Sprite.call(this, game, x, y, 'block');
	
	this.game.physics.enable(this);
	this.body.allowGravity = false;
	this.body.immovable = true;
	
	game.add.existing(this);
}
Block.prototype = Object.create(Phaser.Sprite.prototype);
Block.prototype.constructor = Block;

//END game objects

//BEGIN game logic
/*
Phaser Game Logic
1) init
2) preload
3) create
GAME LOOP INIZIO (REPEATED)
4) update
5) render
GAME LOOP FINE
6) shutdown
*/

PlayState = {};
var blockCount = 0;
PlayState.init = function (){
	this.game.renderer.renderSession.roundPixels = true;
	
	this.keys = this.game.input.keyboard.addKeys({
		left: Phaser.KeyCode.A,
		right: Phaser.KeyCode.D,
		space: Phaser.KeyCode.R
	});
	blockCount = 0;
};

PlayState.preload = function () {
    this.game.load.image('background', 'images/background.png');
	this.game.load.image('block','images/block_2x1.png');
	this.game.load.image('bar','images/bar.png');
	this.game.load.image('ball','images/ball.png');
	
	this.game.load.bitmapFont('gem', 'images/gem.png', 'images/gem.xml');
	
	this.game.load.json('level:0','data/level00.json');
};

var blockGroup;

PlayState.create = function () {
    this.game.add.image(0, 0, 'background');
	this._loadLevel(this.game.cache.getJSON('level:0'));
	
	blockGroup = game.add.group();
	
	this.ball.body.velocity.x = 200;
	this.ball.body.velocity.y = -200;
	
	this._createHud();
};

PlayState.update = function(){
	
	this._checkCollision();
	this._checkLoseCondition();
	this._checkWinCondition();
	this._handleInput();
	this._moveBall();
};


PlayState.render = function(){
	//game.debug.text( this.blockGroup.length, 20, 20 );
};

//END game logic
//functions
PlayState._loadLevel = function (jsonData){
	this.blockGroup = this.game.add.group();
	
	//spawn bar and ball
	this._spawnBar({bar: jsonData.bar});
	this._spawnBall({ball: jsonData.ball});
	this._spawnBlock({block: jsonData.blocks});
	
};

PlayState._spawnBlock = function (jsonData){
	jsonData.block.forEach(function (block) {
        let sprite = new Block(this.game, block.x, block.y);
        this.blockGroup.add(sprite);
    }, this);
};


PlayState._spawnBar = function (data){
	this.bar = new Bar(this.game, data.bar.x, data.bar.y);
};

PlayState._checkLoseCondition = function (){
	if(this.ball.y >= (game.world.height - this.ball.height)){
		this.ball.body.velocity = (0,0);
		
		gameOverText = this.game.add.bitmapText(0, 0, 'gem', "GAME OVER", 50);
		gameOverText.updateTransform();
		gameOverText.position.x = (this.game.world.width / 2 - gameOverText.textWidth / 2);
		gameOverText.position.y = (this.game.world.height / 2 - gameOverText.textHeight / 2);
		gameOverText.updateTransform();
	}
};

PlayState._checkWinCondition = function (){
	if(blockCount >= this.blockGroup.length){
	  console.log('win');
	}
};

PlayState._spawnBall = function (data){
	this.ball = new Ball(this.game, data.ball.x, data.ball.y);
};

PlayState._handleInput = function(){
	if(this.keys.left.isDown){
		this.bar.move(-1);
	} else if(this.keys.right.isDown){
		this.bar.move(1);
	} else {
		this.bar.move(0);
	}
};

PlayState._moveBall = function(){
	if(this.keys.space.isDown){
	  this.game.state.start("play"); 	
	}
};

PlayState._checkCollision = function(){
	this.game.physics.arcade.collide(this.ball, this.bar);
	this.game.physics.arcade.collide(this.blockGroup, this.ball, this._onBallvsBlock);
};
var scoreFont;
var scoreText;
var infotext;
PlayState._createHud = function () {
	
    scoreText = "Punteggio: 0";
	scoreFont = this.game.add.bitmapText(32, 32, 'gem', scoreText, 32);
	
	info = "Press 'R' to restart"
	textFont = this.game.add.bitmapText(600, 32, 'gem', info, 32);

    this.hud = this.game.add.group();
    this.hud.add(scoreFont);

};

PlayState._onBallvsBlock = function (ball, block) {
	block.kill();
	blockCount += 1;
	scoreText = "Punteggio: " +blockCount.toString();
	scoreFont.text = scoreText;
} 

GameOverState = {};
MenuState = {};
/*
1) init
2) preload
3) create
GAME LOOP INIZIO (REPEATED)
4) update
5) render
GAME LOOP FINE
6) shutdown
*/
MenuState.preload = function(){
	this.game.load.image('menubg', 'images/menubg.png');
	this.game.load.bitmapFont('gem', 'images/gem.png', 'images/gem.xml');
	
	this.keys = this.game.input.keyboard.addKeys({
		space: Phaser.KeyCode.SPACEBAR
	});
}

MenuState.create = function(){
	this.game.add.image(0, 0, 'menubg');
}

MenuState.update = function(){
	startText = this.game.add.bitmapText(0, 0, 'gem', "PRESS SPACEBAR\nTO BEGIN!", 50);
		startText.updateTransform();
		startText.position.x = (this.game.world.width / 2 - startText.textWidth / 2);
		startText.position.y = (this.game.world.height / 2 - startText.textHeight / 2);
		startText.updateTransform();
	if(this.keys.space.isDown){
	  this.game.state.start("play"); 	
	}
}
//main
/*
var game;
window.onload = function () {
    game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
	game.state.add('play', PlayState);
	game.state.add('gameover', GameOverState);
	game.state.add('menu', MenuState);
	game.state.start('menu');
};
*/