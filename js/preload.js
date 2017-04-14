var preload = function(game){
};

preload.prototype = { 
	preload: function(){
		this.game.add.image(0, 0, 'background');
		var loadingBar = this.add.sprite(this.game.width / 2,this.game.height / 2,"loading");
		loadingBar.scale.setTo(2, 2);
		loadingBar.anchor.setTo(0.5,0.5);
		this.load.setPreloadSprite(loadingBar);
			
		this.game.load.image('block','images/block_2x1.png');
		this.game.load.image('bar','images/bar.png');
		this.game.load.image('ball','images/ball.png');
		this.game.load.image('menubg', 'images/menubg.png');
		this.game.load.spritesheet('star', 'images/staranim.png', 25, 25, 4);
		
		this.game.load.bitmapFont('gem', 'images/gem.png', 'images/gem.xml');
		
		this.game.load.json('level:0','data/level00.json');
		
	},
	create: function(){
		this.game.state.start("gametitle");
	}
};