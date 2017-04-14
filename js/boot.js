var boot = function(game){
};
  
boot.prototype = {
	preload: function(){
          this.game.load.image("loading","images/loading.png"); 
		  this.game.load.image('background', 'images/background.png');
	},
  	create: function(){
		this.scale.maxWidth = 960;
		this.scale.maxHeight = 600;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.refresh();
		this.game.state.start("preload");
	}
}