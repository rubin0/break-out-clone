//Bar Object
function Bar(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'bar');

    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.allowGravity = false;
    this.body.immovable = true;
	this['speed'] = 500;
    game.add.existing(this);
}

Bar.prototype = Object.create(Phaser.Sprite.prototype);
Bar.prototype.constructor = Bar;

Bar.prototype.move = function(direction) {
    this.body.velocity.x = direction * this['speed'];
};

//Ball Object
function Ball(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'ball');

    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.allowGravity = false;
    this.body.bounce.set(1);

    game.add.existing(this);
}

Ball.prototype = Object.create(Phaser.Sprite.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.move = function(directionX, directionY) {
    const speed = 500;
    this.body.velocity.x = directionX * speed;
    this.body.velocity.y = directionY * speed;
};

//Block Object
function Block(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'block');

    this.game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.immovable = true;

    game.add.existing(this);
}
Block.prototype = Object.create(Phaser.Sprite.prototype);
Block.prototype.constructor = Block;

//Block Object
function Powerup(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'star');
	this.animations.add('rotate');

    this.animations.play('rotate', 12, true);
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
    this.game.physics.enable(this);
    this.body.allowGravity = true;

    game.add.existing(this);
}
Powerup.prototype = Object.create(Phaser.Sprite.prototype);
Powerup.prototype.constructor = Powerup;

Powerup.prototype.move = function() {
    const speed = 300;
    this.body.velocity.y = -speed;
};

//END game objects

var maingame = function(game) {
    blockCount = 0;
    blockGroup = null;
	scoreFont = null;
	scoreText = null;
	infotext = null;
}

maingame.prototype = {
    init: function() {
		blockCount = 0;
        this.game.renderer.renderSession.roundPixels = true;

        this.keys = this.game.input.keyboard.addKeys({
            left: Phaser.KeyCode.A,
            right: Phaser.KeyCode.D,
            rKey: Phaser.KeyCode.R
        });
    },
    create: function() {
        blockGroup = this.game.add.group();

        this.game.add.image(0, 0, 'background');
		
        this._loadLevel(this.game.cache.getJSON('level:0'));

        this.ball.body.velocity.x = 200;
        this.ball.body.velocity.y = -200;

        this._createHud();
    },
    update: function() {
        this._checkCollision();
        this._checkLoseCondition();
        this._checkWinCondition();
        this._handleInput();
		this._checkEvents();
    },
    render: function() {
         //this.game.debug.spriteInfo(this.ball, 32, 32);
    },
    _loadLevel: function(jsonData) {
        this.blockGroup = this.game.add.group();

        //spawn bar and ball
        this._spawnBar({
            bar: jsonData.bar
        });
        this._spawnBall({
            ball: jsonData.ball
        });
        this._spawnBlock({
            block: jsonData.blocks
        });

    },
    _spawnBlock: function(jsonData) {
        jsonData.block.forEach(function(block) {	
            let sprite = new Block(this.game, block.x, block.y);
            this.blockGroup.add(sprite);
        }, this);
    },
    _spawnBar: function(data) {
        this.bar = new Bar(this.game, data.bar.x, data.bar.y);
    },
    _checkLoseCondition: function() {
        if (this.ball.y >= (this.game.world.height - this.ball.height)) {
            this.ball.body.velocity = (0, 0);

            gameOverText = this.game.add.bitmapText(0, 0, 'gem', "GAME OVER", 50);
            gameOverText.position.x = (this.game.world.width / 2 - gameOverText.textWidth / 2);
            gameOverText.position.y = (this.game.world.height / 2 - gameOverText.textHeight / 2);
            gameOverText.updateTransform();
        }
    },
    _checkWinCondition: function() {
        if (blockCount >= this.blockGroup.length) {
            this.ball.body.velocity = (0, 0);
			this.bar.body.velocity = (0, 0);

            winText = this.game.add.bitmapText(0, 0, 'gem', "YOU WIN", 50);
            winText.position.x = (this.game.world.width / 2 - winText.textWidth / 2);
            winText.position.y = (this.game.world.height / 2 - winText.textHeight / 2);
            winText.updateTransform();
        }
    },
    _spawnBall: function(data) {
        this.ball = new Ball(this.game, data.ball.x, data.ball.y);
    },
    _handleInput: function() {
        if (this.keys.left.isDown) {
            this.bar.move(-1);
        } else if (this.keys.right.isDown) {
            this.bar.move(1);
        } else {
            this.bar.move(0);
        }
		
		if (this.keys.rKey.isDown) {
            this.game.state.start("boot");
        }
    },
    _checkCollision: function() {
        this.game.physics.arcade.collide(this.ball, this.bar);
        this.game.physics.arcade.collide(this.blockGroup, this.ball, this._onBallvsBlock, null, this);
		this.game.physics.arcade.overlap(this.bar, this.powerup, this._pickPowerUp);
    },
    _createHud: function() {
        scoreText = "Punteggio: 0";
        scoreFont = this.game.add.bitmapText(32, 32, 'gem', scoreText, 32);

        info = "Move with 'A'or'D' and press 'R' to RESTART"
        textFont = this.game.add.bitmapText(400, 36, 'gem', info, 25);

        this.hud = this.game.add.group();
        this.hud.add(scoreFont);

    },
    _onBallvsBlock: function(ball, block) {
		
		var rndmInt = this.game.rnd.integerInRange(0, 100);
		if(rndmInt>30 && rndmInt<60){
			this._spawnPowerUp(block);
		}
        block.kill();
        blockCount += 1;
		score += 15;
        scoreText = "Punteggio: " + score.toString();
        scoreFont.text = scoreText;
    },
	_spawnPowerUp: function(block){
		this.powerup = new Powerup(this.game, block.x+block.width/2, block.y+25);
		this.powerup.body.velocity.y = 250;
	},
	_pickPowerUp: function(bar, powerup){
		powerup.kill();
		bar.powerup = 1;
	},
	_checkEvents: function(){
		if(this.bar.powerup == 1){
			var barOriginalTint = this.bar.tint;
			this.bar['speed'] += 500;
			this.bar.powerup = 0;
			this.game.time.events.add(Phaser.Timer.SECOND * 5, function(){this.bar['speed']=500;}, this);
		} 
	}
	
}