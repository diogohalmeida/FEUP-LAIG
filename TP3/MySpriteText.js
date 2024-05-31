class MySpriteText{
	constructor(scene,text){
		this.scene = scene;
		this.text = text;
		this.spriteSheet = new MySpriteSheet(this.scene,"./scenes/images/alphabet.png",16,16);
		this.squares = [];

		for (var i = 0; i < text.length; i++) {
			this.squares.push(new MyRectangle(scene,0,0,1.0,1.0));
		}
		
	}

	getCharacterPosition(character){
		this.spriteSheet.activateCellP(character.charCodeAt(0));
	}

	display(){
		this.scene.gl.enable(this.scene.gl.BLEND);         // enables blending
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
		this.scene.gl.depthMask(false);

		this.scene.pushMatrix();
		this.scene.setActiveShaderSimple(this.spriteSheet.shader);
		this.spriteSheet.texture.bind();

		for (var i = 0; i < this.text.length; i++) {
			this.getCharacterPosition(this.text[i]);
			this.squares[i].display();
			this.scene.translate(0.5,0,0);
		}

		this.spriteSheet.texture.unbind();
		this.scene.setActiveShaderSimple(this.scene.defaultShader);
		this.scene.popMatrix();

		this.scene.gl.disable(this.scene.gl.BLEND);
        this.scene.gl.depthMask(true);
	}

	updateTexCoords(afs,aft){
		for (var i = 0; i < this.squares.length; i++) {
			this.squares[i].updateTexCoords(afs,aft);
		}
	}
}