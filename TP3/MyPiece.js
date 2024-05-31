class MyPiece extends CGFobject {

	constructor(scene,type,tile){
		super(scene);
		this.type = type;
		this.tile = tile; 
		this.body = new MyPieceModel(this.scene);
	}

	getType(){
		return this.type;
	}

	setType(type){
		this.type = type;
	}

	getTile(){
		return this.tile;
	}

	setTile(tile){
		this.tile = tile;
	}


	display(){
		this.scene.pushMatrix();
		this.scene.translate(0,0.2,0.05);
		this.scene.rotate(Math.PI/2,1,0,0);
		if(this.tile != null){

		}
		if(this.type == 1){
			this.scene.graph.materials["shinyBlack"].apply();
		}
		else if(this.type == 2){
			this.scene.graph.materials["red"].apply();
		}
		this.body.display();
		this.scene.popMatrix();
	}

}