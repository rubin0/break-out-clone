var gametitle = function(game){}

gametitle.prototype = {
	preload: function(){
		this.keys = this.game.input.keyboard.addKeys({
		  space: Phaser.KeyCode.SPACEBAR
		});
	},
	create: function(){	
		this.game.add.image(0, 0, 'menubg');
	},
	update: function(){
		var startText = this.game.add.bitmapText(0, 0, 'gem', "PRESS SPACEBAR\nTO BEGIN!", 50);
		startText.updateTransform();
		startText.position.x = (this.game.world.width / 2 - startText.textWidth / 2);
		startText.position.y = (this.game.world.height / 2 - startText.textHeight / 2);
		startText.updateTransform();
		if(this.keys.space.isDown){
		  this.game.state.start("maingame"); 	
		}
	}
}